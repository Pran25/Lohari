package com.lohari.service;

import com.lohari.dto.AnalyticsDTO.*;
import com.lohari.model.Order;
import com.lohari.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    // ============================================
    // MAIN DASHBOARD — Sab kuch ek saath
    // ============================================
    public DashboardResponse getDashboard() {
        List<Order> allOrders = orderRepository.findAll();

        return new DashboardResponse(
            buildSummary(allOrders),
            buildMonthlyRevenue(allOrders, 6),
            buildOrdersByStatus(allOrders),
            buildTopProducts(allOrders, 5),
            buildTopCustomers(allOrders, 5)
        );
    }

    // ============================================
    // 1. SUMMARY STATS
    // ============================================
    public SummaryStats buildSummary(List<Order> orders) {
        long totalOrders = orders.size();

        long totalCustomers = orders.stream()
            .map(Order::getCustomerEmail)
            .filter(Objects::nonNull)
            .distinct()
            .count();

        BigDecimal totalRevenue = orders.stream()
            .filter(o -> !isCancelled(o))
            .map(o -> safeBigDecimal(o.getTotalAmount()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingPayments = orders.stream()
            .filter(o -> !isCancelled(o))
            .map(o -> safeBigDecimal(o.getBalanceAmount()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgOrderValue = totalOrders > 0
            ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        long completed = orders.stream().filter(this::isCompleted).count();
        long cancelled = orders.stream().filter(this::isCancelled).count();
        long active = totalOrders - completed - cancelled;

        return new SummaryStats(
            totalOrders, totalCustomers, totalRevenue, pendingPayments,
            avgOrderValue, completed, active, cancelled
        );
    }

    // ============================================
    // 2. MONTHLY REVENUE (last N months)
    // ============================================
    public List<RevenuePoint> buildMonthlyRevenue(List<Order> orders, int monthsBack) {
        Map<YearMonth, BigDecimal> revenueMap = new LinkedHashMap<>();
        Map<YearMonth, Long> countMap = new LinkedHashMap<>();

        YearMonth now = YearMonth.now();
        for (int i = monthsBack - 1; i >= 0; i--) {
            YearMonth ym = now.minusMonths(i);
            revenueMap.put(ym, BigDecimal.ZERO);
            countMap.put(ym, 0L);
        }

        for (Order o : orders) {
            if (isCancelled(o) || o.getOrderDate() == null) continue;

            YearMonth ym = YearMonth.from(o.getOrderDate());
            if (revenueMap.containsKey(ym)) {
                revenueMap.put(ym, revenueMap.get(ym).add(safeBigDecimal(o.getTotalAmount())));
                countMap.put(ym, countMap.get(ym) + 1);
            }
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");
        List<RevenuePoint> result = new ArrayList<>();
        for (Map.Entry<YearMonth, BigDecimal> e : revenueMap.entrySet()) {
            result.add(new RevenuePoint(
                e.getKey().format(fmt),
                e.getValue(),
                countMap.get(e.getKey())
            ));
        }
        return result;
    }

    // ============================================
    // 3. ORDERS BY STATUS (pie chart)
    // ============================================
    public List<StatusCount> buildOrdersByStatus(List<Order> orders) {
        return orders.stream()
            .filter(o -> o.getStatus() != null)
            .collect(Collectors.groupingBy(
                o -> o.getStatus().toString(),
                Collectors.counting()
            ))
            .entrySet().stream()
            .map(e -> new StatusCount(e.getKey(), e.getValue()))
            .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
            .collect(Collectors.toList());
    }

    // ============================================
    // 4. TOP PRODUCTS
    // ============================================
    public List<TopProduct> buildTopProducts(List<Order> orders, int limit) {
        Map<String, List<Order>> byProduct = orders.stream()
            .filter(o -> !isCancelled(o) && o.getProductName() != null)
            .collect(Collectors.groupingBy(Order::getProductName));

        return byProduct.entrySet().stream()
            .map(e -> {
                long count = e.getValue().size();
                BigDecimal revenue = e.getValue().stream()
                    .map(o -> safeBigDecimal(o.getTotalAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                return new TopProduct(e.getKey(), count, revenue);
            })
            .sorted((a, b) -> b.getTotalRevenue().compareTo(a.getTotalRevenue()))
            .limit(limit)
            .collect(Collectors.toList());
    }

    // ============================================
    // 5. TOP CUSTOMERS
    // ============================================
    public List<TopCustomer> buildTopCustomers(List<Order> orders, int limit) {
        Map<String, List<Order>> byCustomer = orders.stream()
            .filter(o -> !isCancelled(o) && o.getCustomerEmail() != null)
            .collect(Collectors.groupingBy(Order::getCustomerEmail));

        return byCustomer.entrySet().stream()
            .map(e -> {
                List<Order> custOrders = e.getValue();
                Order first = custOrders.get(0);
                BigDecimal spent = custOrders.stream()
                    .map(o -> safeBigDecimal(o.getTotalAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                return new TopCustomer(
                    first.getCustomerName(),
                    e.getKey(),
                    (long) custOrders.size(),
                    spent
                );
            })
            .sorted((a, b) -> b.getTotalSpent().compareTo(a.getTotalSpent()))
            .limit(limit)
            .collect(Collectors.toList());
    }

    // ============================================
    // 7. DAILY ORDERS (Last N Days)
    // ============================================
    public List<DailyOrderPoint> buildDailyOrders(List<Order> orders, int daysBack) {
        Map<LocalDate, Long> countMap = new LinkedHashMap<>();
        Map<LocalDate, BigDecimal> revenueMap = new LinkedHashMap<>();

        LocalDate today = LocalDate.now();
        for (int i = daysBack - 1; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            countMap.put(d, 0L);
            revenueMap.put(d, BigDecimal.ZERO);
        }

        for (Order o : orders) {
            if (isCancelled(o) || o.getOrderDate() == null) continue;
            LocalDate d = o.getOrderDate().toLocalDate();
            if (countMap.containsKey(d)) {
                countMap.put(d, countMap.get(d) + 1);
                revenueMap.put(d, revenueMap.get(d).add(safeBigDecimal(o.getTotalAmount())));
            }
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM");
        List<DailyOrderPoint> result = new ArrayList<>();
        for (LocalDate d : countMap.keySet()) {
            result.add(new DailyOrderPoint(
                d.format(fmt),
                countMap.get(d),
                revenueMap.get(d)
            ));
        }
        return result;
    }

    // ============================================
    // 8. CATEGORY SALES
    // ============================================
    public List<CategorySale> buildCategorySales(List<Order> orders) {
        Map<String, List<Order>> byCategory = orders.stream()
            .filter(o -> !isCancelled(o) && o.getProductSlug() != null)
            .collect(Collectors.groupingBy(o -> {
                String slug = o.getProductSlug();
                if (slug == null || slug.isEmpty()) return "General";
                int dashIdx = slug.indexOf('-');
                if (dashIdx > 0) {
                    String prefix = slug.substring(0, dashIdx);
                    return prefix.substring(0, 1).toUpperCase() + prefix.substring(1);
                }
                return slug.substring(0, 1).toUpperCase() + slug.substring(1);
            }));

        return byCategory.entrySet().stream()
            .map(e -> {
                long count = e.getValue().size();
                BigDecimal rev = e.getValue().stream()
                    .map(o -> safeBigDecimal(o.getTotalAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                return new CategorySale(e.getKey(), count, rev);
            })
            .sorted((a, b) -> b.getRevenue().compareTo(a.getRevenue()))
            .collect(Collectors.toList());
    }

    // ============================================
    // 9. CUSTOMER TYPE SPLIT (New vs Returning)
    // ============================================
    public CustomerTypeSplit buildCustomerTypeSplit(List<Order> orders) {
        Map<String, Long> ordersPerCustomer = orders.stream()
            .filter(o -> o.getCustomerEmail() != null && !isCancelled(o))
            .collect(Collectors.groupingBy(Order::getCustomerEmail, Collectors.counting()));

        long newCustomers = ordersPerCustomer.values().stream()
            .filter(count -> count == 1)
            .count();

        long returningCustomers = ordersPerCustomer.values().stream()
            .filter(count -> count > 1)
            .count();

        return new CustomerTypeSplit(newCustomers, returningCustomers);
    }

    // ============================================
    // 10. PAYMENT METHODS
    // ============================================
    public List<PaymentMethodCount> buildPaymentMethods(List<Order> orders) {
        Map<String, List<Order>> byMethod = orders.stream()
            .filter(o -> !isCancelled(o))
            .collect(Collectors.groupingBy(o -> {
                String ps = o.getPaymentStatus();
                if (ps == null) return "Unknown";
                if ("PAID".equalsIgnoreCase(ps)) return "Razorpay";
                if ("PENDING".equalsIgnoreCase(ps)) return "Pending";
                return ps;
            }));

        return byMethod.entrySet().stream()
            .map(e -> {
                long count = e.getValue().size();
                BigDecimal amount = e.getValue().stream()
                    .map(o -> safeBigDecimal(o.getTotalAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                return new PaymentMethodCount(e.getKey(), count, amount);
            })
            .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
            .collect(Collectors.toList());
    }

    // ============================================
    // 11. CITY DISTRIBUTION
    // ============================================
    public List<CityDistribution> buildCityDistribution(List<Order> orders, int limit) {
        Map<String, List<Order>> byCity = orders.stream()
            .filter(o -> !isCancelled(o)
                && o.getDeliveryAddress() != null
                && o.getDeliveryAddress().getCity() != null)
            .collect(Collectors.groupingBy(o -> o.getDeliveryAddress().getCity()));

        return byCity.entrySet().stream()
            .map(e -> {
                long count = e.getValue().size();
                BigDecimal rev = e.getValue().stream()
                    .map(o -> safeBigDecimal(o.getTotalAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                return new CityDistribution(e.getKey(), count, rev);
            })
            .sorted((a, b) -> Long.compare(b.getOrderCount(), a.getOrderCount()))
            .limit(limit)
            .collect(Collectors.toList());
    }

    // ============================================
    // 12. REVENUE GROWTH (MoM %)
    // ============================================
    public List<RevenueGrowthPoint> buildRevenueGrowth(List<Order> orders, int monthsBack) {
        List<RevenuePoint> monthly = buildMonthlyRevenue(orders, monthsBack);
        List<RevenueGrowthPoint> result = new ArrayList<>();

        BigDecimal previousRevenue = null;
        for (RevenuePoint point : monthly) {
            Double growth = null;
            if (previousRevenue != null && previousRevenue.compareTo(BigDecimal.ZERO) > 0) {
                growth = point.getRevenue()
                    .subtract(previousRevenue)
                    .divide(previousRevenue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            }

            result.add(new RevenueGrowthPoint(
                point.getMonth(),
                point.getRevenue(),
                growth,
                point.getOrderCount()
            ));

            previousRevenue = point.getRevenue();
        }
        return result;
    }

    // ============================================
    // HELPERS
    // ============================================
    private BigDecimal safeBigDecimal(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private boolean isCancelled(Order o) {
        return o.getStatus() != null &&
               "CANCELLED".equalsIgnoreCase(o.getStatus().toString());
    }

    private boolean isCompleted(Order o) {
        if (o.getStatus() == null) return false;
        String s = o.getStatus().toString().toUpperCase();
        return s.equals("COMPLETED") || s.equals("DELIVERED");
    }
}