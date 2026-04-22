package com.shreyas.Ai_Trading_Coach_backend.service;

import com.shreyas.Ai_Trading_Coach_backend.dto.response.StockResponse;
import org.springframework.stereotype.Service;

@Service
public class StockService {

    private final AiServiceClient aiServiceClient;

    public StockService(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    public StockResponse analyze(String symbol) {
        return aiServiceClient.analyzeStock(symbol);
    }
}