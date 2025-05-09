package org.example.user.dto;

public class AuthResponse {

    private String token;
    private String role;  // Only one role

    // Constructor
    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
