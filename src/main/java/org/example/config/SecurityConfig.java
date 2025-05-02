package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Disable CSRF if not using it (usually for APIs)
                .authorizeRequests()
                // Allow public access to Swagger UI and API Docs
                .antMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                // Allow signup/login without authentication
                .antMatchers("/api/users/signup", "/api/users/login").permitAll()
                // Secure other endpoints
                .anyRequest().authenticated()
                .and()
                .httpBasic();  // or .formLogin() if you prefer form-based login
        return http.build();
    }
}
