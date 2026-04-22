package com.shreyas.Ai_Trading_Coach_backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Setter
@Getter
public class TradeAnalysisResponse {

    private String analysisId;
    private String generatedAt;
    private int riskScore;
    private String traderType;
    private List<String> mistakes;
    private Map<String, Object> metrics;
    private String summary;
    private List<String> suggestions;

    // Getters & Setters

}