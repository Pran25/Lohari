package com.lohari.service;


import org.springframework.data.domain.Pageable;

import com.lohari.dto.PaginatedResponse;
import com.lohari.dto.ProductCreateRequest;
import com.lohari.dto.ProductResponse;
import com.lohari.dto.ProductSearchRequest;
import com.lohari.dto.ProductUpdateRequest;

import java.util.List;
import java.util.Map;

public interface ProductService {

    // ========== CRUD ==========
    ProductResponse createProduct(ProductCreateRequest request);
    ProductResponse updateProduct(Long id, ProductUpdateRequest request);
    void deleteProduct(Long id);
    ProductResponse getProductById(Long id);
    ProductResponse getProductBySlug(String slug);
    List<ProductResponse> getAllProducts();

    // ========== PAGINATED ==========
    PaginatedResponse<ProductResponse> getPaginatedProducts(Pageable pageable);
    PaginatedResponse<ProductResponse> searchProducts(ProductSearchRequest request, Pageable pageable);

    // ========== FILTERS ==========
    List<ProductResponse> getProductsByCategory(Long categoryId);
    PaginatedResponse<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);
    List<ProductResponse> getFeaturedProducts();
    List<ProductResponse> getTrendingProducts();
    List<ProductResponse> getTopRatedProducts();
    List<ProductResponse> getNewestProducts();
    List<ProductResponse> getCustomizableProducts();

    // ========== SEARCH ==========
    List<ProductResponse> searchProducts(String keyword);
    PaginatedResponse<ProductResponse> searchProducts(String keyword, Pageable pageable);

    // ========== RELATED ==========
    List<ProductResponse> getRelatedProducts(Long productId, int limit);

    // ========== STATISTICS ==========
    Map<String, Object> getProductStatistics();

    // ========== BULK ==========
    void bulkUpdateStatus(List<Long> ids, boolean active);
    void bulkUpdateFeatured(List<Long> ids, boolean featured);

    // ========== HELPERS ==========
    boolean existsById(Long id);
    void incrementViewCount(Long id);
}