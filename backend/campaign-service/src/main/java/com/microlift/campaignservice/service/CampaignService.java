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
    private final FileStorageService fileStorageService;

    public Campaign createCampaign(CampaignRequest request, org.springframework.web.multipart.MultipartFile thumbnail, java.util.List<org.springframework.web.multipart.MultipartFile> files) {
        String thumbnailUrl = "https://via.placeholder.com/800x400"; // Default
        
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String fileName = fileStorageService.storeFile(thumbnail);
            thumbnailUrl = "http://localhost:8080/api/campaigns/files/" + fileName;
        }

        Campaign campaign = Campaign.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .goalAmount(request.getGoalAmount())
                .location(request.getLocation())
                .imageUrl(thumbnailUrl)
                .endDate(request.getEndDate())
                .beneficiaryId(request.getBeneficiaryId())
                .status(Campaign.Status.PENDING)
                .build();
        
        Campaign savedCampaign = campaignRepository.save(campaign);

        if (files != null && !files.isEmpty()) {
            for (org.springframework.web.multipart.MultipartFile file : files) {
                String fileName = fileStorageService.storeFile(file);
                
                // Create relative URL for frontend access (assuming served via controller)
                String fileUrl = "http://localhost:8080/api/campaigns/files/" + fileName;

                Document document = Document.builder()
                        .url(fileUrl)
                        .type("VERIFICATION_DOC")
                        .status(Document.Status.PENDING)
                        .campaign(savedCampaign)
                        .build();
                documentRepository.save(document);
            }
        }
        return savedCampaign;
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

    public org.springframework.core.io.Resource loadFileAsResource(String fileName) {
        return fileStorageService.loadFileAsResource(fileName);
    }
}
