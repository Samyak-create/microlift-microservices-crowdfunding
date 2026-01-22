package com.microlift.service;

import com.microlift.config.JwtService;
import com.microlift.dto.*;
import com.microlift.model.User;
import com.microlift.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        var user = User.builder().fullName(request.getFullName()).email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())).phoneNumber(request.getPhoneNumber())
                .role(request.getRole()).build();
        repository.save(user);
        return authenticate(new LoginRequest(request.getEmail(), request.getPassword()));
    }

    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = repository.findByEmail(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).email(user.getEmail()).fullName(user.getFullName()).role(user.getRole().name()).build();
    }
}
