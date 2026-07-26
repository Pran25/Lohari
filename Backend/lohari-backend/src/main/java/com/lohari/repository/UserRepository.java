package com.lohari.repository;

import com.lohari.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ========== BASIC METHODS ==========
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // ========== ADMIN DASHBOARD ==========
    long countByIsActiveTrue();

    // ✅ PostgreSQL: CURRENT_DATE instead of CURDATE()
    @Query(value = "SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE", nativeQuery = true)
    long countNewUsersToday();

    // ✅ PostgreSQL: EXTRACT instead of MONTH()
    @Query(value = "SELECT COUNT(*) FROM users WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)", nativeQuery = true)
    long countNewUsersThisMonth();

    List<User> findByRole(String role);
    List<User> findByIsActiveTrue();
    List<User> findByIsActiveFalse();
}