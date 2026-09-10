package com.lohari.service.impl;


import com.lohari.dto.PaginatedResponse;
import com.lohari.dto.ProductCreateRequest;
import com.lohari.dto.ProductResponse;
import com.lohari.dto.ProductSearchRequest;
import com.lohari.dto.ProductUpdateRequest;
import com.lohari.model.*;
import com.lohari.repository.*;
import com.lohari.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private FinishRepository finishRepository;

    // ============================================================
    // CREATE
    // ============================================================

    @Override
    public ProductResponse createProduct(ProductCreateRequest request) {
        log.info("Creating new product: {}", request.getName());

        // Check slug uniqueness
        if (productRepository.existsBySlug(request.getSlug())) {
            throw new RuntimeException("Product with slug '" + request.getSlug() + "' already exists!");
        }

        // Fetch relationships
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + request.getCategoryId()));

        Material material = null;
        if (request.getDefaultMaterialId() != null) {
            material = materialRepository.findById(request.getDefaultMaterialId())
                    .orElseThrow(() -> new EntityNotFoundException("Material not found: " + request.getDefaultMaterialId()));
        }

        Finish finish = null;
        if (request.getDefaultFinishId() != null) {
            finish = finishRepository.findById(request.getDefaultFinishId())
                    .orElseThrow(() -> new EntityNotFoundException("Finish not found: " + request.getDefaultFinishId()));
        }

        // Build product
        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setShortDescription(request.getShortDescription());
        product.setLongDescription(request.getLongDescription());
        product.setBasePrice(request.getBasePrice());
        product.setMinWidth(request.getMinWidth());
        product.setMaxWidth(request.getMaxWidth());
        product.setMinHeight(request.getMinHeight());
        product.setMaxHeight(request.getMaxHeight());
        product.setMinDepth(request.getMinDepth());
        product.setMaxDepth(request.getMaxDepth());
        product.setDefaultWidth(request.getDefaultWidth());
        product.setDefaultHeight(request.getDefaultHeight());
        product.setDefaultDepth(request.getDefaultDepth());
        product.setUnit(request.getUnit());
        product.setIsCustomSizeAvailable(request.getIsCustomSizeAvailable());
        product.setWeightKg(request.getWeightKg());
        product.setIsWeightCalculated(request.getIsWeightCalculated());
        product.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        product.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        product.setIsNew(request.getIsNew() != null ? request.getIsNew() : false);
        product.setIsBestSeller(request.getIsBestSeller() != null ? request.getIsBestSeller() : false);
        product.setIsCustomizable(request.getIsCustomizable() != null ? request.getIsCustomizable() : true);
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        product.setIsInStock(request.getIsInStock() != null ? request.getIsInStock() : true);
        product.setIsMadeToOrder(request.getIsMadeToOrder() != null ? request.getIsMadeToOrder() : true);
        product.setLeadTimeDays(request.getLeadTimeDays() != null ? request.getLeadTimeDays() : 15);
        product.setThumbnailUrl(request.getThumbnailUrl());
        product.setMainImageUrl(request.getMainImageUrl());
        product.setVideoUrl(request.getVideoUrl());
        product.setCadDrawingUrl(request.getCadDrawingUrl());
        product.setSketchUrl(request.getSketchUrl());
        product.setCategory(category);
        product.setDefaultMaterial(material);
        product.setDefaultFinish(finish);

        Product saved = productRepository.save(product);
        log.info("Product created with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Override
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        log.info("Updating product with id: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));

        // Update fields
        if (request.getName() != null) product.setName(request.getName());
        if (request.getSlug() != null) {
            if (!product.getSlug().equals(request.getSlug()) && productRepository.existsBySlug(request.getSlug())) {
                throw new RuntimeException("Product with slug '" + request.getSlug() + "' already exists!");
            }
            product.setSlug(request.getSlug());
        }
        if (request.getShortDescription() != null) product.setShortDescription(request.getShortDescription());
        if (request.getLongDescription() != null) product.setLongDescription(request.getLongDescription());
        if (request.getBasePrice() != null) product.setBasePrice(request.getBasePrice());
        if (request.getMinWidth() != null) product.setMinWidth(request.getMinWidth());
        if (request.getMaxWidth() != null) product.setMaxWidth(request.getMaxWidth());
        if (request.getMinHeight() != null) product.setMinHeight(request.getMinHeight());
        if (request.getMaxHeight() != null) product.setMaxHeight(request.getMaxHeight());
        if (request.getMinDepth() != null) product.setMinDepth(request.getMinDepth());
        if (request.getMaxDepth() != null) product.setMaxDepth(request.getMaxDepth());
        if (request.getDefaultWidth() != null) product.setDefaultWidth(request.getDefaultWidth());
        if (request.getDefaultHeight() != null) product.setDefaultHeight(request.getDefaultHeight());
        if (request.getDefaultDepth() != null) product.setDefaultDepth(request.getDefaultDepth());
        if (request.getUnit() != null) product.setUnit(request.getUnit());
        if (request.getIsCustomSizeAvailable() != null) product.setIsCustomSizeAvailable(request.getIsCustomSizeAvailable());
        if (request.getWeightKg() != null) product.setWeightKg(request.getWeightKg());
        if (request.getIsWeightCalculated() != null) product.setIsWeightCalculated(request.getIsWeightCalculated());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());
        if (request.getIsFeatured() != null) product.setIsFeatured(request.getIsFeatured());
        if (request.getIsNew() != null) product.setIsNew(request.getIsNew());
        if (request.getIsBestSeller() != null) product.setIsBestSeller(request.getIsBestSeller());
        if (request.getIsCustomizable() != null) product.setIsCustomizable(request.getIsCustomizable());
        if (request.getStockQuantity() != null) product.setStockQuantity(request.getStockQuantity());
        if (request.getIsInStock() != null) product.setIsInStock(request.getIsInStock());
        if (request.getIsMadeToOrder() != null) product.setIsMadeToOrder(request.getIsMadeToOrder());
        if (request.getLeadTimeDays() != null) product.setLeadTimeDays(request.getLeadTimeDays());
        if (request.getThumbnailUrl() != null) product.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getMainImageUrl() != null) product.setMainImageUrl(request.getMainImageUrl());
        if (request.getVideoUrl() != null) product.setVideoUrl(request.getVideoUrl());
        if (request.getCadDrawingUrl() != null) product.setCadDrawingUrl(request.getCadDrawingUrl());
        if (request.getSketchUrl() != null) product.setSketchUrl(request.getSketchUrl());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found: " + request.getCategoryId()));
            product.setCategory(category);
        }

        if (request.getDefaultMaterialId() != null) {
            Material material = materialRepository.findById(request.getDefaultMaterialId())
                    .orElseThrow(() -> new EntityNotFoundException("Material not found: " + request.getDefaultMaterialId()));
            product.setDefaultMaterial(material);
        }

        if (request.getDefaultFinishId() != null) {
            Finish finish = finishRepository.findById(request.getDefaultFinishId())
                    .orElseThrow(() -> new EntityNotFoundException("Finish not found: " + request.getDefaultFinishId()));
            product.setDefaultFinish(finish);
        }

        Product updated = productRepository.save(product);
        log.info("Product updated with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    // ============================================================
    // DELETE
    // ============================================================

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found: " + id);
        }
        log.info("Deleting product with id: {}", id);
        productRepository.deleteById(id);
    }

    // ============================================================
    // READ SINGLE
    // ============================================================

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
        return mapToResponse(product);
    }

    @Override
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with slug: " + slug));
        return mapToResponse(product);
    }

    // ============================================================
    // READ ALL
    // ============================================================

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // PAGINATED
    // ============================================================

    @Override
    public PaginatedResponse<ProductResponse> getPaginatedProducts(Pageable pageable) {
        Page<Product> page = productRepository.findByIsActiveTrue(pageable);
        return mapToPaginatedResponse(page);
    }

    @Override
    public PaginatedResponse<ProductResponse> searchProducts(ProductSearchRequest request, Pageable pageable) {
        Page<Product> page = productRepository.filterProducts(
                request.getCategoryId(),
                request.getMaterialId(),
                request.getFinishId(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getCustomizable(),
                request.getInStock(),
                pageable
        );
        return mapToPaginatedResponse(page);
    }

    // ============================================================
    // FILTERS
    // ============================================================

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PaginatedResponse<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> page = productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
        return mapToPaginatedResponse(page);
    }

    @Override
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getTrendingProducts() {
        return productRepository.findByIsActiveTrueOrderByOrderCountDesc().stream()
                .limit(10)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getTopRatedProducts() {
        return productRepository.findByIsActiveTrueOrderByAverageRatingDesc().stream()
                .limit(10)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getNewestProducts() {
        return productRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .limit(10)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getCustomizableProducts() {
        return productRepository.findByIsCustomizableTrueAndIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // SEARCH
    // ============================================================

    @Override
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.searchByName(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PaginatedResponse<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        Page<Product> page = productRepository.searchProducts(keyword, pageable);
        return mapToPaginatedResponse(page);
    }

    // ============================================================
    // RELATED
    // ============================================================

    @Override
    public List<ProductResponse> getRelatedProducts(Long productId, int limit) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));

        return productRepository.findRelatedProducts(productId, product.getCategory().getId(), Pageable.ofSize(limit))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // STATISTICS
    // ============================================================

    @Override
    public Map<String, Object> getProductStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productRepository.count());
        stats.put("activeProducts", productRepository.countActiveProducts());
        stats.put("totalViews", productRepository.sumTotalViews());
        stats.put("averageRating", productRepository.averageOverallRating());
        stats.put("categories", productRepository.countAllProductsByCategory());
        return stats;
    }

    // ============================================================
    // BULK OPERATIONS
    // ============================================================

    @Override
    public void bulkUpdateStatus(List<Long> ids, boolean active) {
        productRepository.bulkUpdateStatus(ids, active);
    }

    @Override
    public void bulkUpdateFeatured(List<Long> ids, boolean featured) {
        productRepository.bulkUpdateFeatured(ids, featured);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    @Override
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    @Override
    public void incrementViewCount(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
        product.incrementViewCount();
        productRepository.save(product);
    }

    // ============================================================
    // RESPONSE MAPPERS
    // ============================================================

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setSlug(product.getSlug());
        response.setShortDescription(product.getShortDescription());
        response.setLongDescription(product.getLongDescription());
        response.setBasePrice(product.getBasePrice());

        // Dimensions
        ProductResponse.Dimensions dimensions = new ProductResponse.Dimensions();
        dimensions.setMinWidth(product.getMinWidth());
        dimensions.setMaxWidth(product.getMaxWidth());
        dimensions.setMinHeight(product.getMinHeight());
        dimensions.setMaxHeight(product.getMaxHeight());
        dimensions.setMinDepth(product.getMinDepth());
        dimensions.setMaxDepth(product.getMaxDepth());
        dimensions.setDefaultWidth(product.getDefaultWidth());
        dimensions.setDefaultHeight(product.getDefaultHeight());
        dimensions.setDefaultDepth(product.getDefaultDepth());
        dimensions.setUnit(product.getUnit());
        response.setDimensions(dimensions);

        response.setIsCustomSizeAvailable(product.getIsCustomSizeAvailable());
        response.setWeightKg(product.getWeightKg());
        response.setIsWeightCalculated(product.getIsWeightCalculated());
        response.setIsActive(product.getIsActive());
        response.setIsFeatured(product.getIsFeatured());
        response.setIsNew(product.getIsNew());
        response.setIsBestSeller(product.getIsBestSeller());
        response.setIsCustomizable(product.getIsCustomizable());
        response.setStockQuantity(product.getStockQuantity());
        response.setIsInStock(product.getIsInStock());
        response.setIsMadeToOrder(product.getIsMadeToOrder());
        response.setLeadTimeDays(product.getLeadTimeDays());

        response.setViewCount(product.getViewCount());
        response.setOrderCount(product.getOrderCount());
        response.setAverageRating(product.getAverageRating());
        response.setTotalRatings(product.getTotalRatings());

        response.setThumbnailUrl(product.getThumbnailUrl());
        response.setMainImageUrl(product.getMainImageUrl());
        response.setVideoUrl(product.getVideoUrl());
        response.setCadDrawingUrl(product.getCadDrawingUrl());
        response.setSketchUrl(product.getSketchUrl());

        if (product.getCategory() != null) {
            ProductResponse.CategoryInfo category = new ProductResponse.CategoryInfo();
            category.setId(product.getCategory().getId());
            category.setName(product.getCategory().getName());
            category.setSlug(product.getCategory().getSlug());
            response.setCategory(category);
        }

        if (product.getDefaultMaterial() != null) {
            ProductResponse.MaterialInfo material = new ProductResponse.MaterialInfo();
            material.setId(product.getDefaultMaterial().getId());
            material.setName(product.getDefaultMaterial().getName());
            material.setCode(product.getDefaultMaterial().getCode());
            response.setDefaultMaterial(material);
        }

        if (product.getDefaultFinish() != null) {
            ProductResponse.FinishInfo finish = new ProductResponse.FinishInfo();
            finish.setId(product.getDefaultFinish().getId());
            finish.setName(product.getDefaultFinish().getName());
            finish.setCode(product.getDefaultFinish().getCode());
            response.setDefaultFinish(finish);
        }

        response.setImages(product.getImages().stream()
                .map(img -> {
                    ProductResponse.ImageInfo image = new ProductResponse.ImageInfo();
                    image.setId(img.getId());
                    image.setImageUrl(img.getImageUrl());
                    image.setAltText(img.getAltText());
                    image.setIsPrimary(img.getIsPrimary());
                    image.setImageType(img.getImageType());
                    return image;
                })
                .collect(Collectors.toList()));

        response.setVariants(product.getVariants().stream()
                .map(variant -> {
                    ProductResponse.VariantInfo v = new ProductResponse.VariantInfo();
                    v.setId(variant.getId());
                    v.setSku(variant.getSku());
                    v.setVariantName(variant.getVariantName());
                    v.setPrice(variant.getPrice());
                    v.setWidth(variant.getWidth());
                    v.setHeight(variant.getHeight());
                    v.setDepth(variant.getDepth());
                    v.setStockQuantity(variant.getStockQuantity());
                    v.setIsInStock(variant.getIsInStock());
                    v.setImageUrl(variant.getImageUrl());
                    return v;
                })
                .collect(Collectors.toList()));

        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        return response;
    }

    private PaginatedResponse<ProductResponse> mapToPaginatedResponse(Page<Product> page) {
        PaginatedResponse<ProductResponse> response = new PaginatedResponse<>();
        response.setContent(page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());
        response.setFirst(page.isFirst());
        return response;
    }
}