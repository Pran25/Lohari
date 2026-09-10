package com.lohari.controller;

import com.lohari.model.Review;
import com.lohari.model.User;
import com.lohari.repository.ReviewRepository;
import com.lohari.repository.UserRepository;
import com.lohari.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // ✅ Submit Review (Customer)
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitReview(@RequestBody Map<String, Object> request) {
        try {
            // Get current user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Long productId = Long.valueOf(request.get("productId").toString());
            Integer rating = Integer.valueOf(request.get("rating").toString());
            String title = (String) request.get("title");
            String comment = (String) request.get("comment");

            // Check if user already reviewed this product
            if (reviewRepository.existsByUserIdAndProductId(user.getId(), productId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "You have already reviewed this product"));
            }

            // Create review
            Review review = new Review();
            review.setProduct(productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found")));
            review.setUser(user);
            review.setRating(rating);
            review.setTitle(title);
            review.setComment(comment);
            review.setIsVerifiedPurchase(false); // Will be verified if user has purchased
            review.setIsApproved(false); // Admin approval required
            review.setCreatedAt(LocalDateTime.now());

            Review saved = reviewRepository.save(review);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Review submitted successfully! Waiting for admin approval.");
            response.put("reviewId", saved.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Get Reviews for Product (Public)
    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getProductReviews(@PathVariable Long productId) {
        try {
            List<Review> reviews = reviewRepository.findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(productId);
            Double averageRating = reviewRepository.getAverageRatingByProductId(productId);
            Long totalReviews = reviewRepository.countApprovedReviewsByProductId(productId);
            List<Object[]> distribution = reviewRepository.getRatingDistribution(productId);

            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviews);
            response.put("averageRating", averageRating != null ? averageRating : 0.0);
            response.put("totalReviews", totalReviews != null ? totalReviews : 0);
            response.put("distribution", distribution);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Get User Reviews
    @GetMapping("/my-reviews")
    public ResponseEntity<List<Review>> getMyReviews() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(reviewRepository.findByUserId(user.getId()));
    }

    // ✅ Admin - Get All Reviews
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Review>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reviewRepository.findAllByOrderByCreatedAtDesc(pageable));
    }

    // ✅ Admin - Get Pending Reviews
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Review>> getPendingReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reviewRepository.findByIsApprovedFalseOrderByCreatedAtDesc(pageable));
    }

    // ✅ Admin - Approve Review
    @PatchMapping("/admin/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> approveReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setIsApproved(true);
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);

        return ResponseEntity.ok(Map.of("success", true, "message", "Review approved successfully"));
    }

    // ✅ Admin - Delete Review
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Review deleted successfully"));
    }
}