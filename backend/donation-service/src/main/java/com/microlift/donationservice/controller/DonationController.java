package com.microlift.donationservice.controller;

import com.microlift.donationservice.dto.DonationRequest;
import com.microlift.donationservice.model.Donation;
import com.microlift.donationservice.service.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody java.util.Map<String, Object> data) throws Exception {
        Double amount = Double.parseDouble(data.get("amount").toString());
        return ResponseEntity.ok(donationService.createOrder(amount).toString());
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyDonation(@RequestBody java.util.Map<String, Object> data) throws Exception {
        String paymentId = (String) data.get("razorpay_payment_id");
        String orderId = (String) data.get("razorpay_order_id");
        String signature = (String) data.get("razorpay_signature");

        // Extract Donation Request Data from 'request' object inside payload if
        // structure is nested, or directly.
        // For simplicity, let's assume valid data is passed.
        // Constructing DonationRequest manually from map
        DonationRequest request = new DonationRequest();
        request.setAmount(Double.parseDouble(data.get("amount").toString()));
        request.setCampaignId(Long.parseLong(data.get("campaignId").toString()));
        request.setDonorId(Long.parseLong(data.get("donorId").toString()));
        request.setAnonymous(Boolean.parseBoolean(data.get("isAnonymous").toString()));

        return ResponseEntity.ok(donationService.verifyDonation(paymentId, orderId, signature, request));
    }

    @PostMapping
    public ResponseEntity<Donation> createDonation(@RequestBody DonationRequest request) {
        return ResponseEntity.ok(donationService.createDonation(request));
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<Donation>> getDonationsByDonor(@PathVariable Long donorId) {
        return ResponseEntity.ok(donationService.getDonationsByDonor(donorId));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<Donation>> getDonationsByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(donationService.getDonationsByCampaign(campaignId));
    }
}
