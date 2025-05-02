package org.example.user.service;


import org.example.config.JwtUtil;
import org.example.user.model.User;
import org.example.user.dto.LoginRequest;
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

    public String register(SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already taken.";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return jwtUtil.generateToken(user.getUsername());
    }

    public String login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            if (passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
                return jwtUtil.generateToken(request.getUsername());
            }
        }
        return "Invalid username or password.";
    }

}
