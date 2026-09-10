package com.lohari.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "custom_configurations")
public class CustomConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", length = 255)
    private String productName;

    @Column(name = "configuration_data", columnDefinition = "TEXT")  
    private String configurationData;
    
    @Column(name = "price_estimate")
    private Double priceEstimate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getConfigurationData() { return configurationData; }
    public void setConfigurationData(String configurationData) { this.configurationData = configurationData; }

    public Double getPriceEstimate() { return priceEstimate; }
    public void setPriceEstimate(Double priceEstimate) { this.priceEstimate = priceEstimate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}