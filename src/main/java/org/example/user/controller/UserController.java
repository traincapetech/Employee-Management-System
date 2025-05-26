package org.example.user.controller;

import org.example.employee.model.Employee;
import org.example.employee.repository.EmployeeRepository;
import org.example.hr.model.Hr;
import org.example.hr.repository.HrRepository;
import org.example.user.dto.SignupRequest;
import org.example.user.dto.UserInfoResponse;
import org.example.user.model.User;
import org.example.user.repository.UserRepository;
import org.example.user.service.UserService;
import org.example.user.dto.LoginRequest;
import org.example.user.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HrRepository hrRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

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

    @GetMapping("/details/{username}")
    public ResponseEntity<Object> getUserDetailsByUsername(@PathVariable String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOptional.get();
        String role = user.getRole();
        String userId = user.getId(); // This is now used for lookup

        switch (role.toUpperCase()) {
            case "ADMIN":
                return ResponseEntity.ok(user);

            case "HR":
                return hrRepository.findById(userId)
                        .<ResponseEntity<Object>>map(ResponseEntity::ok)
                        .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("HR details not found"));

            case "EMPLOYEE":
                return employeeRepository.findById(userId)
                        .<ResponseEntity<Object>>map(ResponseEntity::ok)
                        .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee details not found"));

            default:
                return ResponseEntity.badRequest().body("Invalid role: " + role);
        }
    }
}
