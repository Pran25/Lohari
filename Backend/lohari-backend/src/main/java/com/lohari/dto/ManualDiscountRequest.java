package com.lohari.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ManualDiscountRequest {

    @NotNull(message = "Discount amount is required")
    @DecimalMin(value = "0.01", message = "Discount amount must be greater than 0")
    private BigDecimal discountAmount;

    private String reason;

    public ManualDiscountRequest() {}

    public ManualDiscountRequest(BigDecimal discountAmount, String reason) {
        this.discountAmount = discountAmount;
        this.reason = reason;
    }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}