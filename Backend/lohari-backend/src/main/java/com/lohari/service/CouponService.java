package com.lohari.service;

import com.lohari.dto.CouponDTO.*;
import com.lohari.model.Coupon;
import com.lohari.model.Coupon.CouponType;
import com.lohari.repository.CouponRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CouponService {

    private static final Logger log = LoggerFactory.getLogger(CouponService.class);

    @Autowired
    private CouponRepository couponRepository;

    // ============================================
    // ADMIN — CREATE COUPON
    // ============================================
    public CouponResponse createCoupon(CreateRequest request) {
        log.info("Creating coupon: {}", request.getCode());

        // Validate code
        if (request.getCode() == null || request.getCode().isBlank()) {
            throw new RuntimeException("Coupon code is required");
        }

        String code = request.getCode().trim().toUpperCase();

        if (couponRepository.existsByCodeIgnoreCase(code)) {
            throw new RuntimeException("Coupon with code '" + code + "' already exists!");
        }

        // Validate value
        if (request.getValue() == null || request.getValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Coupon value must be greater than 0");
        }

        // Validate type
        CouponType type;
        try {
            type = CouponType.valueOf(request.getType().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid coupon type: " + request.getType());
        }

        // Validate percentage
        if (type == CouponType.PERCENTAGE && request.getValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new RuntimeException("Percentage discount cannot exceed 100%");
        }

        // Validate dates
        if (request.getValidFrom() != null && request.getValidTo() != null) {
            if (request.getValidFrom().isAfter(request.getValidTo())) {
                throw new RuntimeException("Valid From date must be before Valid To date");
            }
        }

        // Build coupon
        Coupon coupon = new Coupon();
        coupon.setCode(code);
        coupon.setDescription(request.getDescription());
        coupon.setType(type);
        coupon.setValue(request.getValue());
        coupon.setMinOrderAmount(request.getMinOrderAmount());
        coupon.setMaxDiscount(request.getMaxDiscount());
        coupon.setValidFrom(request.getValidFrom());
        coupon.setValidTo(request.getValidTo());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setPerUserLimit(request.getPerUserLimit() != null ? request.getPerUserLimit() : 1);
        coupon.setCustomerEmail(request.getCustomerEmail());
        coupon.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        coupon.setIsPublic(request.getCustomerEmail() == null || request.getCustomerEmail().isBlank());
        coupon.setUsedCount(0);

        Coupon saved = couponRepository.save(coupon);
        log.info("✅ Coupon created: {}", saved.getCode());

        return mapToResponse(saved);
    }

    // ============================================
    // ADMIN — UPDATE COUPON
    // ============================================
    public CouponResponse updateCoupon(Long id, UpdateRequest request) {
        log.info("Updating coupon id: {}", id);

        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Coupon not found: " + id));

        if (request.getDescription() != null) coupon.setDescription(request.getDescription());
        if (request.getValue() != null) {
            if (request.getValue().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Coupon value must be greater than 0");
            }
            if (coupon.getType() == CouponType.PERCENTAGE &&
                request.getValue().compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new RuntimeException("Percentage discount cannot exceed 100%");
            }
            coupon.setValue(request.getValue());
        }
        if (request.getMinOrderAmount() != null) coupon.setMinOrderAmount(request.getMinOrderAmount());
        if (request.getMaxDiscount() != null) coupon.setMaxDiscount(request.getMaxDiscount());
        if (request.getValidFrom() != null) coupon.setValidFrom(request.getValidFrom());
        if (request.getValidTo() != null) coupon.setValidTo(request.getValidTo());
        if (request.getUsageLimit() != null) coupon.setUsageLimit(request.getUsageLimit());
        if (request.getPerUserLimit() != null) coupon.setPerUserLimit(request.getPerUserLimit());
        if (request.getCustomerEmail() != null) {
            coupon.setCustomerEmail(request.getCustomerEmail());
            coupon.setIsPublic(request.getCustomerEmail().isBlank());
        }
        if (request.getIsActive() != null) coupon.setIsActive(request.getIsActive());
        if (request.getIsPublic() != null) coupon.setIsPublic(request.getIsPublic());

        Coupon updated = couponRepository.save(coupon);
        log.info("✅ Coupon updated: {}", updated.getCode());

        return mapToResponse(updated);
    }

    // ============================================
    // ADMIN — DELETE COUPON
    // ============================================
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new EntityNotFoundException("Coupon not found: " + id);
        }
        couponRepository.deleteById(id);
        log.info("🗑️ Coupon deleted: {}", id);
    }

    // ============================================
    // ADMIN — TOGGLE ACTIVE
    // ============================================
    public CouponResponse toggleActive(Long id) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Coupon not found: " + id));

        coupon.setIsActive(!Boolean.TRUE.equals(coupon.getIsActive()));
        Coupon updated = couponRepository.save(coupon);

        log.info("🔄 Coupon {} → {}", updated.getCode(),
            updated.getIsActive() ? "ACTIVE" : "INACTIVE");

        return mapToResponse(updated);
    }

    // ============================================
    // ADMIN — GET ALL
    // ============================================
    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAllOrderByCreatedAtDesc().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // ============================================
    // ADMIN — GET BY ID
    // ============================================
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Coupon not found: " + id));
        return mapToResponse(coupon);
    }

    // ============================================
    // CUSTOMER — GET PUBLIC COUPONS
    // ============================================
    public List<CouponResponse> getActivePublicCoupons() {
        return couponRepository.findActivePublicCoupons(LocalDateTime.now()).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // ============================================
    // CUSTOMER — GET MY COUPONS (private + public)
    // ============================================
    public List<CouponResponse> getCouponsForCustomer(String email) {
        if (email == null || email.isBlank()) {
            return getActivePublicCoupons();
        }

        List<Coupon> publicCoupons = couponRepository.findActivePublicCoupons(LocalDateTime.now());
        List<Coupon> privateCoupons = couponRepository.findActiveCouponsForCustomer(email, LocalDateTime.now());

        // Merge (avoid duplicates)
        java.util.Map<Long, Coupon> merged = new java.util.LinkedHashMap<>();
        publicCoupons.forEach(c -> merged.put(c.getId(), c));
        privateCoupons.forEach(c -> merged.put(c.getId(), c));

        return merged.values().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // ============================================
    // CUSTOMER — VALIDATE COUPON
    // ============================================
    public ValidateResponse validateCoupon(ValidateRequest request) {
        log.info("Validating coupon: {} for amount: {}", request.getCode(), request.getOrderAmount());

        // 1. Basic validation
        if (request.getCode() == null || request.getCode().isBlank()) {
            return fail("Coupon code is required");
        }
        if (request.getOrderAmount() == null || request.getOrderAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return fail("Order amount must be greater than 0");
        }

        // 2. Find coupon
        Coupon coupon = couponRepository.findByCodeIgnoreCase(request.getCode().trim()).orElse(null);
        if (coupon == null) {
            return fail("Invalid coupon code");
        }

        // 3. Check active
        if (!Boolean.TRUE.equals(coupon.getIsActive())) {
            return fail("Coupon is not active");
        }

        // 4. Check validity dates
        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
            return fail("Coupon is not yet valid");
        }
        if (coupon.getValidTo() != null && now.isAfter(coupon.getValidTo())) {
            return fail("Coupon has expired");
        }

        // 5. Check usage limit
        if (coupon.getUsageLimit() != null &&
            coupon.getUsedCount() != null &&
            coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return fail("Coupon usage limit reached");
        }

        // 6. Check customer eligibility (private coupon)
        if (coupon.getCustomerEmail() != null && !coupon.getCustomerEmail().isBlank()) {
            if (request.getCustomerEmail() == null ||
                !coupon.getCustomerEmail().equalsIgnoreCase(request.getCustomerEmail())) {
                return fail("This coupon is not valid for your account");
            }
        }

        // 7. Check minimum order amount
        if (coupon.getMinOrderAmount() != null &&
            request.getOrderAmount().compareTo(coupon.getMinOrderAmount()) < 0) {
            return fail("Minimum order amount ₹" + coupon.getMinOrderAmount() + " required");
        }

        // 8. Calculate discount
        BigDecimal discount = calculateDiscount(coupon, request.getOrderAmount());

        // 9. Ensure discount doesn't exceed order amount
        if (discount.compareTo(request.getOrderAmount()) > 0) {
            discount = request.getOrderAmount();
        }

        BigDecimal finalAmount = request.getOrderAmount().subtract(discount);

        // 10. Build success response
        ValidateResponse response = new ValidateResponse(true, "Coupon applied successfully!");
        response.setCode(coupon.getCode());
        response.setType(coupon.getType().name());
        response.setDiscountAmount(discount);
        response.setOriginalAmount(request.getOrderAmount());
        response.setFinalAmount(finalAmount);

        log.info("✅ Coupon valid: {} → discount ₹{}", coupon.getCode(), discount);
        return response;
    }

    // ============================================
    // CALCULATE DISCOUNT
    // ============================================
    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        BigDecimal discount;

        if (coupon.getType() == CouponType.PERCENTAGE) {
            // Percentage discount
            discount = orderAmount
                .multiply(coupon.getValue())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            // Apply max discount cap if set
            if (coupon.getMaxDiscount() != null &&
                discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
        } else {
            // Flat discount
            discount = coupon.getValue();
        }

        return discount;
    }

    // ============================================
    // APPLY COUPON (increment usage)
    // ============================================
    public void applyCoupon(String code) {
        if (code == null || code.isBlank()) return;

        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim()).orElse(null);
        if (coupon != null) {
            coupon.incrementUsage();
            couponRepository.save(coupon);
            log.info("📈 Coupon {} used. Total: {}/{}",
                coupon.getCode(), coupon.getUsedCount(), coupon.getUsageLimit());
        }
    }

    // ============================================
    // STATS (Admin)
    // ============================================
    public java.util.Map<String, Object> getCouponStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalCoupons", couponRepository.count());
        stats.put("activeCoupons", couponRepository.countActiveCoupons());
        stats.put("totalUsage", couponRepository.sumTotalUsage());
        return stats;
    }

    // ============================================
    // HELPERS
    // ============================================
    private ValidateResponse fail(String message) {
        return new ValidateResponse(false, message);
    }

    private CouponResponse mapToResponse(Coupon coupon) {
        CouponResponse response = new CouponResponse();
        response.setId(coupon.getId());
        response.setCode(coupon.getCode());
        response.setDescription(coupon.getDescription());
        response.setType(coupon.getType() != null ? coupon.getType().name() : null);
        response.setValue(coupon.getValue());
        response.setMinOrderAmount(coupon.getMinOrderAmount());
        response.setMaxDiscount(coupon.getMaxDiscount());
        response.setValidFrom(coupon.getValidFrom());
        response.setValidTo(coupon.getValidTo());
        response.setUsageLimit(coupon.getUsageLimit());
        response.setUsedCount(coupon.getUsedCount());
        response.setPerUserLimit(coupon.getPerUserLimit());
        response.setCustomerEmail(coupon.getCustomerEmail());
        response.setIsActive(coupon.getIsActive());
        response.setIsPublic(coupon.getIsPublic());
        response.setCreatedAt(coupon.getCreatedAt());
        response.setUpdatedAt(coupon.getUpdatedAt());

        // Computed fields
        response.setIsValid(coupon.isValid());

        boolean expired = coupon.getValidTo() != null &&
            LocalDateTime.now().isAfter(coupon.getValidTo());
        response.setIsExpired(expired);

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() != null) {
            response.setRemainingUses(Math.max(0, coupon.getUsageLimit() - coupon.getUsedCount()));
        }

        return response;
    }
}