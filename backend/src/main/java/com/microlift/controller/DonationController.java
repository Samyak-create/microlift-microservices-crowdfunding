package com.microlift.controller;

import com.microlift.dto.DonationRequest;
import com.microlift.model.Campaign;
import com.microlift.model.Donation;
import com.microlift.model.User;
import com.microlift.service.CampaignService;
import com.microlift.service.DonationService;
import com.microlift.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/donor/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;
    private final CampaignService campaignService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Donation> createDonation(
            @RequestBody DonationRequest request,
            Principal principal) {

        User donor = userService.getUserByEmail(principal.getName());

        Campaign campaign = campaignService.getCampaignById(request.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Donation donation = Donation.builder()
                .amount(request.getAmount())
                .campaign(campaign)
                .donor(donor)
                .paymentMethod(request.getPaymentMethod())
                .isAnonymous(request.isAnonymous())
                .transactionId("TXN" + System.currentTimeMillis())
                .build();

        return ResponseEntity.ok(donationService.processDonation(donation));
    }

    @GetMapping
    public ResponseEntity<List<Donation>> getDonationHistory(Principal principal) {
        User donor = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(
                donationService.getDonationsByDonor(donor.getId())
        );
    }
}
