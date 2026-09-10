package com.lohari.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sku", unique = true, nullable = false, length = 100)
    private String sku;

    @Column(name = "variant_name", length = 255)
    private String variantName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finish_id")
    private Finish finish;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "width", precision = 10, scale = 2)
    private BigDecimal width;

    @Column(name = "height", precision = 10, scale = 2)
    private BigDecimal height;

    @Column(name = "depth", precision = 10, scale = 2)
    private BigDecimal depth;

    @Column(name = "weight_kg", precision = 10, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "is_in_stock")
    private Boolean isInStock = true;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // ========== GETTERS AND SETTERS ==========

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getVariantName() { return variantName; }
    public void setVariantName(String variantName) { this.variantName = variantName; }

    public Material getMaterial() { return material; }
    public void setMaterial(Material material) { this.material = material; }

    public Finish getFinish() { return finish; }
    public void setFinish(Finish finish) { this.finish = finish; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getWidth() { return width; }
    public void setWidth(BigDecimal width) { this.width = width; }

    public BigDecimal getHeight() { return height; }
    public void setHeight(BigDecimal height) { this.height = height; }

    public BigDecimal getDepth() { return depth; }
    public void setDepth(BigDecimal depth) { this.depth = depth; }

    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Boolean getIsInStock() { return isInStock; }
    public void setIsInStock(Boolean isInStock) { this.isInStock = isInStock; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}