package com.lohari.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lohari.model.CustomConfiguration;
import com.lohari.repository.CustomConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customizations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class CustomizationController {

    @Autowired
    private CustomConfigurationRepository configRepository;

    @Autowired
    private ObjectMapper objectMapper;  // ✅ ADD THIS

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveConfiguration(@RequestBody Map<String, Object> request) {
        try {
            CustomConfiguration config = new CustomConfiguration();
            config.setProductId(Long.valueOf(request.get("productId").toString()));
            config.setProductName(request.get("productName").toString());
            
            // ✅ Convert Map to JSON String
            String jsonData = objectMapper.writeValueAsString(request);
            config.setConfigurationData(jsonData);
            
            config.setPriceEstimate(Double.valueOf(request.get("priceEstimate").toString()));
            config.setCreatedAt(LocalDateTime.now());
            
            CustomConfiguration saved = configRepository.save(config);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("message", "Configuration saved successfully!");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}