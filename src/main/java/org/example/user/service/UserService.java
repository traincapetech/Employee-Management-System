package org.example.user.service;

import org.example.config.JwtUtil;
import org.example.employee.model.Employee;
import org.example.user.model.User;
import org.example.user.dto.LoginRequest;
import org.example.user.dto.AuthResponse;
import org.example.user.dto.SignupRequest;
import org.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
        user.setRole(request.getRole());  // Use setRole instead of setRoles

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
                return new AuthResponse(token, user.getRole()); // Use getRole for a single role
            }
        }
        return null;  // Login failed or invalid credentials
    }

    // Helper method to validate role
    private boolean isValidRole(String role) {
        return role.equals("ADMIN") || role.equals("HR") || role.equals("EMPLOYEE");
    }

    public User createUserForEmployee(String username, String password, Employee employee) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("EMPLOYEE"); // Set the role as EMPLOYEE (can be extended for Admin, HR)
        user.setReferenceId(employee.getId()); // Link the user to the employee entity
        userRepository.save(user);
        return user;
    }

    public User createUser(String username, String password, String role, String referenceId) {
        // Validate roles (Admin for HR, HR for Employee)
        if ("HR".equals(role)) {
            User admin = userRepository.findById(referenceId).orElseThrow(() ->
                    new IllegalArgumentException("Admin with ID " + referenceId + " not found.")
            );
            if (!"ADMIN".equals(admin.getRole())) {
                throw new IllegalArgumentException("Reference ID must be an Admin.");
            }
        } else if ("EMPLOYEE".equals(role)) {
            User hr = userRepository.findById(referenceId).orElseThrow(() ->
                    new IllegalArgumentException("HR with ID " + referenceId + " not found.")
            );
            if (!"HR".equals(hr.getRole())) {
                throw new IllegalArgumentException("Reference ID must be an HR.");
            }
        }

        // Create and save the new user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);  // Assign role (HR, Employee)
        user.setReferenceId(referenceId);  // Set referenceId for HR or Admin

        userRepository.save(user);
        return user;
    }

}
