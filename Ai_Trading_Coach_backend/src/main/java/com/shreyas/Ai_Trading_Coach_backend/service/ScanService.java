package com.shreyas.Ai_Trading_Coach_backend.service;

import com.shreyas.Ai_Trading_Coach_backend.dto.response.ScanResponse;
import org.springframework.stereotype.Service;

@Service
public class ScanService {
    private final AiServiceClient aiServiceClient;

    public ScanService(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    public ScanResponse scanMarket() {
        return aiServiceClient.scanMarket();
    }
}
