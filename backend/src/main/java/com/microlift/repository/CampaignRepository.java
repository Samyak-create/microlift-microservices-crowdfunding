package com.microlift.repository;
import com.microlift.model.Campaign;
import com.microlift.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByStatus(Campaign.Status status);
    List<Campaign> findByBeneficiary(User beneficiary);
}
