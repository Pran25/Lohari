package com.lohari.controller;


import com.lohari.dto.DashboardStatsResponse;
import com.lohari.dto.OrderCreateRequest;
import com.lohari.dto.OrderResponse;
import com.lohari.dto.OrderStatusUpdateRequest;
import com.lohari.dto.OrderTrackingResponse;
import com.lohari.dto.OrderUpdateRequest;
import com.lohari.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}, allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ============================================================
    // PUBLIC ENDPOINTS (Customer)
    // ============================================================

    // 1. CREATE ORDER
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderCreateRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. GET ALL ORDERS (Customer)
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 3. GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // 4. GET ORDER BY NUMBER
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    // 5. GET CUSTOMER ORDERS
    @GetMapping("/customer/{email}")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomer(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerEmail(email));
    }

    // 6. GET CUSTOMER ORDERS (Paginated)
    @GetMapping("/customer/{email}/page")
    public ResponseEntity<Page<OrderResponse>> getOrdersByCustomer(
            @PathVariable String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(orderService.getOrdersByCustomerEmail(email, pageable));
    }

    // 7. GET ORDER TRACKING
    @GetMapping("/{id}/tracking")
    public ResponseEntity<List<OrderTrackingResponse>> getOrderTracking(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderTracking(id));
    }

    // 8. CANCEL ORDER
    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        orderService.cancelOrder(id, reason);
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // 9. UPDATE ORDER (Customer - limited fields)
    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrder(id, request));
    }

    // ============================================================
    // ADMIN ENDPOINTS
    // ============================================================

    // 10. GET ALL ORDERS (Admin)
    @GetMapping("/admin/all")
    public ResponseEntity<Page<OrderResponse>> getAllOrdersAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    // 11. GET ORDERS BY STATUS (Admin)
    @GetMapping("/admin/status/{status}")
    public ResponseEntity<Page<OrderResponse>> getOrdersByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getOrdersByStatus(status, pageable));
    }

    // 12. UPDATE ORDER STATUS (Admin)
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    // 13. UPDATE ORDER STATUS (Simple)
    @PutMapping("/admin/{id}/status-simple")
    public ResponseEntity<OrderResponse> updateOrderStatusSimple(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String description) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status, location, description));
    }

    // 14. DELETE ORDER (Admin)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // 15. BULK UPDATE STATUS (Admin)
    @PutMapping("/admin/bulk-status")
    public ResponseEntity<Void> bulkUpdateStatus(
            @RequestParam List<Long> ids,
            @RequestParam String status) {
        orderService.bulkUpdateStatus(ids, status);
        return ResponseEntity.ok().build();
    }

    // 16. BULK DELETE (Admin)
    @DeleteMapping("/admin/bulk")
    public ResponseEntity<Void> bulkDelete(@RequestParam List<Long> ids) {
        orderService.bulkDeleteOrders(ids);
        return ResponseEntity.noContent().build();
    }

    // 17. GET RECENT ORDERS (Admin)
    @GetMapping("/admin/recent")
    public ResponseEntity<List<OrderResponse>> getRecentOrders(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(orderService.getRecentOrders(limit));
    }

    // 18. GET ORDERS BY DATE RANGE (Admin)
    @GetMapping("/admin/date-range")
    public ResponseEntity<List<OrderResponse>> getOrdersByDateRange(
            @RequestParam String start,
            @RequestParam String end) {

        LocalDateTime startDateTime = LocalDateTime.parse(start + "T00:00:00");
        LocalDateTime endDateTime = LocalDateTime.parse(end + "T23:59:59");
        return ResponseEntity.ok(orderService.getOrdersByDateRange(startDateTime, endDateTime));
    }

    // ============================================================
    // ADMIN DASHBOARD ENDPOINTS
    // ============================================================

    // 19. DASHBOARD STATS
    @GetMapping("/admin/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(orderService.getDashboardStats());
    }

    // 20. TOTAL REVENUE
    @GetMapping("/admin/revenue/total")
    public ResponseEntity<Double> getTotalRevenue() {
        return ResponseEntity.ok(orderService.getTotalRevenue());
    }

    // 21. TODAY REVENUE
    @GetMapping("/admin/revenue/today")
    public ResponseEntity<Double> getTodayRevenue() {
        return ResponseEntity.ok(orderService.getTodayRevenue());
    }

    // 22. THIS MONTH REVENUE
    @GetMapping("/admin/revenue/monthly")
    public ResponseEntity<Double> getThisMonthRevenue() {
        return ResponseEntity.ok(orderService.getThisMonthRevenue());
    }

    // 23. THIS YEAR REVENUE
    @GetMapping("/admin/revenue/yearly")
    public ResponseEntity<Double> getThisYearRevenue() {
        return ResponseEntity.ok(orderService.getThisYearRevenue());
    }

    // 24. AVERAGE ORDER VALUE
    @GetMapping("/admin/revenue/average")
    public ResponseEntity<Double> getAverageOrderValue() {
        return ResponseEntity.ok(orderService.getAverageOrderValue());
    }

    // 25. REVENUE BREAKDOWN
    @GetMapping("/admin/revenue/breakdown")
    public ResponseEntity<Map<String, Double>> getRevenueBreakdown(
            @RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(orderService.getRevenueBreakdown(months));
    }

    // 26. ORDERS TREND
    @GetMapping("/admin/trend")
    public ResponseEntity<Map<String, Long>> getOrdersTrend(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(orderService.getOrdersTrend(days));
    }

    // 27. ORDERS BY STATUS COUNT
    @GetMapping("/admin/status-count")
    public ResponseEntity<Map<String, Long>> getOrdersCountByStatus() {
        return ResponseEntity.ok(orderService.getOrdersCountByStatus());
    }

    // 28. TOP SELLING PRODUCTS
    @GetMapping("/admin/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingProducts(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(orderService.getTopSellingProducts(limit));
    }

    // 29. TOTAL ORDERS COUNT
    @GetMapping("/admin/count")
    public ResponseEntity<Long> getTotalOrdersCount() {
        return ResponseEntity.ok(orderService.getTotalOrdersCount());
    }

    // 30. ACTIVE ORDERS COUNT
    @GetMapping("/admin/active-count")
    public ResponseEntity<Long> getActiveOrdersCount() {
        return ResponseEntity.ok(orderService.getActiveOrdersCount());
    }

    // ============================================================
    // HEALTH CHECK
    // ============================================================

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Orders Service is running!");
    }
}