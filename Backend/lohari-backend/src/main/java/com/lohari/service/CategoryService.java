package com.lohari.service;

import com.lohari.model.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryService {

    Category createCategory(Category category);

    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);

    Optional<Category> getCategoryById(Long id);

    Optional<Category> getCategoryBySlug(String slug);

    List<Category> getAllCategories();

    List<Category> getActiveCategories();

    boolean existsBySlug(String slug);

    boolean existsByName(String name);

    void toggleCategoryStatus(Long id);
}