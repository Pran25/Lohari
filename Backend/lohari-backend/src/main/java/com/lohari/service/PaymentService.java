package com.lohari.service;

import com.lohari.model.Order;
import com.lohari.model.OrderStatus;
import com.lohari.model.Payment;
import com.lohari.repository.OrderRepository;
import com.lohari.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ✅ Create Razorpay Order
    @Transactional
    public Map<String, Object> createRazorpayOrder(Long orderId, Double amount) throws RazorpayException {
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ✅ Create Razorpay order
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (amount * 100)); // Convert to paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_" + orderId);
        orderRequest.put("payment_capture", 1); // Auto-capture

        com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        // ✅ Save payment record
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setRazorpayOrderId(razorpayOrder.get("id"));
        payment.setAmount(amount);
        payment.setStatus("CREATED");
        paymentRepository.save(payment);

        // ✅ Update order with Razorpay order ID
        order.setRazorpayOrderId(razorpayOrder.get("id"));
        orderRepository.save(order);

        // ✅ Return response
        Map<String, Object> response = new HashMap<>();
        response.put("razorpayOrderId", razorpayOrder.get("id"));
        response.put("amount", amount);
        response.put("currency", "INR");
        response.put("orderId", orderId);
        response.put("keyId", "YOUR_RAZORPAY_KEY_ID"); // ✅ Replace with actual key

        return response;
    }

    // ✅ Verify Payment
    @Transactional
    public Map<String, Object> verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        
        // ✅ Find payment
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // ✅ Update payment details
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setStatus("SUCCESS");
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // ✅ Update order status
        Order order = orderRepository.findById(payment.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setPaymentStatus("PAID");
        order.setStatus(OrderStatus.ADVANCE_PAID);
        orderRepository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment verified successfully");
        response.put("orderId", order.getId());
        response.put("paymentStatus", "PAID");

        return response;
    }

    // ✅ Get Payment Status
    public Map<String, Object> getPaymentStatus(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("razorpayOrderId", payment.getRazorpayOrderId());
        response.put("razorpayPaymentId", payment.getRazorpayPaymentId());
        response.put("status", payment.getStatus());
        response.put("amount", payment.getAmount());

        return response;
    }
}