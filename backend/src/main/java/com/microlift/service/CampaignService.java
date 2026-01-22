package com.microlift.service;

import com.microlift.model.Campaign;
import com.microlift.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CampaignService {
    private final CampaignRepository repository;
    public List<Campaign> getAllActiveCampaigns() { return repository.findByStatus(Campaign.Status.ACTIVE); }
    public List<Campaign> getPendingCampaigns() { return repository.findByStatus(Campaign.Status.PENDING); }
    public List<Campaign> getCampaignsByBeneficiary(com.microlift.model.User beneficiary) { return repository.findByBeneficiary(beneficiary); }
    public Optional<Campaign> getCampaignById(Long id) { return repository.findById(id); }
    public Campaign createCampaign(Campaign campaign) { return repository.save(campaign); }
    public Campaign updateCampaignStatus(Long id, Campaign.Status status) {
        Campaign campaign = repository.findById(id).orElseThrow();
        campaign.setStatus(status);
        return repository.save(campaign);
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.microlift.repository.DocumentRepository documentRepository;

    public void updateDocumentStatus(Long documentId, com.microlift.model.Document.Status status) {
        com.microlift.model.Document doc = documentRepository.findById(documentId).orElseThrow();
        doc.setStatus(status);
        documentRepository.save(doc);
    }
}
