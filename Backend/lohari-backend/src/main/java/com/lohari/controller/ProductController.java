package com.lohari.controller;


import com.lohari.dto.PaginatedResponse;
import com.lohari.dto.ProductCreateRequest;
import com.lohari.dto.ProductResponse;
import com.lohari.dto.ProductSearchRequest;
import com.lohari.dto.ProductUpdateRequest;
import com.lohari.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ProductController {

    @Autowired
    private ProductService productService;

    // ============================================================
    // CREATE
    // ============================================================

    @PostMapping("/admin")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @PutMapping("/admin/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // DELETE
    // ============================================================

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // BULK OPERATIONS
    // ============================================================

    @PatchMapping("/admin/bulk/status")
    public ResponseEntity<Void> bulkUpdateStatus(
            @RequestParam List<Long> ids,
            @RequestParam boolean active) {
        productService.bulkUpdateStatus(ids, active);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/admin/bulk/featured")
    public ResponseEntity<Void> bulkUpdateFeatured(
            @RequestParam List<Long> ids,
            @RequestParam boolean featured) {
        productService.bulkUpdateFeatured(ids, featured);
        return ResponseEntity.ok().build();
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        productService.incrementViewCount(id);
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductResponse> getProductBySlug(@PathVariable String slug) {
        ProductResponse response = productService.getProductBySlug(slug);
        productService.incrementViewCount(response.getId());
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET ALL (with pagination)
    // ============================================================

    @GetMapping
    public ResponseEntity<PaginatedResponse<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        PaginatedResponse<ProductResponse> response = productService.getPaginatedProducts(pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // FILTER + SEARCH (Advanced)
    // ============================================================

    @PostMapping("/search")
    public ResponseEntity<PaginatedResponse<ProductResponse>> searchProducts(
            @RequestBody ProductSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        PaginatedResponse<ProductResponse> response = productService.searchProducts(request, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<PaginatedResponse<ProductResponse>> searchProductsByKeyword(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PaginatedResponse<ProductResponse> response = productService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // CATEGORY FILTER
    // ============================================================

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<PaginatedResponse<ProductResponse>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PaginatedResponse<ProductResponse> response = productService.getProductsByCategory(categoryId, pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // SPECIAL LISTS
    // ============================================================

    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponse>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<ProductResponse>> getTrendingProducts() {
        return ResponseEntity.ok(productService.getTrendingProducts());
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<ProductResponse>> getTopRatedProducts() {
        return ResponseEntity.ok(productService.getTopRatedProducts());
    }

    @GetMapping("/newest")
    public ResponseEntity<List<ProductResponse>> getNewestProducts() {
        return ResponseEntity.ok(productService.getNewestProducts());
    }

    @GetMapping("/customizable")
    public ResponseEntity<List<ProductResponse>> getCustomizableProducts() {
        return ResponseEntity.ok(productService.getCustomizableProducts());
    }

    // ============================================================
    // RELATED PRODUCTS
    // ============================================================

    @GetMapping("/{id}/related")
    public ResponseEntity<List<ProductResponse>> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(productService.getRelatedProducts(id, limit));
    }

    // ============================================================
    // STATISTICS
    // ============================================================

    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getProductStatistics() {
        return ResponseEntity.ok(productService.getProductStatistics());
    }

    // ============================================================
    // HEALTH
    // ============================================================

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Products Service is running!");
    }
}