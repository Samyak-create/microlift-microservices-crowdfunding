package com.microlift.campaignservice.service.impl;

import com.microlift.campaignservice.service.StorageService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

@Service
@Profile("prod") // Only active in 'prod' profile
public class S3StorageService implements StorageService {

    // Inject AmazonS3 client here
    // private final AmazonS3 s3Client;

    public S3StorageService() {
        // Initialize S3 Client
    }

    @Override
    public String store(MultipartFile file) {
        // Implement S3 upload logic
        // s3Client.putObject(...);
        // return s3Client.getUrl(...).toString();
        throw new UnsupportedOperationException("S3 Storage not yet configured. Please add AWS SDK and credentials.");
    }

    @Override
    public Resource load(String filename) {
        // For S3, we typically don't load the resource through the backend
        // We return the public URL directly.
        // If this method is called, we can redirect or download stream.
        throw new UnsupportedOperationException("S3 files should be accessed via direct URL.");
    }
}
