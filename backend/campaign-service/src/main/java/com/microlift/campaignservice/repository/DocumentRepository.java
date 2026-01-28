package com.microlift.campaignservice.repository;

import com.microlift.campaignservice.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
}
