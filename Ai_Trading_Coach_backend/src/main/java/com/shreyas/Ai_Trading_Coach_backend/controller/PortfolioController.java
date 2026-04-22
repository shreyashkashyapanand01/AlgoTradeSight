package com.shreyas.Ai_Trading_Coach_backend.controller;

import com.shreyas.Ai_Trading_Coach_backend.dto.request.HoldingRequest;
import com.shreyas.Ai_Trading_Coach_backend.dto.response.PortfolioAnalysisResponse;
import com.shreyas.Ai_Trading_Coach_backend.entity.Holding;
import com.shreyas.Ai_Trading_Coach_backend.service.PortfolioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    // 🔍 ANALYZE PORTFOLIO
    @GetMapping("/analyze/{userId}")
    public PortfolioAnalysisResponse analyze(@PathVariable Long userId) {
        return portfolioService.analyzePortfolio(userId);
    }

    // ➕ ADD HOLDING
    @PostMapping("/holding/{userId}")
    public String addHolding(@PathVariable Long userId,
                             @RequestBody HoldingRequest request) {
        portfolioService.addHolding(userId, request);
        return "Holding added successfully";
    }

    // 📥 GET HOLDINGS
    @GetMapping("/holding/{userId}")
    public List<Holding> getHoldings(@PathVariable Long userId) {
        return portfolioService.getUserHoldings(userId);
    }

    // ✏️ UPDATE HOLDING
    @PutMapping("/holding/{holdingId}")
    public String updateHolding(@PathVariable Long holdingId,
                                @RequestBody HoldingRequest request) {
        portfolioService.updateHolding(holdingId, request);
        return "Holding updated successfully";
    }

    // ❌ DELETE HOLDING
    @DeleteMapping("/holding/{holdingId}")
    public String deleteHolding(@PathVariable Long holdingId) {
        portfolioService.deleteHolding(holdingId);
        return "Holding deleted successfully";
    }
}