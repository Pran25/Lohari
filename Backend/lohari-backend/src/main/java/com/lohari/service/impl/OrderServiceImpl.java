package com.lohari.service.impl;

import com.lohari.dto.DashboardStatsResponse;
import com.lohari.dto.OrderCreateRequest;
import com.lohari.dto.OrderResponse;
import com.lohari.dto.OrderStatusUpdateRequest;
import com.lohari.dto.OrderTrackingResponse;
import com.lohari.dto.OrderUpdateRequest;
import com.lohari.model.*;
import com.lohari.repository.OrderRepository;
import com.lohari.service.EmailService;
import com.lohari.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    // ============================================================
    // CREATE
    // ============================================================

    @Override
    public OrderResponse createOrder(OrderCreateRequest request) {
        log.info("Creating new order for customer: {}", request.getCustomerEmail());

        Address address = new Address(
            request.getAddressLine1(),
            request.getAddressLine2(),
            request.getCity(),
            request.getState(),
            request.getPincode(),
            request.getCountry()
        );

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setDeliveryAddress(address);
        order.setProductName(request.getProductName());
        order.setProductSlug(request.getProductSlug());
        order.setProductImage(request.getProductImage());
        order.setMaterial(request.getMaterial());
        order.setFinish(request.getFinish());
        order.setWidth(request.getWidth());
        order.setHeight(request.getHeight());
        order.setDepth(request.getDepth());
        order.setUnit(request.getUnit() != null ? request.getUnit() : "ft");
        order.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        order.setUnitPrice(request.getUnitPrice());
        order.setLeadTimeDays(request.getLeadTimeDays() != null ? request.getLeadTimeDays() : 15);
        order.setCustomerNotes(request.getCustomerNotes());
        order.setSpecialInstructions(request.getSpecialInstructions());
        order.setSketchUrl(request.getSketchUrl());
        order.setCadDrawingUrl(request.getCadDrawingUrl());

        order.calculateTotalAmount();

        BigDecimal advancePercent = request.getAdvancePercent() != null ? request.getAdvancePercent() : BigDecimal.valueOf(30);
        BigDecimal advance = order.getTotalAmount().multiply(advancePercent).divide(BigDecimal.valueOf(100));
        order.setAdvanceAmount(advance);
        order.calculateBalanceAmount();

        order.setStatus(OrderStatus.PENDING);
        order.addTracking(OrderStatus.PENDING, "System", "Order placed successfully", "SYSTEM");

        Order savedOrder = orderRepository.save(order);
        log.info("Order created with ID: {}, Order Number: {}", savedOrder.getId(), savedOrder.getOrderNumber());

        try {
            sendOrderConfirmationEmail(savedOrder.getId());
        } catch (Exception e) {
            log.error("Failed to send confirmation email for order: {}", savedOrder.getId(), e);
        }

        return mapToResponse(savedOrder);
    }

    // ============================================================
    // READ
    // ============================================================

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));
        return mapToResponse(order);
    }

    @Override
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new EntityNotFoundException("Order not found with Number: " + orderNumber));
        return mapToResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByCustomerEmail(String email) {
        return orderRepository.findByCustomerEmail(email).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public Page<OrderResponse> getOrdersByCustomerEmail(String email, Pageable pageable) {
        return orderRepository.findByCustomerEmail(email, pageable)
            .map(this::mapToResponse);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
            .map(this::mapToResponse);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Override
    public OrderResponse updateOrder(Long id, OrderUpdateRequest request) {
        log.info("Updating order with ID: {}", id);

        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));

        if (!order.getStatus().isEditable()) {
            throw new RuntimeException("Order cannot be edited in current status: " + order.getStatus());
        }

        if (request.getCustomerName() != null) order.setCustomerName(request.getCustomerName());
        if (request.getCustomerPhone() != null) order.setCustomerPhone(request.getCustomerPhone());
        if (request.getProductName() != null) order.setProductName(request.getProductName());
        if (request.getMaterial() != null) order.setMaterial(request.getMaterial());
        if (request.getFinish() != null) order.setFinish(request.getFinish());
        if (request.getWidth() != null) order.setWidth(request.getWidth());
        if (request.getHeight() != null) order.setHeight(request.getHeight());
        if (request.getDepth() != null) order.setDepth(request.getDepth());
        if (request.getQuantity() != null) order.setQuantity(request.getQuantity());
        if (request.getUnitPrice() != null) order.setUnitPrice(request.getUnitPrice());
        if (request.getCustomerNotes() != null) order.setCustomerNotes(request.getCustomerNotes());
        if (request.getSpecialInstructions() != null) order.setSpecialInstructions(request.getSpecialInstructions());

        if (request.getAddressLine1() != null || request.getCity() != null) {
            Address address = new Address();
            address.setAddressLine1(request.getAddressLine1() != null ? request.getAddressLine1() : order.getDeliveryAddress().getAddressLine1());
            address.setAddressLine2(request.getAddressLine2() != null ? request.getAddressLine2() : order.getDeliveryAddress().getAddressLine2());
            address.setCity(request.getCity() != null ? request.getCity() : order.getDeliveryAddress().getCity());
            address.setState(request.getState() != null ? request.getState() : order.getDeliveryAddress().getState());
            address.setPincode(request.getPincode() != null ? request.getPincode() : order.getDeliveryAddress().getPincode());
            address.setCountry(request.getCountry() != null ? request.getCountry() : order.getDeliveryAddress().getCountry());
            order.setDeliveryAddress(address);
        }

        order.calculateTotalAmount();
        order.calculateBalanceAmount();

        Order updatedOrder = orderRepository.save(order);
        log.info("Order updated: {}", updatedOrder.getId());

        return mapToResponse(updatedOrder);
    }

    @Override
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        return updateOrderStatus(id, request.getStatus(), request.getLocation(), request.getDescription());
    }

    @Override
    public OrderResponse updateOrderStatus(Long id, String status, String location, String description) {
        log.info("Updating order {} status to: {}", id, status);

        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));

        if (order.isDelivered() || order.isCancelled()) {
            throw new RuntimeException("Cannot update status of delivered or cancelled order");
        }

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }

        validateStatusTransition(order.getStatus(), newStatus);

        switch (newStatus) {
            case SITE_VISIT_SCHEDULED:
                order.setSiteVisitDate(LocalDateTime.now());
                break;
            case FABRICATION_STARTED:
                order.setFabricationStartDate(LocalDateTime.now());
                break;
            case FABRICATION_COMPLETE:
                order.setExpectedDeliveryDate(LocalDateTime.now().plusDays(order.getLeadTimeDays()));
                break;
            case DELIVERED:
                order.setActualDeliveryDate(LocalDateTime.now());
                break;
            default:
                break;
        }

        String locationStr = location != null ? location : getLocationForStatus(newStatus);
        String descriptionStr = description != null ? description : newStatus.getDescription();

        order.addTracking(newStatus, locationStr, descriptionStr, "ADMIN");

        Order updatedOrder = orderRepository.save(order);
        log.info("Order {} status updated to: {}", id, newStatus);

        try {
            sendStatusUpdateEmail(updatedOrder.getId());
        } catch (Exception e) {
            log.error("Failed to send status update email for order: {}", updatedOrder.getId(), e);
        }

        return mapToResponse(updatedOrder);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus target) {
        if (target == OrderStatus.CANCELLED) {
            if (current == OrderStatus.DELIVERED || current == OrderStatus.COMPLETED) {
                throw new RuntimeException("Cannot cancel delivered or completed order");
            }
            return;
        }

        if (target.ordinal() < current.ordinal() && target != OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot go back from " + current + " to " + target);
        }
    }

    // ============================================================
    // DELETE
    // ============================================================

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new EntityNotFoundException("Order not found with ID: " + id);
        }
        log.info("Deleting order: {}", id);
        orderRepository.deleteById(id);
    }

    @Override
    public void cancelOrder(Long id, String reason) {
        log.info("Cancelling order: {}", id);

        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));

        if (order.isDelivered() || order.isCancelled()) {
            throw new RuntimeException("Cannot cancel delivered or already cancelled order");
        }

        String description = reason != null ? "Order cancelled. Reason: " + reason : "Order cancelled by customer";
        order.addTracking(OrderStatus.CANCELLED, "System", description, "ADMIN");

        orderRepository.save(order);
        log.info("Order {} cancelled", id);
    }

    // ============================================================
    // TRACKING
    // ============================================================

    @Override
    public List<OrderTrackingResponse> getOrderTracking(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));

        return order.getTrackingHistory().stream()
            .map(this::mapTrackingToResponse)
            .sorted((t1, t2) -> t2.getTimestamp().compareTo(t1.getTimestamp()))
            .collect(Collectors.toList());
    }

    // ============================================================
    // DASHBOARD - FIXED NULL HANDLING
    // ============================================================

    @Override
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalOrders(orderRepository.countAllOrders());
        stats.setActiveOrders(orderRepository.countActiveOrders());
        
        // Fixed null handling
        Double totalRevenue = orderRepository.sumTotalRevenue();
        stats.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        
        Double activeRevenue = orderRepository.sumActiveRevenue();
        stats.setActiveRevenue(activeRevenue != null ? activeRevenue : 0.0);
        
        Double todayRevenue = orderRepository.sumTodayRevenue();
        stats.setTodayRevenue(todayRevenue != null ? todayRevenue : 0.0);
        
        Double thisMonthRevenue = orderRepository.sumThisMonthRevenue();
        stats.setThisMonthRevenue(thisMonthRevenue != null ? thisMonthRevenue : 0.0);
        
        Double thisYearRevenue = orderRepository.sumThisYearRevenue();
        stats.setThisYearRevenue(thisYearRevenue != null ? thisYearRevenue : 0.0);
        
        Double avgOrderValue = orderRepository.averageOrderValue();
        stats.setAverageOrderValue(avgOrderValue != null ? avgOrderValue : 0.0);
        
        stats.setTotalCustomers(orderRepository.countDistinctCustomers());

        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> statusCounts = orderRepository.countOrdersByStatus();
        for (Object[] row : statusCounts) {
            if (row[0] != null) {
                statusMap.put(row[0].toString(), (Long) row[1]);
            }
        }
        stats.setOrdersByStatus(statusMap);

        stats.setRecentOrders(orderRepository.findTopRecentOrders(5).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList()));

        return stats;
    }

    // ============================================================
    // REVENUE BREAKDOWN - FIXED
    // ============================================================

    @Override
    public Map<String, Double> getRevenueBreakdown(int months) {
        Map<String, Double> breakdown = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = months - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusMonths(i);
            LocalDateTime start = date.withDayOfMonth(1).atStartOfDay();
            LocalDateTime end = date.withDayOfMonth(date.lengthOfMonth()).atTime(23, 59, 59);

            // Fixed: Query with date range instead of sumTotalRevenue
            List<Order> monthOrders = orderRepository.findByOrderDateBetween(start, end);
            double monthlyRevenue = monthOrders.stream()
                .filter(o -> o.getTotalAmount() != null)
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum();

            breakdown.put(start.format(formatter), monthlyRevenue);
        }

        return breakdown;
    }

    // ============================================================
    // STATISTICS - FIXED NULL HANDLING
    // ============================================================

    @Override
    public Long getTotalOrdersCount() {
        return orderRepository.countAllOrders();
    }

    @Override
    public Long getActiveOrdersCount() {
        return orderRepository.countActiveOrders();
    }

    @Override
    public Double getTotalRevenue() {
        Double revenue = orderRepository.sumTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }

    @Override
    public Double getTodayRevenue() {
        Double revenue = orderRepository.sumTodayRevenue();
        return revenue != null ? revenue : 0.0;
    }

    @Override
    public Double getThisMonthRevenue() {
        Double revenue = orderRepository.sumThisMonthRevenue();
        return revenue != null ? revenue : 0.0;
    }

    @Override
    public Double getThisYearRevenue() {
        Double revenue = orderRepository.sumThisYearRevenue();
        return revenue != null ? revenue : 0.0;
    }

    @Override
    public Double getAverageOrderValue() {
        Double avg = orderRepository.averageOrderValue();
        return avg != null ? avg : 0.0;
    }

    @Override
    public Map<String, Long> getOrdersCountByStatus() {
        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> statusCounts = orderRepository.countOrdersByStatus();
        for (Object[] row : statusCounts) {
            if (row[0] != null) {
                statusMap.put(row[0].toString(), (Long) row[1]);
            }
        }
        return statusMap;
    }

    // ============================================================
    // BULK
    // ============================================================

    @Override
    public void bulkUpdateStatus(List<Long> ids, String status) {
        for (Long id : ids) {
            try {
                updateOrderStatus(id, status, null, null);
            } catch (Exception e) {
                log.error("Failed to update order {}: {}", id, e.getMessage());
            }
        }
    }

    @Override
    public void bulkDeleteOrders(List<Long> ids) {
        orderRepository.deleteAllById(ids);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    @Override
    public boolean existsById(Long id) {
        return orderRepository.existsById(id);
    }

    @Override
    public boolean existsByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber).isPresent();
    }

    @Override
    public void sendOrderConfirmationEmail(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

        emailService.sendOrderConfirmation(
            order.getCustomerEmail(),
            order.getOrderNumber(),
            order.getCustomerName()
        );
    }

    @Override
    public void sendStatusUpdateEmail(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

        emailService.sendOrderStatusUpdate(
            order.getCustomerEmail(),
            order.getOrderNumber(),
            order.getStatus().getCode(),
            order.getStatus().getDescription()
        );
    }

    // ============================================================
    // FILTERS
    // ============================================================

    @Override
    public List<OrderResponse> getOrdersByStatus(String status) {
        OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
        return orderRepository.findByStatus(orderStatus).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public Page<OrderResponse> getOrdersByStatus(String status, Pageable pageable) {
        OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
        return orderRepository.findByStatus(orderStatus, pageable)
            .map(this::mapToResponse);
    }

    @Override
    public List<OrderResponse> getOrdersByDateRange(LocalDateTime start, LocalDateTime end) {
        LocalDateTime endOfDay = end.toLocalDate().atTime(23, 59, 59);
        return orderRepository.findByOrderDateBetween(start, endOfDay).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public Page<OrderResponse> getOrdersByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        LocalDateTime endOfDay = end.toLocalDate().atTime(23, 59, 59);
        return orderRepository.findByOrderDateBetween(start, endOfDay, pageable)
            .map(this::mapToResponse);
    }

    // ============================================================
    // ORDERS TREND
    // ============================================================

    @Override
    public Map<String, Long> getOrdersTrend(int days) {
        Map<String, Long> trend = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(23, 59, 59);

            long count = orderRepository.findByOrderDateBetween(start, end).size();
            trend.put(date.format(formatter), count);
        }

        return trend;
    }

    @Override
    public List<Map<String, Object>> getTopSellingProducts(int limit) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Object[]> topProducts = orderRepository.findTopSellingProducts();

        int count = 0;
        for (Object[] row : topProducts) {
            if (count >= limit) break;
            Map<String, Object> item = new HashMap<>();
            item.put("productName", row[0] != null ? row[0].toString() : "Unknown");
            item.put("quantity", row[1] != null ? row[1] : 0);
            result.add(item);
            count++;
        }

        return result;
    }

    @Override
    public List<OrderResponse> getRecentOrders(int limit) {
        return orderRepository.findTopRecentOrders(limit).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private String getLocationForStatus(OrderStatus status) {
        switch (status) {
            case PENDING: return "System";
            case QUOTE_SENT: return "Sales Team";
            case QUOTE_ACCEPTED: return "Customer";
            case SITE_VISIT_SCHEDULED: return "Site";
            case SITE_VISIT_COMPLETED: return "Site";
            case ADVANCE_PAID: return "Payment Gateway";
            case FABRICATION_STARTED: return "Workshop";
            case FABRICATION_IN_PROGRESS: return "Workshop";
            case FABRICATION_COMPLETE: return "Workshop";
            case DELIVERY_SCHEDULED: return "Logistics";
            case DELIVERED: return "Customer Location";
            case COMPLETED: return "System";
            case CANCELLED: return "System";
            default: return "Unknown";
        }
    }

    // ============================================================
    // RESPONSE MAPPERS
    // ============================================================

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerName(order.getCustomerName());
        response.setCustomerEmail(order.getCustomerEmail());
        response.setCustomerPhone(order.getCustomerPhone());

        if (order.getDeliveryAddress() != null) {
            OrderResponse.AddressResponse address = new OrderResponse.AddressResponse();
            address.setAddressLine1(order.getDeliveryAddress().getAddressLine1());
            address.setAddressLine2(order.getDeliveryAddress().getAddressLine2());
            address.setCity(order.getDeliveryAddress().getCity());
            address.setState(order.getDeliveryAddress().getState());
            address.setPincode(order.getDeliveryAddress().getPincode());
            address.setCountry(order.getDeliveryAddress().getCountry());
            response.setDeliveryAddress(address);
        }

        response.setProductName(order.getProductName());
        response.setProductImage(order.getProductImage());
        response.setMaterial(order.getMaterial());
        response.setFinish(order.getFinish());

        OrderResponse.DimensionsResponse dimensions = new OrderResponse.DimensionsResponse();
        dimensions.setWidth(order.getWidth());
        dimensions.setHeight(order.getHeight());
        dimensions.setDepth(order.getDepth());
        dimensions.setUnit(order.getUnit());
        response.setDimensions(dimensions);

        response.setQuantity(order.getQuantity());
        response.setUnitPrice(order.getUnitPrice());
        response.setTotalAmount(order.getTotalAmount());
        response.setAdvanceAmount(order.getAdvanceAmount());
        response.setBalanceAmount(order.getBalanceAmount());
        response.setStatus(order.getStatus().toString());
        response.setStatusDescription(order.getStatus().getDescription());

        response.setOrderDate(order.getOrderDate());
        response.setSiteVisitDate(order.getSiteVisitDate());
        response.setFabricationStartDate(order.getFabricationStartDate());
        response.setExpectedDeliveryDate(order.getExpectedDeliveryDate());
        response.setActualDeliveryDate(order.getActualDeliveryDate());
        response.setLeadTimeDays(order.getLeadTimeDays());

        response.setCustomerNotes(order.getCustomerNotes());
        response.setAdminNotes(order.getAdminNotes());
        response.setSpecialInstructions(order.getSpecialInstructions());

        response.setSketchUrl(order.getSketchUrl());
        response.setCadDrawingUrl(order.getCadDrawingUrl());

        response.setRazorpayOrderId(order.getRazorpayOrderId());
        response.setRazorpayPaymentId(order.getRazorpayPaymentId());
        response.setPaymentStatus(order.getPaymentStatus());

        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        return response;
    }

    private OrderTrackingResponse mapTrackingToResponse(OrderTracking tracking) {
        OrderTrackingResponse response = new OrderTrackingResponse();
        response.setId(tracking.getId());
        response.setStatus(tracking.getStatus().toString());
        response.setStatusDescription(tracking.getStatus().getDescription());
        response.setLocation(tracking.getLocation());
        response.setDescription(tracking.getDescription());
        response.setUpdatedBy(tracking.getUpdatedBy());
        response.setTimestamp(tracking.getTimestamp());
        return response;
    }
}