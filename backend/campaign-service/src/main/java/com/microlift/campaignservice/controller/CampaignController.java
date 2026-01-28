package com.microlift.campaignservice.controller;

import com.microlift.campaignservice.dto.CampaignRequest;
import com.microlift.campaignservice.model.Campaign;
import com.microlift.campaignservice.model.Document;
import com.microlift.campaignservice.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(@RequestBody CampaignRequest request) {
        return ResponseEntity.ok(campaignService.createCampaign(request));
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllActiveCampaigns() {
        return ResponseEntity.ok(campaignService.getAllActiveCampaigns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }

    @GetMapping("/beneficiary/{beneficiaryId}")
    public ResponseEntity<List<Campaign>> getCampaignsByBeneficiary(@PathVariable Long beneficiaryId) {
        return ResponseEntity.ok(campaignService.getCampaignsByBeneficiary(beneficiaryId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Campaign>> getPendingCampaigns() {
        return ResponseEntity.ok(campaignService.getPendingCampaigns());
    }

    @PutMapping("/{id}/status")
    public Campaign updateStatus(@PathVariable Long id, @RequestParam Campaign.Status status) {
        return campaignService.updateStatus(id, status);
    }

    @PutMapping("/{id}/add-funds")
    public ResponseEntity<Void> addFunds(@PathVariable Long id, @RequestParam Double amount) {
        campaignService.addFunds(id, amount);
        return ResponseEntity.ok().build();
    }

    // Move document status endpoint here for simplicity or update Gateway
    @PutMapping("/documents/{id}/status")
    public ResponseEntity<Void> updateDocumentStatus(@PathVariable Long id, @RequestParam Document.Status status) {
        campaignService.updateDocumentStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
