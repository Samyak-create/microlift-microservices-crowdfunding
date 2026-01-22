package com.microlift.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 255)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(length = 255)
    private Category category;
    private Double goalAmount;
    private Double raisedAmount = 0.0;
    private String location;
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Status status;
    @ManyToOne
    @JoinColumn(name = "beneficiary_id")
    private User beneficiary;
    
    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private java.util.List<Document> documents = new java.util.ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (raisedAmount == null) raisedAmount = 0.0;
        if (status == null) status = Status.PENDING;
    }

    public enum Category { EDUCATION, MEDICAL, EMERGENCY, ENVIRONMENT, OTHER }
    public enum Status { PENDING, ACTIVE, COMPLETED, REJECTED }
}
