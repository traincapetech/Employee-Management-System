package org.example.user.service;

import org.example.config.JwtUtil;
import org.example.user.model.User;
import org.example.user.dto.LoginRequest;
import org.example.user.dto.AuthResponse;
import org.example.user.dto.SignupRequest;
import org.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private JwtUtil jwtUtil;

    // Register method (signup)
    public String register(SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already taken.";
        }

        // Validate the role (ensure it's either ADMIN, HR, or EMPLOYEE)
        if (!isValidRole(request.getRole())) {
            return "Invalid role provided.";
        }

        // Create and save the new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(List.of(request.getRole()));  // Assign the role to the user

        userRepository.save(user);

        return jwtUtil.generateToken(user.getUsername());  // Return the generated token after registration
    }

    // Login method to return both token and role
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                // Generate JWT token
                String token = jwtUtil.generateToken(request.getUsername());

                // Return token and the role of the user (assuming one role for simplicity)
                return new AuthResponse(token, user.getRoles().get(0)); // Returns first role
            }
        }
        return null;  // Login failed or invalid credentials
    }

    // Helper method to validate role
    private boolean isValidRole(String role) {
        return role.equals("ADMIN") || role.equals("HR") || role.equals("EMPLOYEE");
    }
}
