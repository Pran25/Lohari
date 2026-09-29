package com.lohari.controller;

import com.lohari.dto.CouponDTO.*;
import com.lohari.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class CouponController {

    @Autowired
    private CouponService couponService;

    // ============================================
    // ADMIN ENDPOINTS
    // ============================================

    // CREATE COUPON
    // POST /api/coupons/admin
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponResponse> createCoupon(@RequestBody CreateRequest request) {
        CouponResponse response = couponService.createCoupon(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // UPDATE COUPON
    // PUT /api/coupons/admin/{id}
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponResponse> updateCoupon(
            @PathVariable Long id,
            @RequestBody UpdateRequest request) {
        CouponResponse response = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(response);
    }

    // DELETE COUPON
    // DELETE /api/coupons/admin/{id}
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    // TOGGLE ACTIVE/INACTIVE
    // PUT /api/coupons/admin/{id}/toggle
    @PutMapping("/admin/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponResponse> toggleActive(@PathVariable Long id) {
        CouponResponse response = couponService.toggleActive(id);
        return ResponseEntity.ok(response);
    }

    // GET ALL COUPONS
    // GET /api/coupons/admin
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CouponResponse>> getAllCoupons() {
        List<CouponResponse> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(coupons);
    }

    // GET COUPON BY ID
    // GET /api/coupons/admin/{id}
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponResponse> getCouponById(@PathVariable Long id) {
        CouponResponse response = couponService.getCouponById(id);
        return ResponseEntity.ok(response);
    }

    // GET COUPON STATS
    // GET /api/coupons/admin/stats
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCouponStats() {
        return ResponseEntity.ok(couponService.getCouponStats());
    }

    // ============================================
    // CUSTOMER ENDPOINTS
    // ============================================

    // VALIDATE COUPON
    // POST /api/coupons/validate
    @PostMapping("/validate")
    public ResponseEntity<ValidateResponse> validateCoupon(@RequestBody ValidateRequest request) {
        ValidateResponse response = couponService.validateCoupon(request);
        return ResponseEntity.ok(response);
    }

    // GET ACTIVE PUBLIC COUPONS
    // GET /api/coupons/public
    @GetMapping("/public")
    public ResponseEntity<List<CouponResponse>> getPublicCoupons() {
        List<CouponResponse> coupons = couponService.getActivePublicCoupons();
        return ResponseEntity.ok(coupons);
    }

    // GET COUPONS FOR A CUSTOMER (public + private)
    // GET /api/coupons/my?email=pranav@email.com
    @GetMapping("/my")
    public ResponseEntity<List<CouponResponse>> getMyCoupons(
            @RequestParam(required = false) String email) {
        List<CouponResponse> coupons = couponService.getCouponsForCustomer(email);
        return ResponseEntity.ok(coupons);
    }

    // ============================================
    // HEALTH CHECK
    // GET /api/coupons/health
    // ============================================
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Coupon service is running");
    }
}