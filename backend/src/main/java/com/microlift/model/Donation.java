package com.microlift.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double amount;
    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;
    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;
    private boolean isAnonymous;
    private String transactionId;
    private String paymentMethod;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
