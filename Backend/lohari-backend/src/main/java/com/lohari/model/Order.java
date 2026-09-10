package com.lohari.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false, length = 50)
    private String orderNumber;

    // ========== CUSTOMER INFO ==========

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_email", nullable = false, length = 100)
    private String customerEmail;

    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Embedded
    private Address deliveryAddress;

    // ========== PRODUCT INFO ==========

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "product_slug", length = 255)
    private String productSlug;

    @Column(name = "product_image", length = 500)
    private String productImage;

    // ========== CUSTOMIZATION ==========

    @Column(name = "material", length = 100)
    private String material;

    @Column(name = "finish", length = 100)
    private String finish;

    @Column(name = "width", precision = 10, scale = 2)
    private BigDecimal width;

    @Column(name = "height", precision = 10, scale = 2)
    private BigDecimal height;

    @Column(name = "depth", precision = 10, scale = 2)
    private BigDecimal depth;

    @Column(name = "unit", length = 10)
    private String unit = "ft";

    @Column(name = "quantity")
    private Integer quantity = 1;

    // ========== PRICING ==========

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "advance_amount", precision = 10, scale = 2)
    private BigDecimal advanceAmount;

    @Column(name = "balance_amount", precision = 10, scale = 2)
    private BigDecimal balanceAmount;

    // ========== STATUS ==========

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    // ========== TIMELINES ==========

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "site_visit_date")
    private LocalDateTime siteVisitDate;

    @Column(name = "fabrication_start_date")
    private LocalDateTime fabricationStartDate;

    @Column(name = "expected_delivery_date")
    private LocalDateTime expectedDeliveryDate;

    @Column(name = "actual_delivery_date")
    private LocalDateTime actualDeliveryDate;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays = 15;

    // ========== NOTES ==========

    @Column(name = "customer_notes", columnDefinition = "TEXT")
    private String customerNotes;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    // ========== UPLOADS ==========

    @Column(name = "sketch_url", length = 500)
    private String sketchUrl;

    @Column(name = "cad_drawing_url", length = 500)
    private String cadDrawingUrl;

    @Column(name = "site_photos", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)  // ✅ THIS FIXES THE JSONB ERROR
    private List<String> sitePhotos;

    // ========== PAYMENT ==========

    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id", length = 100)
    private String razorpayPaymentId;

    @Column(name = "payment_status", length = 50)
    private String paymentStatus = "PENDING";

    // ========== RELATIONSHIPS ==========

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "vendor_id")
    private Long vendorId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderTracking> trackingHistory = new ArrayList<>();

    // ========== TIMESTAMPS ==========

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        orderDate = LocalDateTime.now();
        if (orderNumber == null) {
            orderNumber = generateOrderNumber();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private String generateOrderNumber() {
        return "LOH-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
    }

    // ========== HELPER METHODS ==========

    public void calculateTotalAmount() {
        if (unitPrice != null && quantity != null) {
            this.totalAmount = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }

    public void calculateBalanceAmount() {
        if (totalAmount != null && advanceAmount != null) {
            this.balanceAmount = totalAmount.subtract(advanceAmount);
        }
    }

    public void addTracking(OrderStatus status, String location, String description, String updatedBy) {
        OrderTracking tracking = new OrderTracking(status, location, description, this, updatedBy);
        this.trackingHistory.add(tracking);
        this.status = status;
    }

    public boolean isDelivered() {
        return status == OrderStatus.DELIVERED || status == OrderStatus.COMPLETED;
    }

    public boolean isCancelled() {
        return status == OrderStatus.CANCELLED;
    }

    public boolean isActive() {
        return !isDelivered() && !isCancelled();
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

    public Address getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(Address deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductSlug() { return productSlug; }
    public void setProductSlug(String productSlug) { this.productSlug = productSlug; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getFinish() { return finish; }
    public void setFinish(String finish) { this.finish = finish; }

    public BigDecimal getWidth() { return width; }
    public void setWidth(BigDecimal width) { this.width = width; }

    public BigDecimal getHeight() { return height; }
    public void setHeight(BigDecimal height) { this.height = height; }

    public BigDecimal getDepth() { return depth; }
    public void setDepth(BigDecimal depth) { this.depth = depth; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

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

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

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

    public List<String> getSitePhotos() { return sitePhotos; }
    public void setSitePhotos(List<String> sitePhotos) { this.sitePhotos = sitePhotos; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }

    public List<OrderTracking> getTrackingHistory() { return trackingHistory; }
    public void setTrackingHistory(List<OrderTracking> trackingHistory) { this.trackingHistory = trackingHistory; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}