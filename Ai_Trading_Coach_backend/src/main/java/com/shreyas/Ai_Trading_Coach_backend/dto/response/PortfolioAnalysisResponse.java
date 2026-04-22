package com.shreyas.Ai_Trading_Coach_backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class PortfolioAnalysisResponse {

    private String analysisId;
    private String generatedAt;
    private int portfolioHealthScore;
    private String riskLevel;

    private Map<String, Object> metrics;
    private Map<String, Object> diversification;
    private Map<String, Object> stressTest;
    private Map<String, Object> sentiment;

    private String summary;
    private List<String> actions;
}