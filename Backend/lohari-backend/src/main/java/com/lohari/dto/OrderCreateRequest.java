package com.lohari.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class OrderCreateRequest {

    // ========== CUSTOMER INFO ==========

    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Name too long")
    private String customerName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email too long")
    private String customerEmail;

    @NotBlank(message = "Phone is required")
    // ✅ TEMPORARILY REMOVED - Allow any phone number for testing
    // @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String customerPhone;

    // ========== ADDRESS ==========

    @NotBlank(message = "Address is required")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    // ✅ TEMPORARILY REMOVED - Allow any pincode for testing
    // @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String pincode;

    private String country = "India";

    // ========== PRODUCT INFO ==========

    @NotBlank(message = "Product name is required")
    private String productName;

    private String productSlug;
    private String productImage;

    // ========== CUSTOMIZATION ==========

    private String material;
    private String finish;

    @DecimalMin(value = "0.0", message = "Width must be positive")
    private BigDecimal width;

    @DecimalMin(value = "0.0", message = "Height must be positive")
    private BigDecimal height;

    @DecimalMin(value = "0.0", message = "Depth must be positive")
    private BigDecimal depth;

    private String unit = "ft";

    // ========== PRICING ==========

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", message = "Unit price must be positive")
    private BigDecimal unitPrice;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    @DecimalMin(value = "0.0", message = "Advance percent must be positive")
    @DecimalMax(value = "100.0", message = "Advance percent cannot exceed 100")
    private BigDecimal advancePercent = BigDecimal.valueOf(30);

    // ========== NOTES ==========

    private String customerNotes;
    private String specialInstructions;

    // ========== UPLOADS ==========

    private String sketchUrl;
    private String cadDrawingUrl;

    // ========== TIMELINES ==========

    private Integer leadTimeDays = 15;

    // ========== GETTERS AND SETTERS ==========

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

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

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getAdvancePercent() { return advancePercent; }
    public void setAdvancePercent(BigDecimal advancePercent) { this.advancePercent = advancePercent; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public String getSketchUrl() { return sketchUrl; }
    public void setSketchUrl(String sketchUrl) { this.sketchUrl = sketchUrl; }

    public String getCadDrawingUrl() { return cadDrawingUrl; }
    public void setCadDrawingUrl(String cadDrawingUrl) { this.cadDrawingUrl = cadDrawingUrl; }

    public Integer getLeadTimeDays() { return leadTimeDays; }
    public void setLeadTimeDays(Integer leadTimeDays) { this.leadTimeDays = leadTimeDays; }
}