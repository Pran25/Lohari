package com.lohari.repository;

import com.lohari.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // ✅ Get approved reviews for a product
    List<Review> findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(Long productId);

    // ✅ Get all reviews for a product (including pending)
    List<Review> findByProductId(Long productId);

    // ✅ Get reviews by user
    List<Review> findByUserId(Long userId);

    // ✅ Get pending reviews (for admin)
    List<Review> findByIsApprovedFalse();

    // ✅ Check if user already reviewed a product
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    // ✅ Get average rating for a product
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.isApproved = true")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    // ✅ Get total reviews count for a product
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.isApproved = true")
    Long countApprovedReviewsByProductId(@Param("productId") Long productId);

    // ✅ Get rating distribution
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.isApproved = true GROUP BY r.rating")
    List<Object[]> getRatingDistribution(@Param("productId") Long productId);

    // ✅ Admin - get all reviews with pagination
    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // ✅ Admin - get pending reviews
    Page<Review> findByIsApprovedFalseOrderByCreatedAtDesc(Pageable pageable);
}