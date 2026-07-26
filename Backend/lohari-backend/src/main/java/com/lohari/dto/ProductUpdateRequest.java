package com.lohari.dto;

import java.math.BigDecimal;

public class ProductUpdateRequest {

    private String name;
    private String slug;
    private String shortDescription;
    private String longDescription;
    private BigDecimal basePrice;

    // Dimensions
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

    // Images
    private String thumbnailUrl;
    private String mainImageUrl;
    private String videoUrl;
    private String cadDrawingUrl;
    private String sketchUrl;

    // Relationships
    private Long categoryId;
    private Long defaultMaterialId;
    private Long defaultFinishId;

    // ========== GETTERS AND SETTERS ==========

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

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getDefaultMaterialId() { return defaultMaterialId; }
    public void setDefaultMaterialId(Long defaultMaterialId) { this.defaultMaterialId = defaultMaterialId; }

    public Long getDefaultFinishId() { return defaultFinishId; }
    public void setDefaultFinishId(Long defaultFinishId) { this.defaultFinishId = defaultFinishId; }
}