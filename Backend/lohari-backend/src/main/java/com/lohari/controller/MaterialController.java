package com.lohari.controller;

import com.lohari.model.Material;
import com.lohari.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    // ✅ GET all materials (Public)
    @GetMapping
    public ResponseEntity<List<Material>> getAllMaterials() {
        return ResponseEntity.ok(materialRepository.findAll());
    }

    // ✅ GET active materials
    @GetMapping("/active")
    public ResponseEntity<List<Material>> getActiveMaterials() {
        return ResponseEntity.ok(materialRepository.findByIsActiveTrue());
    }

    // ✅ GET material by id
    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterialById(@PathVariable Long id) {
        return materialRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ CREATE material (Admin only)
    @PostMapping("/admin")
    public ResponseEntity<Material> createMaterial(@RequestBody Material material) {
        material.setCreatedAt(java.time.LocalDateTime.now());
        material.setUpdatedAt(java.time.LocalDateTime.now());
        Material saved = materialRepository.save(material);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ UPDATE material (Admin only)
    @PutMapping("/admin/{id}")
    public ResponseEntity<Material> updateMaterial(@PathVariable Long id, @RequestBody Material material) {
        return materialRepository.findById(id)
                .map(existing -> {
                    existing.setName(material.getName());
                    existing.setCode(material.getCode());
                    existing.setDescription(material.getDescription());
                    existing.setPriceMultiplier(material.getPriceMultiplier());
                    existing.setUnit(material.getUnit());
                    existing.setIsActive(material.getIsActive());
                    existing.setUpdatedAt(java.time.LocalDateTime.now());
                    return ResponseEntity.ok(materialRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ DELETE material (Admin only)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        if (materialRepository.existsById(id)) {
            materialRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}