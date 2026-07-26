package com.lohari.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.lohari.dto.DashboardStatsResponse;
import com.lohari.dto.OrderCreateRequest;
import com.lohari.dto.OrderResponse;
import com.lohari.dto.OrderStatusUpdateRequest;
import com.lohari.dto.OrderTrackingResponse;
import com.lohari.dto.OrderUpdateRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface OrderService {

    // ========== CREATE ==========
    OrderResponse createOrder(OrderCreateRequest request);

    // ========== READ ==========
    OrderResponse getOrderById(Long id);
    OrderResponse getOrderByNumber(String orderNumber);
    List<OrderResponse> getOrdersByCustomerEmail(String email);
    Page<OrderResponse> getOrdersByCustomerEmail(String email, Pageable pageable);
    List<OrderResponse> getAllOrders();
    Page<OrderResponse> getAllOrders(Pageable pageable);

    // ========== UPDATE ==========
    OrderResponse updateOrder(Long id, OrderUpdateRequest request);
    OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request);
    OrderResponse updateOrderStatus(Long id, String status, String location, String description);

    // ========== DELETE ==========
    void deleteOrder(Long id);
    void cancelOrder(Long id, String reason);

    // ========== TRACKING ==========
    List<OrderTrackingResponse> getOrderTracking(Long id);

    // ========== DASHBOARD ==========
    DashboardStatsResponse getDashboardStats();
    Map<String, Double> getRevenueBreakdown(int months);
    Map<String, Long> getOrdersTrend(int days);
    List<Map<String, Object>> getTopSellingProducts(int limit);
    List<OrderResponse> getRecentOrders(int limit);

    // ========== FILTERS ==========
    List<OrderResponse> getOrdersByStatus(String status);
    Page<OrderResponse> getOrdersByStatus(String status, Pageable pageable);
    List<OrderResponse> getOrdersByDateRange(LocalDateTime start, LocalDateTime end);
    Page<OrderResponse> getOrdersByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable);

    // ========== STATISTICS ==========
    Long getTotalOrdersCount();
    Long getActiveOrdersCount();
    Double getTotalRevenue();
    Double getTodayRevenue();
    Double getThisMonthRevenue();
    Double getThisYearRevenue();
    Double getAverageOrderValue();
    Map<String, Long> getOrdersCountByStatus();

    // ========== BULK ==========
    void bulkUpdateStatus(List<Long> ids, String status);
    void bulkDeleteOrders(List<Long> ids);

    // ========== HELPERS ==========
    boolean existsById(Long id);
    boolean existsByOrderNumber(String orderNumber);
    void sendOrderConfirmationEmail(Long orderId);
    void sendStatusUpdateEmail(Long orderId);
}