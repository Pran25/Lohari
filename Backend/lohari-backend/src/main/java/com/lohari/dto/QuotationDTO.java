package com.lohari.dto;

import java.math.BigDecimal;

public class QuotationDTO {

    // ============================================
    // REQUEST — Admin fills this
    // ============================================
    public static class QuotationRequest {
        private Long orderId;
        private BigDecimal weightPerItemKg;   // Default from Product.weightKg
        private BigDecimal ratePerKg;
        private BigDecimal labourCharges;
        private BigDecimal designCharges;
        private BigDecimal transportCharges;
        private BigDecimal profitPercent;      // e.g., 15
        private BigDecimal gstPercent;         // e.g., 18
        private BigDecimal advancePercent;     // e.g., 30
        private String notes;
        private Integer validityDays;          // e.g., 15

        public Long getOrderId() { return orderId; }
        public void setOrderId(Long orderId) { this.orderId = orderId; }

        public BigDecimal getWeightPerItemKg() { return weightPerItemKg; }
        public void setWeightPerItemKg(BigDecimal weightPerItemKg) { this.weightPerItemKg = weightPerItemKg; }

        public BigDecimal getRatePerKg() { return ratePerKg; }
        public void setRatePerKg(BigDecimal ratePerKg) { this.ratePerKg = ratePerKg; }

        public BigDecimal getLabourCharges() { return labourCharges; }
        public void setLabourCharges(BigDecimal labourCharges) { this.labourCharges = labourCharges; }

        public BigDecimal getDesignCharges() { return designCharges; }
        public void setDesignCharges(BigDecimal designCharges) { this.designCharges = designCharges; }

        public BigDecimal getTransportCharges() { return transportCharges; }
        public void setTransportCharges(BigDecimal transportCharges) { this.transportCharges = transportCharges; }

        public BigDecimal getProfitPercent() { return profitPercent; }
        public void setProfitPercent(BigDecimal profitPercent) { this.profitPercent = profitPercent; }

        public BigDecimal getGstPercent() { return gstPercent; }
        public void setGstPercent(BigDecimal gstPercent) { this.gstPercent = gstPercent; }

        public BigDecimal getAdvancePercent() { return advancePercent; }
        public void setAdvancePercent(BigDecimal advancePercent) { this.advancePercent = advancePercent; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }

        public Integer getValidityDays() { return validityDays; }
        public void setValidityDays(Integer validityDays) { this.validityDays = validityDays; }
    }

    // ============================================
    // RESPONSE — Calculated breakdown
    // ============================================
    public static class QuotationResponse {
        private String quoteNumber;
        private Long orderId;
        private String orderNumber;

        // Product
        private String productName;
        private String material;
        private String finish;
        private String size;
        private Integer quantity;
        private BigDecimal weightPerItemKg;
        private BigDecimal totalWeightKg;
        private BigDecimal ratePerKg;

        // Calculation
        private BigDecimal metalCost;
        private BigDecimal labourCharges;
        private BigDecimal designCharges;
        private BigDecimal transportCharges;
        private BigDecimal subtotal;
        private BigDecimal profitPercent;
        private BigDecimal profitAmount;
        private BigDecimal beforeGst;
        private BigDecimal gstPercent;
        private BigDecimal gstAmount;
        private BigDecimal grandTotal;

        // Payment
        private BigDecimal advancePercent;
        private BigDecimal advanceAmount;
        private BigDecimal balanceAmount;

        // Meta
        private Integer validityDays;
        private String notes;

        public String getQuoteNumber() { return quoteNumber; }
        public void setQuoteNumber(String quoteNumber) { this.quoteNumber = quoteNumber; }

        public Long getOrderId() { return orderId; }
        public void setOrderId(Long orderId) { this.orderId = orderId; }

        public String getOrderNumber() { return orderNumber; }
        public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getMaterial() { return material; }
        public void setMaterial(String material) { this.material = material; }

        public String getFinish() { return finish; }
        public void setFinish(String finish) { this.finish = finish; }

        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getWeightPerItemKg() { return weightPerItemKg; }
        public void setWeightPerItemKg(BigDecimal weightPerItemKg) { this.weightPerItemKg = weightPerItemKg; }

        public BigDecimal getTotalWeightKg() { return totalWeightKg; }
        public void setTotalWeightKg(BigDecimal totalWeightKg) { this.totalWeightKg = totalWeightKg; }

        public BigDecimal getRatePerKg() { return ratePerKg; }
        public void setRatePerKg(BigDecimal ratePerKg) { this.ratePerKg = ratePerKg; }

        public BigDecimal getMetalCost() { return metalCost; }
        public void setMetalCost(BigDecimal metalCost) { this.metalCost = metalCost; }

        public BigDecimal getLabourCharges() { return labourCharges; }
        public void setLabourCharges(BigDecimal labourCharges) { this.labourCharges = labourCharges; }

        public BigDecimal getDesignCharges() { return designCharges; }
        public void setDesignCharges(BigDecimal designCharges) { this.designCharges = designCharges; }

        public BigDecimal getTransportCharges() { return transportCharges; }
        public void setTransportCharges(BigDecimal transportCharges) { this.transportCharges = transportCharges; }

        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

        public BigDecimal getProfitPercent() { return profitPercent; }
        public void setProfitPercent(BigDecimal profitPercent) { this.profitPercent = profitPercent; }

        public BigDecimal getProfitAmount() { return profitAmount; }
        public void setProfitAmount(BigDecimal profitAmount) { this.profitAmount = profitAmount; }

        public BigDecimal getBeforeGst() { return beforeGst; }
        public void setBeforeGst(BigDecimal beforeGst) { this.beforeGst = beforeGst; }

        public BigDecimal getGstPercent() { return gstPercent; }
        public void setGstPercent(BigDecimal gstPercent) { this.gstPercent = gstPercent; }

        public BigDecimal getGstAmount() { return gstAmount; }
        public void setGstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; }

        public BigDecimal getGrandTotal() { return grandTotal; }
        public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

        public BigDecimal getAdvancePercent() { return advancePercent; }
        public void setAdvancePercent(BigDecimal advancePercent) { this.advancePercent = advancePercent; }

        public BigDecimal getAdvanceAmount() { return advanceAmount; }
        public void setAdvanceAmount(BigDecimal advanceAmount) { this.advanceAmount = advanceAmount; }

        public BigDecimal getBalanceAmount() { return balanceAmount; }
        public void setBalanceAmount(BigDecimal balanceAmount) { this.balanceAmount = balanceAmount; }

        public Integer getValidityDays() { return validityDays; }
        public void setValidityDays(Integer validityDays) { this.validityDays = validityDays; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}