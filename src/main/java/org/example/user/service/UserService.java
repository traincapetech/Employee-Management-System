package org.example.user.service;

import org.example.config.JwtUtil;
import org.example.employee.model.Employee;
import org.example.hr.model.Hr;
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

    public String register(SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already taken.";
        }

        if (!isValidRole(request.getRole())) {
            return "Invalid role provided.";
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        return jwtUtil.generateToken(user.getUsername());
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(request.getUsername());
                return new AuthResponse(token, user.getRole());
            }
        }
        return null;
    }

    private boolean isValidRole(String role) {
        return role.equals("ADMIN") || role.equals("HR") || role.equals("EMPLOYEE");
    }

    public User createUserWithId(String id, String username, String password, String role, String referenceId) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already taken.");
        }

        User user = new User();
        user.setId(id); // Use the same ID as Employee
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setReferenceId(referenceId);

        return userRepository.save(user);
    }


    public User createUserForEmployee(String username, String password, Employee employee, String referenceId) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already taken.");
        }

        User user = new User();
        user.setId(employee.getId());
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("EMPLOYEE");
        user.setReferenceId(referenceId);
        return userRepository.save(user);
    }

    public User createUser(String username, String password, String role, String referenceId) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken.");
        }

        User user = new User();
        user.setId(referenceId);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setReferenceId(referenceId);

        return userRepository.save(user);
    }
}
