package com.lohari.repository;

import com.lohari.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    // ========== BASIC ==========
    Optional<Material> findByCode(String code);
    boolean existsByCode(String code);
    
    // ========== ACTIVE ==========
    List<Material> findByIsActiveTrue();
    List<Material> findByIsActiveTrueOrderByNameAsc();
    
    // ========== SEARCH ==========
    @Query("SELECT m FROM Material m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Material> searchMaterials(@Param("keyword") String keyword);
    
    // ========== ALL SORTED ==========
    List<Material> findAllByOrderByNameAsc();
    List<Material> findAllByOrderByCreatedAtDesc();
}