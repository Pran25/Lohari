package com.lohari.controller;

import com.lohari.repository.OrderRepository;
import com.lohari.repository.ProductRepository;
import com.lohari.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/products/count")
    public ResponseEntity<Long> getProductsCount() {
        return ResponseEntity.ok(productRepository.count());
    }

    @GetMapping("/orders/count")
    public ResponseEntity<Long> getOrdersCount() {
        return ResponseEntity.ok(orderRepository.count());
    }

    @GetMapping("/users/count")
    public ResponseEntity<Long> getUsersCount() {
        return ResponseEntity.ok(userRepository.count());
    }

    @GetMapping("/revenue/total")
    public ResponseEntity<Double> getTotalRevenue() {
        Double revenue = orderRepository.sumTotalRevenue();
        return ResponseEntity.ok(revenue != null ? revenue : 0.0);
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProducts", productRepository.count());
        summary.put("totalOrders", orderRepository.count());
        summary.put("totalUsers", userRepository.count());
        
        Double revenue = orderRepository.sumTotalRevenue();
        summary.put("totalRevenue", revenue != null ? revenue : 0.0);
        
        return ResponseEntity.ok(summary);
    }
}