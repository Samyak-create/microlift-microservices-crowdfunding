package com.microlift.dto;

import com.microlift.model.Campaign;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CampaignRequest {
    private String title;
    private String description;
    private Campaign.Category category;
    private Double goalAmount;
    private String location;
    private String imageUrl;
    private LocalDate endDate;
}
