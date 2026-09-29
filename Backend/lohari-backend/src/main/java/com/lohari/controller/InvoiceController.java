package com.lohari.controller;

import com.lohari.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    // ✅ Download Invoice PDF
    @GetMapping("/{orderId}/download")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long orderId) {
        byte[] pdfBytes = invoiceService.generateInvoice(orderId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + orderId + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }

    // ✅ View Invoice in Browser
    @GetMapping("/{orderId}/view")
    public ResponseEntity<byte[]> viewInvoice(@PathVariable Long orderId) {
        byte[] pdfBytes = invoiceService.generateInvoice(orderId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "invoice-" + orderId + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }

    // ✅ NEW: Email Invoice to Customer + Admin
    @PostMapping("/{orderId}/email")
    public ResponseEntity<Map<String, String>> emailInvoice(@PathVariable Long orderId) {
        invoiceService.sendInvoiceToCustomerAndAdmin(orderId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Invoice emailed to customer and admin successfully");
        response.put("orderId", orderId.toString());

        return ResponseEntity.ok(response);
    }
}