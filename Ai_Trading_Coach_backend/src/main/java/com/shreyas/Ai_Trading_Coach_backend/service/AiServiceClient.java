package com.shreyas.Ai_Trading_Coach_backend.service;

import com.shreyas.Ai_Trading_Coach_backend.dto.response.PortfolioAnalysisResponse;
import com.shreyas.Ai_Trading_Coach_backend.dto.response.ScanResponse;
import com.shreyas.Ai_Trading_Coach_backend.dto.response.StockResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.cache.annotation.Cacheable;

import com.shreyas.Ai_Trading_Coach_backend.dto.response.TradeAnalysisResponse;

@Service
public class AiServiceClient {

    private final RestTemplate restTemplate;

    public AiServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Stock Analysis
    @Cacheable(value = "stockAnalysis", key = "#symbol", unless = "#result == null")
    public StockResponse analyzeStock(String symbol) {

        String url = "http://localhost:8000/analyze-stock/" + symbol;

        ResponseEntity<StockResponse> response =
                restTemplate.getForEntity(url, StockResponse.class);

        return response.getBody();
    }

    // Market Scan
    @Cacheable(value = "marketScan", unless = "#result == null")
    public ScanResponse scanMarket() {

        String url = "http://localhost:8000/scan-market";

        ResponseEntity<ScanResponse> response =
                restTemplate.getForEntity(url, ScanResponse.class);

        return response.getBody();
    }

    public TradeAnalysisResponse analyzeTrades(Object request) {

        String url = "http://localhost:8000/analyze-trades";

        ResponseEntity<TradeAnalysisResponse> response =
                restTemplate.postForEntity(url, request, TradeAnalysisResponse.class);

        return response.getBody();
    }

    public PortfolioAnalysisResponse analyzePortfolio(Object request) {

        String url = "http://localhost:8000/portfolio-analyze";

        ResponseEntity<PortfolioAnalysisResponse> response =
                restTemplate.postForEntity(url, request, PortfolioAnalysisResponse.class);

        return response.getBody();
    }
}