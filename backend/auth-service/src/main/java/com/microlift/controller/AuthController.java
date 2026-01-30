package com.microlift.controller;

import com.microlift.dto.AuthResponse;
import com.microlift.dto.LoginRequest;
import com.microlift.dto.RegisterRequest;
import com.microlift.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping(value = "/upload-kyc", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadKyc(@org.springframework.web.bind.annotation.RequestParam("email") String email,
            @org.springframework.web.bind.annotation.RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        authService.uploadKyc(email, file);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/upload-kyc-public", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadKycPublic(
            @org.springframework.web.bind.annotation.RequestPart("email") String email,
            @org.springframework.web.bind.annotation.RequestPart("file") org.springframework.web.multipart.MultipartFile file) {
        System.out.println("DEBUG: PUBLIC upload hit for: " + email);
        authService.uploadKyc(email, file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-kyc")
    public ResponseEntity<Void> updateKyc(@RequestBody com.microlift.dto.KycUpdateRequest request) {
        authService.updateKycUrl(request.getEmail(), request.getKycUrl());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-user/{userId}")
    public ResponseEntity<Void> verifyUser(@org.springframework.web.bind.annotation.PathVariable Long userId,
            @org.springframework.web.bind.annotation.RequestParam String status) {
        authService.verifyUser(userId, status);
        return ResponseEntity.ok().build();
    }

    @org.springframework.web.bind.annotation.GetMapping("/users/{userId}")
    public ResponseEntity<com.microlift.model.User> getUser(
            @org.springframework.web.bind.annotation.PathVariable Long userId) {
        return ResponseEntity.ok(authService.getUserById(userId));
    }

    @org.springframework.web.bind.annotation.GetMapping("/kyc-files/{fileName:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> getKycFile(
            @org.springframework.web.bind.annotation.PathVariable String fileName) {
        // Handle "uploads/" prefix if stored in DB with it
        String cleanName = fileName;
        if (fileName.startsWith("uploads")) {
            // If the filename in request is full path "uploads/foo.jpg", just extract name.
            // But usually frontend will request /uploads/foo.jpg if we give it that URL.
            // Let's rely on service to handle path resolution from simple name.
        }

        org.springframework.core.io.Resource file = authService.loadKycFile(fileName);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
}
