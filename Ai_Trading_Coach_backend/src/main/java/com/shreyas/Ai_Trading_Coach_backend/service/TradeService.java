package com.shreyas.Ai_Trading_Coach_backend.service;

import com.shreyas.Ai_Trading_Coach_backend.dto.request.TradeDTO;
import com.shreyas.Ai_Trading_Coach_backend.dto.response.TradeAnalysisResponse;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TradeService {

    private final AiServiceClient aiServiceClient;

    public TradeService(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    public TradeAnalysisResponse analyzeTrades(List<TradeDTO> trades) {

        Map<String, Object> request = new HashMap<>();
        request.put("trades", trades);

        return aiServiceClient.analyzeTrades(request);
    }
}