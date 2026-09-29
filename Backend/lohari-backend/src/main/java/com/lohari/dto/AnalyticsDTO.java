package com.lohari.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * All analytics response DTOs in one file.
 * Use as: AnalyticsDTO.DashboardResponse, AnalyticsDTO.RevenuePoint, etc.
 */
public class AnalyticsDTO {

    // ============================================
    // 1. DASHBOARD RESPONSE (Main API)
    // ============================================
    public static class DashboardResponse {
        private SummaryStats summary;
        private List<RevenuePoint> monthlyRevenue;
        private List<StatusCount> ordersByStatus;
        private List<TopProduct> topProducts;
        private List<TopCustomer> topCustomers;

        public DashboardResponse() {}

        public DashboardResponse(SummaryStats summary,
                                  List<RevenuePoint> monthlyRevenue,
                                  List<StatusCount> ordersByStatus,
                                  List<TopProduct> topProducts,
                                  List<TopCustomer> topCustomers) {
            this.summary = summary;
            this.monthlyRevenue = monthlyRevenue;
            this.ordersByStatus = ordersByStatus;
            this.topProducts = topProducts;
            this.topCustomers = topCustomers;
        }

        public SummaryStats getSummary() { return summary; }
        public void setSummary(SummaryStats summary) { this.summary = summary; }

        public List<RevenuePoint> getMonthlyRevenue() { return monthlyRevenue; }
        public void setMonthlyRevenue(List<RevenuePoint> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

        public List<StatusCount> getOrdersByStatus() { return ordersByStatus; }
        public void setOrdersByStatus(List<StatusCount> ordersByStatus) { this.ordersByStatus = ordersByStatus; }

        public List<TopProduct> getTopProducts() { return topProducts; }
        public void setTopProducts(List<TopProduct> topProducts) { this.topProducts = topProducts; }

        public List<TopCustomer> getTopCustomers() { return topCustomers; }
        public void setTopCustomers(List<TopCustomer> topCustomers) { this.topCustomers = topCustomers; }
    }

    // ============================================
    // 2. SUMMARY STATS
    // ============================================
    public static class SummaryStats {
        private Long totalOrders;
        private Long totalCustomers;
        private BigDecimal totalRevenue;
        private BigDecimal pendingPayments;
        private BigDecimal avgOrderValue;
        private Long completedOrders;
        private Long activeOrders;
        private Long cancelledOrders;

        public SummaryStats() {}

        public SummaryStats(Long totalOrders, Long totalCustomers,
                            BigDecimal totalRevenue, BigDecimal pendingPayments,
                            BigDecimal avgOrderValue, Long completedOrders,
                            Long activeOrders, Long cancelledOrders) {
            this.totalOrders = totalOrders;
            this.totalCustomers = totalCustomers;
            this.totalRevenue = totalRevenue;
            this.pendingPayments = pendingPayments;
            this.avgOrderValue = avgOrderValue;
            this.completedOrders = completedOrders;
            this.activeOrders = activeOrders;
            this.cancelledOrders = cancelledOrders;
        }

        public Long getTotalOrders() { return totalOrders; }
        public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

        public Long getTotalCustomers() { return totalCustomers; }
        public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

        public BigDecimal getPendingPayments() { return pendingPayments; }
        public void setPendingPayments(BigDecimal pendingPayments) { this.pendingPayments = pendingPayments; }

        public BigDecimal getAvgOrderValue() { return avgOrderValue; }
        public void setAvgOrderValue(BigDecimal avgOrderValue) { this.avgOrderValue = avgOrderValue; }

        public Long getCompletedOrders() { return completedOrders; }
        public void setCompletedOrders(Long completedOrders) { this.completedOrders = completedOrders; }

        public Long getActiveOrders() { return activeOrders; }
        public void setActiveOrders(Long activeOrders) { this.activeOrders = activeOrders; }

        public Long getCancelledOrders() { return cancelledOrders; }
        public void setCancelledOrders(Long cancelledOrders) { this.cancelledOrders = cancelledOrders; }
    }

    // ============================================
    // 3. REVENUE POINT (for chart)
    // ============================================
    public static class RevenuePoint {
        private String month;
        private BigDecimal revenue;
        private Long orderCount;

        public RevenuePoint() {}

        public RevenuePoint(String month, BigDecimal revenue, Long orderCount) {
            this.month = month;
            this.revenue = revenue;
            this.orderCount = orderCount;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

        public Long getOrderCount() { return orderCount; }
        public void setOrderCount(Long orderCount) { this.orderCount = orderCount; }
    }

    // ============================================
    // 4. STATUS COUNT (for pie chart)
    // ============================================
    public static class StatusCount {
        private String status;
        private Long count;

        public StatusCount() {}

        public StatusCount(String status, Long count) {
            this.status = status;
            this.count = count;
        }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getCount() { return count; }
        public void setCount(Long count) { this.count = count; }
    }

    // ============================================
    // 5. TOP PRODUCT
    // ============================================
    public static class TopProduct {
        private String productName;
        private Long orderCount;
        private BigDecimal totalRevenue;

        public TopProduct() {}

        public TopProduct(String productName, Long orderCount, BigDecimal totalRevenue) {
            this.productName = productName;
            this.orderCount = orderCount;
            this.totalRevenue = totalRevenue;
        }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public Long getOrderCount() { return orderCount; }
        public void setOrderCount(Long orderCount) { this.orderCount = orderCount; }

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    }

    // ============================================
    // 6. TOP CUSTOMER
    // ============================================
    public static class TopCustomer {
        private String customerName;
        private String customerEmail;
        private Long orderCount;
        private BigDecimal totalSpent;

        public TopCustomer() {}

        public TopCustomer(String customerName, String customerEmail,
                           Long orderCount, BigDecimal totalSpent) {
            this.customerName = customerName;
            this.customerEmail = customerEmail;
            this.orderCount = orderCount;
            this.totalSpent = totalSpent;
        }

        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }

        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

        public Long getOrderCount() { return orderCount; }
        public void setOrderCount(Long orderCount) { this.orderCount = orderCount; }

        public BigDecimal getTotalSpent() { return totalSpent; }
        public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }
    }

    // ============================================
    // 7. DAILY ORDER POINT (Last 30 Days)
    // ============================================
    public static class DailyOrderPoint {
        private String date;       // "26 Sep"
        private Long orderCount;
        private BigDecimal revenue;

        public DailyOrderPoint() {}

        public DailyOrderPoint(String date, Long orderCount, BigDecimal revenue) {
            this.date = date;
            this.orderCount = orderCount;
            this.revenue = revenue;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public Long getOrderCount() { return orderCount; }
        public void setOrderCount(Long orderCount) { this.orderCount = orderCount; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    // ============================================
    // 8. CATEGORY SALE
    // ============================================
    public static class CategorySale {
        private String category;
        private Long orderCount;
        private BigDecimal revenue;

        public CategorySale() {}

        public CategorySale(String category, Long orderCount, BigDecimal revenue) {
            this.category = category;
            this.orderCount = orderCount;
            this.revenue = revenue;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Long getOrderCount() { return orderCount; }
        public void setOrderCount(Long orderCount) { this.orderCount = orderCount; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    // ============================================
    // 9. CUSTOMER TYPE SPLIT (New vs Returning)
    // ============================================
    public static class CustomerTypeSplit {
        private Long newCustomers;
        private Long returningCustomers;

        public CustomerTypeSplit() {}

        public CustomerTypeSplit(Long newCustomers, Long returningCustomers) {
            this.newCustomers = newCustomers;
            this.returningCustomers = returningCustomers;
        }

        public Long getNewCustomers() { return newCustomers; }
        public void setNewCustomers(Long newCustomers) { this.newCustomers = newCustomers; }

        public Long getReturningCustomers() { return returningCustomers; }
        public void setReturningCustomers(Long returningCustomers) { this.returningCustomers = returningCustomers; }
    }

    // ============================================
    // 10. PAYMENT METHOD COUNT
    // ============================================
    public static class PaymentMethodCount {
        private String method;
        private Long count;
        private BigDecimal amount;

        public PaymentMethodCount() {}

        public PaymentMethodCount(String method, Long count, BigDecimal amount) {
            this.method = method;
            this.count = count;
            this.amount = amount;
        }

        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }

        public Long getCount() { return count; }
        public void setCount(Long count) { this.count = count; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }

    // ============================================
    // 11. CITY DISTRIBUTION
    // ============================================
    public static class CityDistribution {
        private String city;
        private Long orderCount;
        private BigDecimal revenue;

        public CityDistribution() {}

        public CityDistribution(String city, Long orderCount, BigDecimal revenue) {
            this.city = city;
            this.orderCount = orderCount;
            this.revenue = revenue;
        }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public Long getOrderCount() { return orderCount; }
        public void setOrderCount(Long orderCount) { this.orderCount = orderCount; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    // ============================================
    // 12. REVENUE GROWTH POINT (MoM %)
    // ============================================
    public static class RevenueGrowthPoint {
        private String month;
        private BigDecimal revenue;
        private Double growthPercent;
        private Long orderCount;

        public RevenueGrowthPoint() {}

        public RevenueGrowthPoint(String month, BigDecimal revenue,
                                   Double growthPercent, Long orderCount) {
            this.month = month;
            this.revenue = revenue;
            this.growthPercent = growthPercent;
            this.orderCount = orderCount;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

        public Double getGrowthPercent() { return growthPercent; }
        public void setGrowthPercent(Double growthPercent) { this.growthPercent = growthPercent; }

        public Long getOrderCount() { return orderCount; }
        public void setOrderCount(Long orderCount) { this.orderCount = orderCount; }
    }
}