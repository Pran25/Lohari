package com.lohari.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderResponse {

    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private AddressResponse deliveryAddress;

    private String productName;
    private String productImage;
    private String material;
    private String finish;

    private DimensionsResponse dimensions;

    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private BigDecimal advanceAmount;
    private BigDecimal balanceAmount;

    private String status;
    private String statusDescription;

    private LocalDateTime orderDate;
    private LocalDateTime siteVisitDate;
    private LocalDateTime fabricationStartDate;
    private LocalDateTime expectedDeliveryDate;
    private LocalDateTime actualDeliveryDate;
    private Integer leadTimeDays;

    private String customerNotes;
    private String adminNotes;
    private String specialInstructions;

    private String sketchUrl;
    private String cadDrawingUrl;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String paymentStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ========== INNER CLASSES ==========

    public static class AddressResponse {
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String pincode;
        private String country;

        public String getAddressLine1() { return addressLine1; }
        public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

        public String getAddressLine2() { return addressLine2; }
        public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getPincode() { return pincode; }
        public void setPincode(String pincode) { this.pincode = pincode; }

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }

    public static class DimensionsResponse {
        private BigDecimal width;
        private BigDecimal height;
        private BigDecimal depth;
        private String unit;

        public BigDecimal getWidth() { return width; }
        public void setWidth(BigDecimal width) { this.width = width; }

        public BigDecimal getHeight() { return height; }
        public void setHeight(BigDecimal height) { this.height = height; }

        public BigDecimal getDepth() { return depth; }
        public void setDepth(BigDecimal depth) { this.depth = depth; }

        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
    }

    // ========== GETTERS AND SETTERS ==========

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public AddressResponse getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(AddressResponse deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getFinish() { return finish; }
    public void setFinish(String finish) { this.finish = finish; }

    public DimensionsResponse getDimensions() { return dimensions; }
    public void setDimensions(DimensionsResponse dimensions) { this.dimensions = dimensions; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getAdvanceAmount() { return advanceAmount; }
    public void setAdvanceAmount(BigDecimal advanceAmount) { this.advanceAmount = advanceAmount; }

    public BigDecimal getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(BigDecimal balanceAmount) { this.balanceAmount = balanceAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStatusDescription() { return statusDescription; }
    public void setStatusDescription(String statusDescription) { this.statusDescription = statusDescription; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public LocalDateTime getSiteVisitDate() { return siteVisitDate; }
    public void setSiteVisitDate(LocalDateTime siteVisitDate) { this.siteVisitDate = siteVisitDate; }

    public LocalDateTime getFabricationStartDate() { return fabricationStartDate; }
    public void setFabricationStartDate(LocalDateTime fabricationStartDate) { this.fabricationStartDate = fabricationStartDate; }

    public LocalDateTime getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(LocalDateTime expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

    public LocalDateTime getActualDeliveryDate() { return actualDeliveryDate; }
    public void setActualDeliveryDate(LocalDateTime actualDeliveryDate) { this.actualDeliveryDate = actualDeliveryDate; }

    public Integer getLeadTimeDays() { return leadTimeDays; }
    public void setLeadTimeDays(Integer leadTimeDays) { this.leadTimeDays = leadTimeDays; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public String getSketchUrl() { return sketchUrl; }
    public void setSketchUrl(String sketchUrl) { this.sketchUrl = sketchUrl; }

    public String getCadDrawingUrl() { return cadDrawingUrl; }
    public void setCadDrawingUrl(String cadDrawingUrl) { this.cadDrawingUrl = cadDrawingUrl; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}