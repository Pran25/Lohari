package com.lohari.dto;

public class AuthResponse {

    private String message;
    private Long userId;
    private String email;
    private String fullName;
    private String role;
    private String accessToken;
    private String refreshToken;
    private boolean success;

    // ========== DEFAULT CONSTRUCTOR ==========
    public AuthResponse() {
    }

    // ========== CONSTRUCTOR WITH ALL FIELDS ==========
    public AuthResponse(String message, Long userId, String email, String fullName, 
                        String role, String accessToken, String refreshToken) {
        this.message = message;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.success = true;
    }

    // ========== CONSTRUCTOR FOR ERROR RESPONSES ==========
    public AuthResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    // ========== CONSTRUCTOR FOR SIMPLE RESPONSES ==========
    public AuthResponse(String message, Long userId, String email, String fullName, String role, boolean success) {
        this.message = message;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.success = success;
    }

    // ========== CONSTRUCTOR FOR REGISTRATION/LOGIN ==========
    public AuthResponse(String message, Long userId, String email, String fullName, 
                        String role, String accessToken, String refreshToken, boolean success) {
        this.message = message;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.success = success;
    }

    // ========== GETTERS AND SETTERS ==========

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}