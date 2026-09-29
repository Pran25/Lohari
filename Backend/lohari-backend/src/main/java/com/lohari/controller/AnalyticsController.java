package com.lohari.controller;

import com.lohari.dto.AnalyticsDTO.*;
import com.lohari.model.Order;
import com.lohari.repository.OrderRepository;
import com.lohari.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private OrderRepository orderRepository;

    // ============================================
    // MAIN DASHBOARD — Sab kuch ek API mein
    // GET /api/analytics/dashboard
    // ============================================
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboard());
    }

    // ============================================
    // SUMMARY ONLY
    // GET /api/analytics/summary
    // ============================================
    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SummaryStats> getSummary() {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildSummary(allOrders));
    }

    // ============================================
    // MONTHLY REVENUE (last 6 months)
    // GET /api/analytics/revenue?months=6
    // ============================================
    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RevenuePoint>> getMonthlyRevenue(
            @RequestParam(defaultValue = "6") int months) {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildMonthlyRevenue(allOrders, months));
    }

    // ============================================
    // ORDERS BY STATUS (pie chart)
    // GET /api/analytics/orders-by-status
    // ============================================
    @GetMapping("/orders-by-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StatusCount>> getOrdersByStatus() {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildOrdersByStatus(allOrders));
    }

    // ============================================
    // TOP PRODUCTS
    // GET /api/analytics/top-products?limit=5
    // ============================================
    @GetMapping("/top-products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TopProduct>> getTopProducts(
            @RequestParam(defaultValue = "5") int limit) {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildTopProducts(allOrders, limit));
    }

    // ============================================
    // TOP CUSTOMERS
    // GET /api/analytics/top-customers?limit=5
    // ============================================
    @GetMapping("/top-customers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TopCustomer>> getTopCustomers(
            @RequestParam(defaultValue = "5") int limit) {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildTopCustomers(allOrders, limit));
    }

    // ============================================
    // DAILY ORDERS (Last 30 Days)
    // GET /api/analytics/daily-orders?days=30
    // ============================================
    @GetMapping("/daily-orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyOrderPoint>> getDailyOrders(
            @RequestParam(defaultValue = "30") int days) {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildDailyOrders(allOrders, days));
    }

    // ============================================
    // CATEGORY SALES
    // GET /api/analytics/category-sales
    // ============================================
    @GetMapping("/category-sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CategorySale>> getCategorySales() {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildCategorySales(allOrders));
    }

    // ============================================
    // CUSTOMER SPLIT (New vs Returning)
    // GET /api/analytics/customer-split
    // ============================================
    @GetMapping("/customer-split")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerTypeSplit> getCustomerSplit() {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildCustomerTypeSplit(allOrders));
    }

    // ============================================
    // PAYMENT METHODS
    // GET /api/analytics/payment-methods
    // ============================================
    @GetMapping("/payment-methods")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentMethodCount>> getPaymentMethods() {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildPaymentMethods(allOrders));
    }

    // ============================================
    // CITY DISTRIBUTION
    // GET /api/analytics/cities?limit=10
    // ============================================
    @GetMapping("/cities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CityDistribution>> getCityDistribution(
            @RequestParam(defaultValue = "10") int limit) {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildCityDistribution(allOrders, limit));
    }

    // ============================================
    // REVENUE GROWTH %
    // GET /api/analytics/revenue-growth?months=6
    // ============================================
    @GetMapping("/revenue-growth")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RevenueGrowthPoint>> getRevenueGrowth(
            @RequestParam(defaultValue = "6") int months) {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(analyticsService.buildRevenueGrowth(allOrders, months));
    }
}