package com.lohari.controller;

import com.lohari.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // ✅ Create Razorpay Order
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        try {
            Double amount = Double.valueOf(request.get("amount").toString());
            Long orderId = Long.valueOf(request.get("orderId").toString());
            Map<String, Object> response = paymentService.createRazorpayOrder(orderId, amount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Verify Payment
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String razorpayOrderId = request.get("razorpayOrderId");
            String razorpayPaymentId = request.get("razorpayPaymentId");
            String razorpaySignature = request.get("razorpaySignature");
            
            Map<String, Object> response = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Get Payment Status
    @GetMapping("/status/{orderId}")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(@PathVariable Long orderId) {
        try {
            Map<String, Object> response = paymentService.getPaymentStatus(orderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}