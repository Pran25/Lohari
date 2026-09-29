package com.lohari.controller;

import com.lohari.dto.QuotationDTO.QuotationRequest;
import com.lohari.dto.QuotationDTO.QuotationResponse;
import com.lohari.service.QuotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:3001",
    "http://localhost:3000"
})
public class QuotationController {

    @Autowired
    private QuotationService quotationService;

    // ============================================
    // GENERATE + EMAIL QUOTATION
    // POST /api/quotations/generate
    // ============================================
    @PostMapping("/generate")
    public ResponseEntity<QuotationResponse> generateQuotation(
            @RequestBody QuotationRequest request) {

        if (request.getOrderId() == null) {
            return ResponseEntity.badRequest().build();
        }

        QuotationResponse response = quotationService.generateQuotation(request);
        return ResponseEntity.ok(response);
    }

    // ============================================
    // HEALTH CHECK
    // GET /api/quotations/health
    // ============================================
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Quotation service is running");
    }
}