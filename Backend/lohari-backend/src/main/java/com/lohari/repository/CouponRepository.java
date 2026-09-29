package com.lohari.repository;

import com.lohari.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    // ============================================
    // FIND BY CODE (case-insensitive)
    // ============================================
    @Query("SELECT c FROM Coupon c WHERE UPPER(c.code) = UPPER(:code)")
    Optional<Coupon> findByCodeIgnoreCase(@Param("code") String code);

    // ============================================
    // CHECK IF CODE EXISTS
    // ============================================
    @Query("SELECT COUNT(c) > 0 FROM Coupon c WHERE UPPER(c.code) = UPPER(:code)")
    boolean existsByCodeIgnoreCase(@Param("code") String code);

    // ============================================
    // ADMIN — GET ALL (ordered by newest first)
    // ============================================
    @Query("SELECT c FROM Coupon c ORDER BY c.createdAt DESC")
    List<Coupon> findAllOrderByCreatedAtDesc();

    // ============================================
    // ADMIN — FILTER BY ACTIVE STATUS
    // ============================================
    List<Coupon> findByIsActiveTrue();

    List<Coupon> findByIsActiveFalse();

    // ============================================
    // PUBLIC COUPONS (for customers)
    // ============================================
    @Query("SELECT c FROM Coupon c WHERE c.isActive = true " +
           "AND c.isPublic = true " +
           "AND (c.validFrom IS NULL OR c.validFrom <= :now) " +
           "AND (c.validTo IS NULL OR c.validTo >= :now) " +
           "ORDER BY c.createdAt DESC")
    List<Coupon> findActivePublicCoupons(@Param("now") LocalDateTime now);

    // ============================================
    // PRIVATE COUPONS FOR A CUSTOMER
    // ============================================
    @Query("SELECT c FROM Coupon c WHERE c.isActive = true " +
           "AND c.customerEmail = :email " +
           "AND (c.validFrom IS NULL OR c.validFrom <= :now) " +
           "AND (c.validTo IS NULL OR c.validTo >= :now) " +
           "ORDER BY c.createdAt DESC")
    List<Coupon> findActiveCouponsForCustomer(@Param("email") String email,
                                              @Param("now") LocalDateTime now);

    // ============================================
    // ADMIN — FILTER BY TYPE
    // ============================================
    @Query("SELECT c FROM Coupon c WHERE c.type = :type ORDER BY c.createdAt DESC")
    List<Coupon> findByType(@Param("type") Coupon.CouponType type);

    // ============================================
    // ADMIN — GET EXPIRED COUPONS
    // ============================================
    @Query("SELECT c FROM Coupon c WHERE c.validTo IS NOT NULL AND c.validTo < :now ORDER BY c.validTo DESC")
    List<Coupon> findExpiredCoupons(@Param("now") LocalDateTime now);

    // ============================================
    // ADMIN — GET COUPONS EXPIRING SOON (next N days)
    // ============================================
    @Query("SELECT c FROM Coupon c WHERE c.isActive = true " +
           "AND c.validTo IS NOT NULL " +
           "AND c.validTo BETWEEN :now AND :futureDate " +
           "ORDER BY c.validTo ASC")
    List<Coupon> findCouponsExpiringSoon(@Param("now") LocalDateTime now,
                                          @Param("futureDate") LocalDateTime futureDate);

    // ============================================
    // ADMIN — COUNT ACTIVE COUPONS
    // ============================================
    @Query("SELECT COUNT(c) FROM Coupon c WHERE c.isActive = true")
    long countActiveCoupons();

    // ============================================
    // ADMIN — COUNT USAGE TOTAL
    // ============================================
    @Query("SELECT COALESCE(SUM(c.usedCount), 0) FROM Coupon c")
    Long sumTotalUsage();

    // ============================================
    // TOP USED COUPONS
    // ============================================
    @Query("SELECT c FROM Coupon c WHERE c.usedCount > 0 ORDER BY c.usedCount DESC")
    List<Coupon> findTopUsedCoupons();
}