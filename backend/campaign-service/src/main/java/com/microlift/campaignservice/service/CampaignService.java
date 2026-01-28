package com.microlift.campaignservice.service;

import com.microlift.campaignservice.dto.CampaignRequest;
import com.microlift.campaignservice.model.Campaign;
import com.microlift.campaignservice.model.Document;
import com.microlift.campaignservice.repository.CampaignRepository;
import com.microlift.campaignservice.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final DocumentRepository documentRepository;

    public Campaign createCampaign(CampaignRequest request) {
        Campaign campaign = Campaign.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .goalAmount(request.getGoalAmount())
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .endDate(request.getEndDate())
                .beneficiaryId(request.getBeneficiaryId())
                .status(Campaign.Status.PENDING)
                .build();
        return campaignRepository.save(campaign);
    }

    public List<Campaign> getAllActiveCampaigns() {
        return campaignRepository.findByStatus(Campaign.Status.ACTIVE);
    }

    public List<Campaign> getCampaignsByBeneficiary(Long beneficiaryId) {
        return campaignRepository.findByBeneficiaryId(beneficiaryId);
    }

    public List<Campaign> getPendingCampaigns() {
        return campaignRepository.findByStatus(Campaign.Status.PENDING);
    }

    public Campaign getCampaignById(Long id) {
        return campaignRepository.findById(id).orElseThrow(() -> new RuntimeException("Campaign not found"));
    }

    public Campaign updateStatus(Long id, Campaign.Status status) {
        Campaign campaign = getCampaignById(id);
        campaign.setStatus(status);
        return campaignRepository.save(campaign);
    }

    public void addFunds(Long id, Double amount) {
        Campaign campaign = getCampaignById(id);
        campaign.setRaisedAmount(campaign.getRaisedAmount() + amount);
        campaignRepository.save(campaign);
    }

    public void updateDocumentStatus(Long id, Document.Status status) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        document.setStatus(status);
        documentRepository.save(document);
    }
}
