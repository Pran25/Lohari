package com.lohari.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendContact(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String email = (String) request.get("email");
            String phone = (String) request.get("phone");
            String inquiryType = (String) request.get("inquiryType");
            String message = (String) request.get("message");
            String preferredDate = (String) request.get("preferredDate");
            String preferredTime = (String) request.get("preferredTime");
            String address = (String) request.get("address");

            // ✅ Send email to admin
            String subject = "🔔 New Inquiry: " + inquiryType.toUpperCase() + " from " + name;
            String body = String.format("""
                📋 NEW CONTACT FORM SUBMISSION
                ═══════════════════════════════
                
                📌 Inquiry Type: %s
                👤 Name: %s
                📧 Email: %s
                📱 Phone: %s
                
                💬 Message:
                %s
                
                📅 Preferred Date: %s
                🕐 Preferred Time: %s
                📍 Address: %s
                
                ═══════════════════════════════
                📅 Received at: %s
                
                📞 Call the customer on: %s
                """, 
                inquiryType, name, email, phone, message, 
                preferredDate != null ? preferredDate : "N/A",
                preferredTime != null ? preferredTime : "N/A",
                address != null ? address : "N/A",
                LocalDateTime.now(),
                phone
            );

            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo("lohari.orders@gmail.com"); // ✅ Your email
            mail.setSubject(subject);
            mail.setText(body);
            mailSender.send(mail);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Message sent successfully!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}