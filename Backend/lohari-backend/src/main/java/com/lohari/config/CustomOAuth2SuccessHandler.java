package com.lohari.config;

import com.lohari.model.User;
import com.lohari.repository.UserRepository;
import com.lohari.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");

        System.out.println("✅ OAuth2 Login Successful!");
        System.out.println("User Name: " + name);
        System.out.println("User Email: " + email);

        // ✅ Save or update user
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setPasswordHash("");
            user.setRole("CUSTOMER");
            user.setIsActive(true);
        }

        user.setFullName(name);
        user.setProfilePicture(picture);

        user = userRepository.save(user);

        // ✅ Generate JWT tokens
        String token = jwtUtil.generateToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        // ✅ URL Encode name
        String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8);

        // ✅ Redirect to React with tokens
        String redirectUrl = "http://localhost:5173/oauth2/callback?token=" + token +
                            "&refreshToken=" + refreshToken +
                            "&email=" + email +
                            "&name=" + encodedName;

        System.out.println("🔄 Redirecting to: " + redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}