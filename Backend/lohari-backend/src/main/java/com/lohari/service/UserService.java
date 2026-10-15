package com.lohari.service;

import com.lohari.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    
    // existing methods
    User registerUser(User user);
    User loginUser(String email, String password);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    void changePassword(String email, String newPassword);
    void changeEmail(String oldEmail, String newEmail);
    String refreshAccessToken(String refreshToken);

    // ✅ NEW admin methods
    List<User> getAllUsers();
    void deleteUser(Long id);
    void changeRole(Long id, String role);
    void toggleStatus(Long id);
}