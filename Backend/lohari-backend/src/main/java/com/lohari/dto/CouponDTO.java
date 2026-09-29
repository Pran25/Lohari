package com.lohari.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * All coupon DTOs in one file.
 * Use as: CouponDTO.CreateRequest, CouponDTO.ValidateResponse, etc.
 */
public class CouponDTO {

    // ============================================
    // 1. CREATE REQUEST (Admin)
    // ============================================
    public static class CreateRequest {
        private String code;
        private String description;
        private String type;              // "PERCENTAGE" or "FLAT"
        private BigDecimal value;
        private BigDecimal minOrderAmount;
        private BigDecimal maxDiscount;
        private LocalDateTime validFrom;
        private LocalDateTime validTo;
        private Integer usageLimit;
        private Integer perUserLimit;
        private String customerEmail;     // null = public
        private Boolean isActive = true;
        private Boolean isPublic = true;

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public BigDecimal getValue() { return value; }
        public void setValue(BigDecimal value) { this.value = value; }

        public BigDecimal getMinOrderAmount() { return minOrderAmount; }
        public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

        public BigDecimal getMaxDiscount() { return maxDiscount; }
        public void setMaxDiscount(BigDecimal maxDiscount) { this.maxDiscount = maxDiscount; }

        public LocalDateTime getValidFrom() { return validFrom; }
        public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

        public LocalDateTime getValidTo() { return validTo; }
        public void setValidTo(LocalDateTime validTo) { this.validTo = validTo; }

        public Integer getUsageLimit() { return usageLimit; }
        public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

        public Integer getPerUserLimit() { return perUserLimit; }
        public void setPerUserLimit(Integer perUserLimit) { this.perUserLimit = perUserLimit; }

        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }

        public Boolean getIsPublic() { return isPublic; }
        public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    }

    // ============================================
    // 2. UPDATE REQUEST (Admin)
    // ============================================
    public static class UpdateRequest {
        private String description;
        private BigDecimal value;
        private BigDecimal minOrderAmount;
        private BigDecimal maxDiscount;
        private LocalDateTime validFrom;
        private LocalDateTime validTo;
        private Integer usageLimit;
        private Integer perUserLimit;
        private String customerEmail;
        private Boolean isActive;
        private Boolean isPublic;

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public BigDecimal getValue() { return value; }
        public void setValue(BigDecimal value) { this.value = value; }

        public BigDecimal getMinOrderAmount() { return minOrderAmount; }
        public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

        public BigDecimal getMaxDiscount() { return maxDiscount; }
        public void setMaxDiscount(BigDecimal maxDiscount) { this.maxDiscount = maxDiscount; }

        public LocalDateTime getValidFrom() { return validFrom; }
        public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

        public LocalDateTime getValidTo() { return validTo; }
        public void setValidTo(LocalDateTime validTo) { this.validTo = validTo; }

        public Integer getUsageLimit() { return usageLimit; }
        public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

        public Integer getPerUserLimit() { return perUserLimit; }
        public void setPerUserLimit(Integer perUserLimit) { this.perUserLimit = perUserLimit; }

        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }

        public Boolean getIsPublic() { return isPublic; }
        public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    }

    // ============================================
    // 3. VALIDATE REQUEST (Customer Checkout)
    // ============================================
    public static class ValidateRequest {
        private String code;
        private BigDecimal orderAmount;
        private String customerEmail;

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public BigDecimal getOrderAmount() { return orderAmount; }
        public void setOrderAmount(BigDecimal orderAmount) { this.orderAmount = orderAmount; }

        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    }

    // ============================================
    // 4. VALIDATE RESPONSE (Success/Failure)
    // ============================================
    public static class ValidateResponse {
        private boolean valid;
        private String message;
        private String code;
        private String type;
        private BigDecimal discountAmount;
        private BigDecimal originalAmount;
        private BigDecimal finalAmount;

        public ValidateResponse() {}

        public ValidateResponse(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() { return valid; }
        public void setValid(boolean valid) { this.valid = valid; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public BigDecimal getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

        public BigDecimal getOriginalAmount() { return originalAmount; }
        public void setOriginalAmount(BigDecimal originalAmount) { this.originalAmount = originalAmount; }

        public BigDecimal getFinalAmount() { return finalAmount; }
        public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }
    }

    // ============================================
    // 5. COUPON RESPONSE (Full details)
    // ============================================
    public static class CouponResponse {
        private Long id;
        private String code;
        private String description;
        private String type;
        private BigDecimal value;
        private BigDecimal minOrderAmount;
        private BigDecimal maxDiscount;
        private LocalDateTime validFrom;
        private LocalDateTime validTo;
        private Integer usageLimit;
        private Integer usedCount;
        private Integer perUserLimit;
        private String customerEmail;
        private Boolean isActive;
        private Boolean isPublic;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        // Computed
        private Boolean isValid;
        private Boolean isExpired;
        private Integer remainingUses;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public BigDecimal getValue() { return value; }
        public void setValue(BigDecimal value) { this.value = value; }

        public BigDecimal getMinOrderAmount() { return minOrderAmount; }
        public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

        public BigDecimal getMaxDiscount() { return maxDiscount; }
        public void setMaxDiscount(BigDecimal maxDiscount) { this.maxDiscount = maxDiscount; }

        public LocalDateTime getValidFrom() { return validFrom; }
        public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

        public LocalDateTime getValidTo() { return validTo; }
        public void setValidTo(LocalDateTime validTo) { this.validTo = validTo; }

        public Integer getUsageLimit() { return usageLimit; }
        public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

        public Integer getUsedCount() { return usedCount; }
        public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }

        public Integer getPerUserLimit() { return perUserLimit; }
        public void setPerUserLimit(Integer perUserLimit) { this.perUserLimit = perUserLimit; }

        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }

        public Boolean getIsPublic() { return isPublic; }
        public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

        public Boolean getIsValid() { return isValid; }
        public void setIsValid(Boolean isValid) { this.isValid = isValid; }

        public Boolean getIsExpired() { return isExpired; }
        public void setIsExpired(Boolean isExpired) { this.isExpired = isExpired; }

        public Integer getRemainingUses() { return remainingUses; }
        public void setRemainingUses(Integer remainingUses) { this.remainingUses = remainingUses; }
    }
}