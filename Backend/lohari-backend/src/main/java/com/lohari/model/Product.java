package com.lohari.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(unique = true, nullable = false, length = 255)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String longDescription;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    // ========== DIMENSIONS ==========

    @Column(name = "min_width", precision = 10, scale = 2)
    private BigDecimal minWidth;

    @Column(name = "max_width", precision = 10, scale = 2)
    private BigDecimal maxWidth;

    @Column(name = "min_height", precision = 10, scale = 2)
    private BigDecimal minHeight;

    @Column(name = "max_height", precision = 10, scale = 2)
    private BigDecimal maxHeight;

    @Column(name = "min_depth", precision = 10, scale = 2)
    private BigDecimal minDepth;

    @Column(name = "max_depth", precision = 10, scale = 2)
    private BigDecimal maxDepth;

    @Column(name = "default_width", precision = 10, scale = 2)
    private BigDecimal defaultWidth;

    @Column(name = "default_height", precision = 10, scale = 2)
    private BigDecimal defaultHeight;

    @Column(name = "default_depth", precision = 10, scale = 2)
    private BigDecimal defaultDepth;

    @Column(name = "unit", length = 10)
    private String unit = "ft";

    @Column(name = "is_custom_size_available")
    private Boolean isCustomSizeAvailable = true;

    // ========== WEIGHT ==========

    @Column(name = "weight_kg", precision = 10, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "is_weight_calculated")
    private Boolean isWeightCalculated = false;

    // ========== STATUS ==========

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_new")
    private Boolean isNew = false;

    @Column(name = "is_best_seller")
    private Boolean isBestSeller = false;

    @Column(name = "is_customizable")
    private Boolean isCustomizable = true;

    // ========== STOCK ==========

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "is_in_stock")
    private Boolean isInStock = true;

    @Column(name = "is_made_to_order")
    private Boolean isMadeToOrder = true;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays = 15;

    // ========== STATISTICS ==========

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "order_count")
    private Integer orderCount = 0;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "total_ratings")
    private Integer totalRatings = 0;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    // ========== IMAGES ==========

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "main_image_url", length = 500)
    private String mainImageUrl;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "cad_drawing_url", length = 500)
    private String cadDrawingUrl;

    @Column(name = "sketch_url", length = 500)
    private String sketchUrl;

    // ========== RELATIONSHIPS ==========

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_material_id")
    private Material defaultMaterial;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_finish_id")
    private Finish defaultFinish;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductVariant> variants = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductReview> reviews = new ArrayList<>();

    // ========== TIMESTAMPS ==========

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ========== GETTERS AND SETTERS ==========

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getLongDescription() { return longDescription; }
    public void setLongDescription(String longDescription) { this.longDescription = longDescription; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public BigDecimal getMinWidth() { return minWidth; }
    public void setMinWidth(BigDecimal minWidth) { this.minWidth = minWidth; }

    public BigDecimal getMaxWidth() { return maxWidth; }
    public void setMaxWidth(BigDecimal maxWidth) { this.maxWidth = maxWidth; }

    public BigDecimal getMinHeight() { return minHeight; }
    public void setMinHeight(BigDecimal minHeight) { this.minHeight = minHeight; }

    public BigDecimal getMaxHeight() { return maxHeight; }
    public void setMaxHeight(BigDecimal maxHeight) { this.maxHeight = maxHeight; }

    public BigDecimal getMinDepth() { return minDepth; }
    public void setMinDepth(BigDecimal minDepth) { this.minDepth = minDepth; }

    public BigDecimal getMaxDepth() { return maxDepth; }
    public void setMaxDepth(BigDecimal maxDepth) { this.maxDepth = maxDepth; }

    public BigDecimal getDefaultWidth() { return defaultWidth; }
    public void setDefaultWidth(BigDecimal defaultWidth) { this.defaultWidth = defaultWidth; }

    public BigDecimal getDefaultHeight() { return defaultHeight; }
    public void setDefaultHeight(BigDecimal defaultHeight) { this.defaultHeight = defaultHeight; }

    public BigDecimal getDefaultDepth() { return defaultDepth; }
    public void setDefaultDepth(BigDecimal defaultDepth) { this.defaultDepth = defaultDepth; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Boolean getIsCustomSizeAvailable() { return isCustomSizeAvailable; }
    public void setIsCustomSizeAvailable(Boolean isCustomSizeAvailable) { this.isCustomSizeAvailable = isCustomSizeAvailable; }

    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }

    public Boolean getIsWeightCalculated() { return isWeightCalculated; }
    public void setIsWeightCalculated(Boolean isWeightCalculated) { this.isWeightCalculated = isWeightCalculated; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsNew() { return isNew; }
    public void setIsNew(Boolean isNew) { this.isNew = isNew; }

    public Boolean getIsBestSeller() { return isBestSeller; }
    public void setIsBestSeller(Boolean isBestSeller) { this.isBestSeller = isBestSeller; }

    public Boolean getIsCustomizable() { return isCustomizable; }
    public void setIsCustomizable(Boolean isCustomizable) { this.isCustomizable = isCustomizable; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Boolean getIsInStock() { return isInStock; }
    public void setIsInStock(Boolean isInStock) { this.isInStock = isInStock; }

    public Boolean getIsMadeToOrder() { return isMadeToOrder; }
    public void setIsMadeToOrder(Boolean isMadeToOrder) { this.isMadeToOrder = isMadeToOrder; }

    public Integer getLeadTimeDays() { return leadTimeDays; }
    public void setLeadTimeDays(Integer leadTimeDays) { this.leadTimeDays = leadTimeDays; }

    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }

    public Integer getOrderCount() { return orderCount; }
    public void setOrderCount(Integer orderCount) { this.orderCount = orderCount; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getTotalRatings() { return totalRatings; }
    public void setTotalRatings(Integer totalRatings) { this.totalRatings = totalRatings; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getMainImageUrl() { return mainImageUrl; }
    public void setMainImageUrl(String mainImageUrl) { this.mainImageUrl = mainImageUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getCadDrawingUrl() { return cadDrawingUrl; }
    public void setCadDrawingUrl(String cadDrawingUrl) { this.cadDrawingUrl = cadDrawingUrl; }

    public String getSketchUrl() { return sketchUrl; }
    public void setSketchUrl(String sketchUrl) { this.sketchUrl = sketchUrl; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Material getDefaultMaterial() { return defaultMaterial; }
    public void setDefaultMaterial(Material defaultMaterial) { this.defaultMaterial = defaultMaterial; }

    public Finish getDefaultFinish() { return defaultFinish; }
    public void setDefaultFinish(Finish defaultFinish) { this.defaultFinish = defaultFinish; }

    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }

    public List<ProductVariant> getVariants() { return variants; }
    public void setVariants(List<ProductVariant> variants) { this.variants = variants; }

    public List<ProductReview> getReviews() { return reviews; }
    public void setReviews(List<ProductReview> reviews) { this.reviews = reviews; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // ========== HELPER METHODS ==========

    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }

    public void removeImage(ProductImage image) {
        images.remove(image);
        image.setProduct(null);
    }

    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }

    public void removeVariant(ProductVariant variant) {
        variants.remove(variant);
        variant.setProduct(null);
    }

    public void incrementViewCount() {
        this.viewCount = (this.viewCount == null ? 0 : this.viewCount) + 1;
    }

    public void incrementOrderCount() {
        this.orderCount = (this.orderCount == null ? 0 : this.orderCount) + 1;
    }

    public void updateRating(Double newRating) {
        int total = this.totalRatings == null ? 0 : this.totalRatings;
        double current = this.averageRating == null ? 0.0 : this.averageRating;
        this.averageRating = ((current * total) + newRating) / (total + 1);
        this.totalRatings = total + 1;
    }

    public boolean isAvailable() {
        return isActive && (isMadeToOrder || (stockQuantity != null && stockQuantity > 0));
    }
}