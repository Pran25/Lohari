package com.lohari.dto;

import jakarta.validation.constraints.NotBlank;

public class OrderStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String location;
    private String description;

    // ========== GETTERS AND SETTERS ==========

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}