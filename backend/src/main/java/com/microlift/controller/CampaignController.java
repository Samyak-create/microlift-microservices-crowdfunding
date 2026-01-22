package com.microlift.controller;

import com.microlift.model.Campaign;
import com.microlift.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping("/public")
    public ResponseEntity<List<Campaign>> getAllActiveCampaigns() {
        return ResponseEntity.ok(campaignService.getAllActiveCampaigns());
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable Long id) {
        return campaignService.getCampaignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
