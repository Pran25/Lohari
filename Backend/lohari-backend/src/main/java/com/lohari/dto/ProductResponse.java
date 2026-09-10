package com.lohari.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductResponse {

    private Long id;
    private String name;
    private String slug;
    private String shortDescription;
    private String longDescription;
    private BigDecimal basePrice;

    // Dimensions
    private Dimensions dimensions;

    private Boolean isCustomSizeAvailable;
    private BigDecimal weightKg;
    private Boolean isWeightCalculated;

    // Status
    private Boolean isActive;
    private Boolean isFeatured;
    private Boolean isNew;
    private Boolean isBestSeller;
    private Boolean isCustomizable;

    // Stock
    private Integer stockQuantity;
    private Boolean isInStock;
    private Boolean isMadeToOrder;
    private Integer leadTimeDays;

    // Statistics
    private Integer viewCount;
    private Integer orderCount;
    private Double averageRating;
    private Integer totalRatings;

    // Images
    private String thumbnailUrl;
    private String mainImageUrl;
    private String videoUrl;
    private String cadDrawingUrl;
    private String sketchUrl;

    // Relationships
    private CategoryInfo category;
    private MaterialInfo defaultMaterial;
    private FinishInfo defaultFinish;

    private List<ImageInfo> images;
    private List<VariantInfo> variants;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ========== INNER CLASSES ==========

    public static class Dimensions {
        private BigDecimal minWidth;
        private BigDecimal maxWidth;
        private BigDecimal minHeight;
        private BigDecimal maxHeight;
        private BigDecimal minDepth;
        private BigDecimal maxDepth;
        private BigDecimal defaultWidth;
        private BigDecimal defaultHeight;
        private BigDecimal defaultDepth;
        private String unit;

        // Getters & Setters
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
    }

    public static class CategoryInfo {
        private Long id;
        private String name;
        private String slug;

        // Getters & Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
    }

    public static class MaterialInfo {
        private Long id;
        private String name;
        private String code;

        // Getters & Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    public static class FinishInfo {
        private Long id;
        private String name;
        private String code;

        // Getters & Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    public static class ImageInfo {
        private Long id;
        private String imageUrl;
        private String altText;
        private Boolean isPrimary;
        private String imageType;

        // Getters & Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getAltText() { return altText; }
        public void setAltText(String altText) { this.altText = altText; }

        public Boolean getIsPrimary() { return isPrimary; }
        public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

        public String getImageType() { return imageType; }
        public void setImageType(String imageType) { this.imageType = imageType; }
    }

    public static class VariantInfo {
        private Long id;
        private String sku;
        private String variantName;
        private BigDecimal price;
        private BigDecimal width;
        private BigDecimal height;
        private BigDecimal depth;
        private Integer stockQuantity;
        private Boolean isInStock;
        private String imageUrl;

        // Getters & Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }

        public String getVariantName() { return variantName; }
        public void setVariantName(String variantName) { this.variantName = variantName; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public BigDecimal getWidth() { return width; }
        public void setWidth(BigDecimal width) { this.width = width; }

        public BigDecimal getHeight() { return height; }
        public void setHeight(BigDecimal height) { this.height = height; }

        public BigDecimal getDepth() { return depth; }
        public void setDepth(BigDecimal depth) { this.depth = depth; }

        public Integer getStockQuantity() { return stockQuantity; }
        public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

        public Boolean getIsInStock() { return isInStock; }
        public void setIsInStock(Boolean isInStock) { this.isInStock = isInStock; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
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

    public Dimensions getDimensions() { return dimensions; }
    public void setDimensions(Dimensions dimensions) { this.dimensions = dimensions; }

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

    public CategoryInfo getCategory() { return category; }
    public void setCategory(CategoryInfo category) { this.category = category; }

    public MaterialInfo getDefaultMaterial() { return defaultMaterial; }
    public void setDefaultMaterial(MaterialInfo defaultMaterial) { this.defaultMaterial = defaultMaterial; }

    public FinishInfo getDefaultFinish() { return defaultFinish; }
    public void setDefaultFinish(FinishInfo defaultFinish) { this.defaultFinish = defaultFinish; }

    public List<ImageInfo> getImages() { return images; }
    public void setImages(List<ImageInfo> images) { this.images = images; }

    public List<VariantInfo> getVariants() { return variants; }
    public void setVariants(List<VariantInfo> variants) { this.variants = variants; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}