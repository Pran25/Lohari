package com.lohari.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationTime;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationTime;

    private SecretKey getSignKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ========== GENERATE ACCESS TOKEN ==========
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignKey())
                .compact();
    }

    // ========== GENERATE REFRESH TOKEN ==========
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshExpirationTime))
                .signWith(getSignKey())
                .compact();
    }

    // ========== GENERATE TOKEN WITH EXTRA CLAIMS ==========
    public String generateTokenWithClaims(String email, Map<String, Object> claims) {
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignKey())
                .compact();
    }

    // ========== EXTRACT EMAIL ==========
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ========== EXTRACT SPECIFIC CLAIM ==========
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // ========== EXTRACT ALL CLAIMS ==========
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ========== VALIDATE TOKEN ==========
    public boolean validateToken(String token, String userEmail) {
        try {
            final String email = extractEmail(token);
            return (email.equals(userEmail) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    // ========== CHECK IF TOKEN EXPIRED ==========
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // ========== GET EXPIRATION DATE ==========
    public Date getExpirationDate(String token) {
        return extractAllClaims(token).getExpiration();
    }

    // ========== CHECK IF TOKEN IS VALID (Without user check) ==========
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // ========== REFRESH TOKEN - Generate new access token from refresh token ==========
    public String refreshAccessToken(String refreshToken) {
        try {
            String email = extractEmail(refreshToken);
            
            // Validate refresh token
            if (isTokenValid(refreshToken)) {
                // Generate new access token
                return generateToken(email);
            }
            throw new RuntimeException("Invalid or expired refresh token");
        } catch (Exception e) {
            throw new RuntimeException("Invalid refresh token: " + e.getMessage());
        }
    }

    // ========== GET TOKEN TYPE (Access or Refresh) ==========
    public String getTokenType(String token) {
        try {
            Claims claims = extractAllClaims(token);
            // Check expiration time - if longer than access token, it's a refresh token
            long expiration = claims.getExpiration().getTime();
            long now = System.currentTimeMillis();
            long diff = expiration - now;
            
            if (diff > expirationTime) {
                return "REFRESH";
            }
            return "ACCESS";
        } catch (Exception e) {
            return "INVALID";
        }
    }
}