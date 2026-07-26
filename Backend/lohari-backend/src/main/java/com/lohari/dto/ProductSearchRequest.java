package com.lohari.dto;

import java.math.BigDecimal;

public class ProductSearchRequest {

    private Long categoryId;
    private Long materialId;
    private Long finishId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean customizable;
    private Boolean inStock;
    private String keyword;

    // ========== GETTERS AND SETTERS ==========

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getMaterialId() { return materialId; }
    public void setMaterialId(Long materialId) { this.materialId = materialId; }

    public Long getFinishId() { return finishId; }
    public void setFinishId(Long finishId) { this.finishId = finishId; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public Boolean getCustomizable() { return customizable; }
    public void setCustomizable(Boolean customizable) { this.customizable = customizable; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }
}