package org.example.user.controller;

import org.example.user.dto.SignupRequest;
import org.example.user.service.UserService;
import org.example.user.dto.LoginRequest;
import org.example.user.dto.AuthResponse;  // Import AuthResponse
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {
        return userService.register(request);  // Registration returns token
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        // Call login service and get token + role
        AuthResponse authResponse = userService.login(request);

        // Check if login was successful (i.e., return value is not null)
        if (authResponse != null) {
            return authResponse;  // Return both token and role
        } else {
            // Invalid login, return null or send a custom error response
            return null;
        }
    }
}
