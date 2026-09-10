package com.lohari.service;

import com.lohari.model.User;
import java.util.Optional;

public interface UserService {
    
    User registerUser(User user);
    User loginUser(String email, String password);  // ✅ Changed: returns User, not String
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    void changePassword(String email, String newPassword);
    void changeEmail(String oldEmail, String newEmail);
    String refreshAccessToken(String refreshToken);
}