package com.lohari.repository;

import com.lohari.model.Finish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinishRepository extends JpaRepository<Finish, Long> {

    // ========== BASIC ==========
    Optional<Finish> findByCode(String code);
    boolean existsByCode(String code);
    
    // ========== ACTIVE ==========
    List<Finish> findByIsActiveTrue();
    List<Finish> findByIsActiveTrueOrderByNameAsc();
    
    // ========== SEARCH ==========
    @Query("SELECT f FROM Finish f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(f.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Finish> searchFinishes(@Param("keyword") String keyword);
    
    // ========== ALL SORTED ==========
    List<Finish> findAllByOrderByNameAsc();
    List<Finish> findAllByOrderByCreatedAtDesc();
}