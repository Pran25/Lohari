package com.lohari.controller;

import com.lohari.dto.AuthResponse;
import com.lohari.dto.LoginRequest;
import com.lohari.dto.RegisterRequest;
import com.lohari.model.User;
import com.lohari.service.UserService;
import com.lohari.util.JwtUtil;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ========== REGISTER ==========
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPasswordHash(request.getPassword());
            user.setFullName(request.getFullName());
            user.setPhone(request.getPhone());

            User savedUser = userService.registerUser(user);

            AuthResponse response = new AuthResponse(
                "Registration successful!",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole(),
                null,
                null,
                true
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(e.getMessage(), false));
        }
    }

    // ========== LOGIN ==========
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.loginUser(request.getEmail(), request.getPassword());
            String accessToken = jwtUtil.generateToken(user.getEmail());
            String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("role", user.getRole());  // ✅ Ensure role is returned
            response.put("phone", user.getPhone());
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    // ========== REFRESH TOKEN ==========
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            
            if (refreshToken == null || refreshToken.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Refresh token is required"));
            }

            if (!jwtUtil.isTokenValid(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Invalid or expired refresh token"));
            }

            String newAccessToken = jwtUtil.refreshAccessToken(refreshToken);
            String email = jwtUtil.extractEmail(refreshToken);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("accessToken", newAccessToken);
            response.put("refreshToken", refreshToken);
            response.put("email", email);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ========== LOGOUT ==========
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Logged out successfully"
        ));
    }

    // ========== VALIDATE TOKEN ==========
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("valid", false, "message", "No token provided"));
            }

            String token = authHeader.substring(7);
            
            if (!jwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("valid", false, "message", "Invalid or expired token"));
            }

            String email = jwtUtil.extractEmail(token);
            return ResponseEntity.ok(Map.of(
                "valid", true,
                "email", email,
                "message", "Token is valid"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", e.getMessage()));
        }
    }

    // ========== GET CURRENT USER ==========
 // ========== GET CURRENT USER ==========
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        try {

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        Map.of(
                                "success", false,
                                "message", "No token provided"
                        )
                );
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        Map.of(
                                "success", false,
                                "message", "Invalid or expired token"
                        )
                );
            }

            String email = jwtUtil.extractEmail(token);

            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("role", user.getRole());
            response.put("phone", user.getPhone());
            response.put("profilePicture", user.getProfilePicture());
            response.put("isActive", user.getIsActive());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // ========== GET OAUTH2 LOGIN URL ==========
    @GetMapping("/oauth2/url")
    public ResponseEntity<?> getOAuth2LoginUrl() {
        return ResponseEntity.ok(Map.of(
            "google", "http://localhost:8081/oauth2/authorization/google"
        ));
    }
}