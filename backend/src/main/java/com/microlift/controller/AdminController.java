package com.microlift.controller;

import com.microlift.model.Campaign;
import com.microlift.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CampaignService campaignService;

    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard() {
        return ResponseEntity.ok("Welcome to Admin Dashboard - Authorized Access Only");
    }

    @GetMapping("/campaigns/pending")
    public ResponseEntity<List<Campaign>> getPendingCampaigns() {
        return ResponseEntity.ok(campaignService.getPendingCampaigns());
    }

    @PutMapping("/campaigns/{id}/status")
    public ResponseEntity<Campaign> updateCampaignStatus(@PathVariable Long id, @RequestParam Campaign.Status status) {
        return ResponseEntity.ok(campaignService.updateCampaignStatus(id, status));
    }

    @PutMapping("/documents/{id}/status")
    public ResponseEntity<Void> updateDocumentStatus(@PathVariable Long id, @RequestParam com.microlift.model.Document.Status status) {
        campaignService.updateDocumentStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
