package org.example.user.service;

import org.example.user.model.User;
import org.example.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find the user by username
        Optional<User> userOptional = userRepository.findByUsername(username);
        
        // Throw exception if user not found
        if (!userOptional.isPresent()) {
            throw new UsernameNotFoundException("User not found : " + username);
        }
        
        // Return the User object directly since it now implements UserDetails
        return userOptional.get();
    }
}