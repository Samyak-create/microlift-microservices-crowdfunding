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

    @PostMapping(consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Campaign> createCampaign(@RequestBody CampaignRequest request) {
        return ResponseEntity.ok(campaignService.createCampaign(request));
    }

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> getFile(@PathVariable String fileName) {
        org.springframework.core.io.Resource file = campaignService.loadFileAsResource(fileName);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
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

    @GetMapping("/completed")
    public ResponseEntity<List<Campaign>> getCompletedCampaigns() {
        return ResponseEntity.ok(campaignService.getCompletedCampaigns());
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    // Move document status endpoint here for simplicity or update Gateway
    @PutMapping("/documents/{id}/status")
    public ResponseEntity<Void> updateDocumentStatus(@PathVariable Long id, @RequestParam Document.Status status) {
        campaignService.updateDocumentStatus(id, status);
        return ResponseEntity.ok().build();
    }

    // Emergency Fix Endpoint
    @PostMapping("/fix-images")
    public ResponseEntity<String> fixImages() {
        // Logic moved here
        java.util.List<Campaign> campaigns = campaignService.getAllActiveCampaigns(); // or findAll via repo if service
                                                                                      // exposd
        // Since service only exposes limited methods, let's just cheat and return
        // instructions
        // OR better: access Repo? No, controller shouldn't.
        // Let's add the method to Service.
        campaignService.fixLegacyImages();
        return ResponseEntity.ok("Images Fixed");
    }
}
