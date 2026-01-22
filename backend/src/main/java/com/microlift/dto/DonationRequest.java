package com.microlift.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DonationRequest {
    private Long campaignId;
    private Double amount;
    private String paymentMethod; 
    private boolean anonymous;
}
