package com.microlift.controller;

import com.microlift.dto.CampaignRequest;
import com.microlift.model.Campaign;
import com.microlift.model.User;
import com.microlift.service.CampaignService;
import com.microlift.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/beneficiary")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final CampaignService campaignService;
    private final UserService userService;

    @PostMapping("/campaigns")
    public ResponseEntity<Campaign> createCampaign(@RequestBody CampaignRequest request, java.security.Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        Campaign campaign = Campaign.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .goalAmount(request.getGoalAmount())
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .endDate(request.getEndDate())
                .beneficiary(user)
                .status(Campaign.Status.PENDING)
                .build();
        return ResponseEntity.ok(campaignService.createCampaign(campaign));
    }

    @GetMapping("/campaigns")
    public ResponseEntity<List<Campaign>> getMyCampaigns(java.security.Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(campaignService.getCampaignsByBeneficiary(user));
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard() {
        return ResponseEntity.ok("Welcome to Beneficiary Dashboard - Authorized Access");
    }
}
