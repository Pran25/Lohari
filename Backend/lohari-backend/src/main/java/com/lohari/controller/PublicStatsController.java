package com.lohari.controller;

import com.lohari.repository.OrderRepository;
import com.lohari.repository.ProductRepository;
import com.lohari.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:3001",
    "http://localhost:3000"
})
public class PublicStatsController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // ============================================
    // PUBLIC STATS — For Homepage
    // GET /api/public/stats
    // ============================================
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPublicStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            long totalOrders = orderRepository.count();
            long totalProducts = productRepository.count();
            long totalUsers = userRepository.count();

            stats.put("projectsDone", totalOrders > 0 ? totalOrders : 500);
            stats.put("happyClients", totalUsers > 0 ? totalUsers : 100);
            stats.put("yearsExperience", 10);
            stats.put("totalProducts", totalProducts);
            stats.put("totalOrders", totalOrders);

        } catch (Exception e) {
            System.err.println("Failed to fetch public stats: " + e.getMessage());
            stats.put("projectsDone", 500);
            stats.put("happyClients", 100);
            stats.put("yearsExperience", 10);
            stats.put("totalProducts", 50);
            stats.put("totalOrders", 500);
        }

        return ResponseEntity.ok(stats);
    }
}