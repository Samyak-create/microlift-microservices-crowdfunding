package com.microlift.donationservice.service;

import com.microlift.donationservice.dto.DonationRequest;
import com.microlift.donationservice.model.Donation;
import com.microlift.donationservice.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final com.microlift.donationservice.client.CampaignClient campaignClient;
    private com.razorpay.RazorpayClient razorpayClient;

    @org.springframework.beans.factory.annotation.Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @org.springframework.beans.factory.annotation.Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    @jakarta.annotation.PostConstruct
    public void initRazorpay() throws com.razorpay.RazorpayException {
        this.razorpayClient = new com.razorpay.RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }

    public com.razorpay.Order createOrder(Double amount) throws com.razorpay.RazorpayException {
        org.json.JSONObject options = new org.json.JSONObject();
        options.put("amount", (int) (amount * 100)); // Amount in paise
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());
        return razorpayClient.orders.create(options);
    }

    public Donation verifyDonation(String paymentId, String orderId, String signature, DonationRequest request)
            throws com.razorpay.RazorpayException {
        String generatedSignature = com.razorpay.Utils.getHash(orderId + "|" + paymentId, razorpayKeySecret);

        if (generatedSignature.equals(signature)) {
            // Payment Successful
            Donation donation = Donation.builder()
                    .amount(request.getAmount())
                    .donorId(request.getDonorId())
                    .campaignId(request.getCampaignId())
                    .isAnonymous(request.isAnonymous())
                    .paymentMethod("RAZORPAY")
                    .transactionId(paymentId)
                    .build();

            Donation savedDonation = donationRepository.save(donation);

            // Update Campaign Funds
            campaignClient.addFunds(request.getCampaignId(), request.getAmount());

            return savedDonation;
        } else {
            throw new RuntimeException("Payment Verification Failed");
        }
    }

    public Donation createDonation(DonationRequest request) {
        // Fallback or Cash/Other methods
        Donation donation = Donation.builder()
                .amount(request.getAmount())
                .donorId(request.getDonorId())
                .campaignId(request.getCampaignId())
                .isAnonymous(request.isAnonymous())
                .paymentMethod("UPI_MOCK") // Mock for now if not using Razorpay flow explicitly
                .transactionId(java.util.UUID.randomUUID().toString())
                .build();
        campaignClient.addFunds(request.getCampaignId(), request.getAmount());
        return donationRepository.save(donation);
    }

    public List<Donation> getDonationsByDonor(Long donorId) {
        return donationRepository.findByDonorId(donorId);
    }

    public List<Donation> getDonationsByCampaign(Long campaignId) {
        return donationRepository.findByCampaignId(campaignId);
    }
}
