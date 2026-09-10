package com.lohari.repository;

import com.lohari.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsByName(String name);
    List<Category> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<Category> findAllByOrderByDisplayOrderAsc();
}