package com.lohari.service.impl;

import com.lohari.model.User;
import com.lohari.repository.UserRepository;
import com.lohari.service.UserService;
import com.lohari.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    @Transactional
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setRole("CUSTOMER");
        user.setIsActive(true);

        return userRepository.save(user);
    }

    @Override
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new RuntimeException("User account is inactive.");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password!");
        }

        user.setLastLogin(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public void changePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changeEmail(String oldEmail, String newEmail) {
        User user = userRepository.findByEmail(oldEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userRepository.existsByEmail(newEmail)) {
            throw new RuntimeException("Email already in use!");
        }
        
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    @Override
    public String refreshAccessToken(String refreshToken) {
        return jwtUtil.refreshAccessToken(refreshToken);
    }

    // ============================================
    // ✅ NEW ADMIN METHODS
    // ============================================

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        // Soft delete — FK constraint se bachne ke liye
        // Agar tum hard delete chahte ho toh niche comment dekho
        user.setIsActive(false);
        userRepository.save(user);

        // ⚠️ HARD DELETE (agar orders/invoices nahi hain user ke paas):
        // userRepository.delete(user);
    }

    @Override
    @Transactional
    public void changeRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        // Validate role
        if (!role.equals("CUSTOMER") && !role.equals("ADMIN") && !role.equals("STAFF")) {
            throw new RuntimeException("Invalid role: " + role);
        }

        user.setRole(role);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void toggleStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        userRepository.save(user);
    }
}