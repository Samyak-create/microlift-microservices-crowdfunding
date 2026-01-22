package com.microlift.service;

import com.microlift.model.Campaign;
import com.microlift.model.Donation;
import com.microlift.repository.CampaignRepository;
import com.microlift.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {
    private final DonationRepository donationRepository;
    private final CampaignRepository campaignRepository;

    @Transactional
    public Donation processDonation(Donation donation) {
        Donation saved = donationRepository.save(donation);
        Campaign campaign = saved.getCampaign();
        double current = campaign.getRaisedAmount() != null ? campaign.getRaisedAmount() : 0.0;
        campaign.setRaisedAmount(current + saved.getAmount());
        if (campaign.getRaisedAmount() >= campaign.getGoalAmount()) campaign.setStatus(Campaign.Status.COMPLETED);
        campaignRepository.save(campaign);
        return saved;
    }
    public List<Donation> getDonationsByDonor(Long donorId) { return donationRepository.findByDonorId(donorId); }
}
