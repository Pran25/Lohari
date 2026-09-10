package com.lohari.service.impl;

import com.lohari.model.Category;
import com.lohari.repository.CategoryRepository;
import com.lohari.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category createCategory(Category category) {
        if (categoryRepository.existsBySlug(category.getSlug())) {
            throw new RuntimeException("Category with slug '" + category.getSlug() + "' already exists!");
        }
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        existing.setName(category.getName());
        existing.setSlug(category.getSlug());
        existing.setDescription(category.getDescription());
        existing.setIconUrl(category.getIconUrl());
        existing.setDisplayOrder(category.getDisplayOrder());
        existing.setIsActive(category.getIsActive());

        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public Optional<Category> getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public boolean existsBySlug(String slug) {
        return categoryRepository.existsBySlug(slug);
    }

    @Override
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }

    @Override
    public void toggleCategoryStatus(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        category.setIsActive(!category.getIsActive());
        categoryRepository.save(category);
    }
}