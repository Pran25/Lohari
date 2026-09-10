package com.lohari.repository;

import com.lohari.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // ========== BASIC ==========
    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);

    // ========== ACTIVE PRODUCTS ==========
    List<Product> findByIsActiveTrue();
    Page<Product> findByIsActiveTrue(Pageable pageable);

    // ========== FEATURED ==========
    List<Product> findByIsFeaturedTrueAndIsActiveTrue();

    // ========== CATEGORY ==========
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    Page<Product> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);

    // ========== PRICE RANGE ==========
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.basePrice BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);

    // ========== SEARCH ==========
    @Query("""
        SELECT p FROM Product p
        WHERE p.isActive = true
        AND (
            LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.longDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
    """)
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE p.isActive = true
        AND LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<Product> searchByName(@Param("keyword") String keyword);

    // ========== ADVANCED FILTER ==========
    @Query("""
        SELECT p FROM Product p
        WHERE p.isActive = true
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:materialId IS NULL OR p.defaultMaterial.id = :materialId)
        AND (:finishId IS NULL OR p.defaultFinish.id = :finishId)
        AND (:minPrice IS NULL OR p.basePrice >= :minPrice)
        AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice)
        AND (:customizable IS NULL OR p.isCustomizable = :customizable)
        AND (:inStock IS NULL OR p.isInStock = :inStock)
    """)
    Page<Product> filterProducts(
        @Param("categoryId") Long categoryId,
        @Param("materialId") Long materialId,
        @Param("finishId") Long finishId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("customizable") Boolean customizable,
        @Param("inStock") Boolean inStock,
        Pageable pageable
    );

    // ========== RELATED PRODUCTS ==========
    @Query("""
        SELECT p FROM Product p
        WHERE p.isActive = true
        AND p.id != :productId
        AND p.category.id = :categoryId
    """)
    List<Product> findRelatedProducts(@Param("productId") Long productId, @Param("categoryId") Long categoryId, Pageable pageable);

    // ========== CATEGORY COUNTS ==========
    @Query("SELECT p.category.id, COUNT(p) FROM Product p WHERE p.isActive = true GROUP BY p.category.id")
    List<Object[]> countProductsByCategory();

    @Query("SELECT p.category.id, COUNT(p) FROM Product p GROUP BY p.category.id")
    List<Object[]> countAllProductsByCategory();

    // ========== SORTING ==========
    List<Product> findByIsActiveTrueOrderByViewCountDesc();
    List<Product> findByIsActiveTrueOrderByOrderCountDesc();
    List<Product> findByIsActiveTrueOrderByAverageRatingDesc();
    List<Product> findByIsActiveTrueOrderByCreatedAtDesc();

    Page<Product> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    Page<Product> findByIsActiveTrueOrderByOrderCountDesc(Pageable pageable);
    Page<Product> findByIsActiveTrueOrderByAverageRatingDesc(Pageable pageable);

    // ========== STATISTICS ==========
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isActive = true")
    long countActiveProducts();

    @Query("SELECT SUM(p.viewCount) FROM Product p WHERE p.isActive = true")
    Long sumTotalViews();

    @Query("SELECT AVG(p.averageRating) FROM Product p WHERE p.isActive = true AND p.totalRatings > 0")
    Double averageOverallRating();

    // ========== BULK ==========
    @Query("UPDATE Product p SET p.isActive = :active WHERE p.id IN :ids")
    void bulkUpdateStatus(@Param("ids") List<Long> ids, @Param("active") boolean active);

    @Query("UPDATE Product p SET p.isFeatured = :featured WHERE p.id IN :ids")
    void bulkUpdateFeatured(@Param("ids") List<Long> ids, @Param("featured") boolean featured);

    // ========== CUSTOMIZABLE ==========
    List<Product> findByIsCustomizableTrueAndIsActiveTrue();
}