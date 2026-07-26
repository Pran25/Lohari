package com.lohari.controller;

import com.lohari.model.Inquiry;
import com.lohari.repository.InquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class InquiryController {

    @Autowired
    private InquiryRepository inquiryRepository;

    // ✅ User submits inquiry (Public)
    @PostMapping
    public ResponseEntity<Inquiry> createInquiry(@RequestBody Inquiry inquiry) {
        inquiry.setCreatedAt(LocalDateTime.now());
        inquiry.setIsRead(false);
        Inquiry saved = inquiryRepository.save(inquiry);
        return ResponseEntity.ok(saved);
    }

    // ✅ Get all inquiries (Admin only)
    @GetMapping("/admin/all")
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        return ResponseEntity.ok(inquiryRepository.findAllByOrderByCreatedAtDesc());
    }

    // ✅ Mark as read (Admin only)
    @PatchMapping("/admin/{id}/read")
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
    public ResponseEntity<Void> deleteInquiry(@PathVariable Long id) {
        if (inquiryRepository.existsById(id)) {
            inquiryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}