package org.example.user.service;

import org.example.config.JwtUtil;
import org.example.employee.model.Employee;
import org.example.hr.repository.HrRepository;
import org.example.user.model.User;
import org.example.user.dto.LoginRequest;
import org.example.user.dto.AuthResponse;
import org.example.user.dto.SignupRequest;
import org.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HrRepository hrRepository;

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

    // Updated to use the provided employee ID for the user
    public User createUserForEmployee(String username, String password, Employee employee) {
        User user = new User();
        // Use the employee's ID for the user ID to ensure they share the same ID
        user.setId(employee.getId());
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("EMPLOYEE"); // Set the role as EMPLOYEE
        user.setReferenceId(employee.getHrId()); // Link the user to the HR who created the employee
        userRepository.save(user);
        return user;
    }

    // Updated to allow sharing IDs between user and employee records
    public User createUser(String username, String password, String role, String referenceId) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken.");
        }

        // For ADMIN users, we don't need to validate the referenceId
        if ("ADMIN".equals(role)) {
            // Admin can be created without reference validation
            // Just log the action
            System.out.println("Creating ADMIN user with username: " + username);
        }
        else if ("HR".equals(role)) {
            // For HR, check if the reference (usually an admin) exists
            if (referenceId == null || referenceId.isEmpty()) {
                System.out.println("Warning: HR created without reference ID");
            } else {
                userRepository.findById(referenceId)
                        .orElseThrow(() -> new IllegalArgumentException("Referenced user with ID " + referenceId + " not found."));
            }
        } else if ("EMPLOYEE".equals(role)) {
            // For employee, reference should be an HR
            if (referenceId == null || referenceId.isEmpty()) {
                System.out.println("Warning: Employee created without reference ID");
            } else {
                userRepository.findById(referenceId)
                        .orElseThrow(() -> new IllegalArgumentException("HR with ID " + referenceId + " not found."));
            }
        }

        // Create and save the user
        User user = new User();
        // We'll use UUID for ID generation, but this ID will be shared with employee record
        // when created through the employee controller
        user.setId(UUID.randomUUID().toString());
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setReferenceId(referenceId);

        return userRepository.save(user);
    }
    
    // New method to create user with specific ID (used for synchronizing with employee records)
    public User createUserWithId(String id, String username, String password, String role, String referenceId) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken.");
        }

        // Create and save the user with the provided ID
        User user = new User();
        user.setId(id); // Use the provided ID instead of generating a new one
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setReferenceId(referenceId);

        return userRepository.save(user);
    }
}