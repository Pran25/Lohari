package com.lohari.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            log.info("Email sent to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    public void sendOrderConfirmation(String to, String orderNumber, String customerName) {
        String subject = "Order Confirmation - " + orderNumber;
        String body = "Dear " + customerName + ",\n\n" +
                      "Thank you for your order with Lohari Fabrication!\n\n" +
                      "Order Number: " + orderNumber + "\n" +
                      "Status: PENDING\n\n" +
                      "We will contact you soon.\n\n" +
                      "Thanks,\n" +
                      "Lohari Fabrication Team";
        sendEmail(to, subject, body);
    }

    public void sendOrderStatusUpdate(String to, String orderNumber, String status, String description) {
        String subject = "Order Status Update - " + orderNumber;
        String body = "Dear Customer,\n\n" +
                      "Your order " + orderNumber + " status has been updated.\n\n" +
                      "New Status: " + status + "\n" +
                      "Description: " + description + "\n\n" +
                      "Thanks,\n" +
                      "Lohari Fabrication Team";
        sendEmail(to, subject, body);
    }
}