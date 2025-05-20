package org.example.user.controller;

import org.example.user.dto.SignupRequest;
import org.example.user.service.UserService;
import org.example.user.dto.LoginRequest;
import org.example.user.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Signup endpoint (returns token as a plain string for simplicity)
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        String token = userService.register(request);
        return ResponseEntity.ok(token);
    }

    // Login endpoint (returns token and role)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        AuthResponse authResponse = userService.login(request);

        if (authResponse != null) {
            return ResponseEntity.ok(authResponse); // 200 OK with token + role
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
