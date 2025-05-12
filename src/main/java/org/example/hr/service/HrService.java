package org.example.hr.service;

import org.example.hr.model.Hr;
import org.example.hr.repository.HrRepository;
import org.example.user.model.User;
import org.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class HrService {

    @Autowired
    private HrRepository hrRepository;

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Hr createHr(Hr hr, String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already taken.");
        }

        hr.setId(UUID.randomUUID().toString());
        Hr savedHr = hrRepository.save(hr);

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("HR");

        userRepository.save(user);

        return savedHr;
    }

    public List<Hr> getAllHrs() {
        return hrRepository.findAll();
    }

    public Hr getHrById(String id) {
        return hrRepository.findById(id).orElse(null);
    }

    public void deleteHr(String id) {
        hrRepository.deleteById(id);
    }
}
