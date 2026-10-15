package com.lohari.controller;

import com.lohari.model.Inquiry;
import com.lohari.repository.InquiryRepository;
import com.lohari.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class InquiryController {

    private static final Logger log = LoggerFactory.getLogger(InquiryController.class);
    private static final DateTimeFormatter RECEIVED_AT_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a", Locale.ENGLISH);

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.admin.email}")
    private String adminEmail;

    // ✅ User submits inquiry (Public)
    @PostMapping
    public ResponseEntity<Map<String, Object>> createInquiry(@RequestBody Inquiry inquiry) {
        inquiry.setCreatedAt(LocalDateTime.now());
        inquiry.setIsRead(false);
        Inquiry saved = inquiryRepository.save(inquiry);

        boolean isSiteVisit = "fitting".equalsIgnoreCase(saved.getInquiryType());
        String receivedAt = saved.getCreatedAt().format(RECEIVED_AT_FORMAT);
        String customerEmailBody = isSiteVisit
                ? """
                    Dear %s,

                    Thank you for contacting Lohari Fabrication. We received your site visit request on %s.

                    Requested visit date: %s
                    Requested visit time: %s
                    Site address: %s
                    Phone number: %s

                    Our team will contact you to confirm the visit details. This email acknowledges your request; it is not a confirmed appointment.

                    Your message:
                    %s

                    Regards,
                    Lohari Fabrication Team
                    """.formatted(
                        saved.getName(),
                        receivedAt,
                        valueOrUnavailable(saved.getPreferredDate()),
                        valueOrUnavailable(saved.getPreferredTime()),
                        valueOrUnavailable(saved.getAddress()),
                        valueOrUnavailable(saved.getPhone()),
                        valueOrUnavailable(saved.getMessage()))
                : """
                    Dear %s,

                    Thank you for contacting Lohari Fabrication. We have received your inquiry and our team will contact you soon.

                    Your message:
                    %s

                    Regards,
                    Lohari Fabrication Team
                    """.formatted(saved.getName(), valueOrUnavailable(saved.getMessage()));
        String adminEmailBody = isSiteVisit
                ? """
                    A new site visit booking request was submitted on %s.

                    Customer: %s
                    Email: %s
                    Phone: %s
                    Requested visit date: %s
                    Requested visit time: %s
                    Site address: %s

                    Message:
                    %s

                    View inquiries: http://localhost:5173/admin/inquiries
                    """.formatted(
                        receivedAt,
                        saved.getName(),
                        saved.getEmail(),
                        valueOrUnavailable(saved.getPhone()),
                        valueOrUnavailable(saved.getPreferredDate()),
                        valueOrUnavailable(saved.getPreferredTime()),
                        valueOrUnavailable(saved.getAddress()),
                        valueOrUnavailable(saved.getMessage()))
                : """
                    A new inquiry was submitted on %s.

                    Customer: %s
                    Email: %s
                    Phone: %s

                    Message:
                    %s

                    View inquiries: http://localhost:5173/admin/inquiries
                    """.formatted(
                        receivedAt,
                        saved.getName(),
                        saved.getEmail(),
                        valueOrUnavailable(saved.getPhone()),
                        valueOrUnavailable(saved.getMessage()));

        boolean customerEmailSent = emailService.sendEmail(
                saved.getEmail(),
                isSiteVisit
                        ? "Site Visit Request Received - Lohari Fabrication"
                        : "Lohari Fabrication - We received your inquiry",
                customerEmailBody);

        boolean adminEmailSent = emailService.sendEmail(
                adminEmail,
                (isSiteVisit ? "New Site Visit Booking Request" : "New Inquiry")
                        + " from " + saved.getName(),
                adminEmailBody);

        if (!customerEmailSent || !adminEmailSent) {
            log.warn(
                    "Inquiry {} saved; email delivery status: customer={}, admin={}",
                    saved.getId(), customerEmailSent, adminEmailSent);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("inquiry", saved);
        response.put("customerEmailSent", customerEmailSent);
        response.put("adminEmailSent", adminEmailSent);
        return ResponseEntity.ok(response);
    }

    // ✅ Get all inquiries (Admin only)
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        return ResponseEntity.ok(inquiryRepository.findAllByOrderByCreatedAtDesc());
    }

    // ✅ Mark as read (Admin only)
    @PatchMapping("/admin/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Inquiry> markAsRead(@PathVariable Long id) {
        return inquiryRepository.findById(id)
                .map(inquiry -> {
                    inquiry.setIsRead(true);
                    return ResponseEntity.ok(inquiryRepository.save(inquiry));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete inquiry (Admin only)
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteInquiry(@PathVariable Long id) {
        if (inquiryRepository.existsById(id)) {
            inquiryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private String valueOrUnavailable(String value) {
        return value == null || value.isBlank() ? "Not provided" : value;
    }
}