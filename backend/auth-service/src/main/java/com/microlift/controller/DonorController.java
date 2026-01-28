package com.microlift.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donor")
public class DonorController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> donorDashboard() {
        return ResponseEntity.ok("Welcome to Donor Dashboard - Authorized Access");
    }
}
