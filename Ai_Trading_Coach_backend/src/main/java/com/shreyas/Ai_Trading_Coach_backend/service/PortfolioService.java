package com.shreyas.Ai_Trading_Coach_backend.service;

import com.shreyas.Ai_Trading_Coach_backend.dto.request.HoldingRequest;
import com.shreyas.Ai_Trading_Coach_backend.dto.request.PortfolioRequest;
import com.shreyas.Ai_Trading_Coach_backend.dto.response.PortfolioAnalysisResponse;
import com.shreyas.Ai_Trading_Coach_backend.entity.Holding;
import com.shreyas.Ai_Trading_Coach_backend.entity.User;
import com.shreyas.Ai_Trading_Coach_backend.repo.HoldingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.shreyas.Ai_Trading_Coach_backend.repo.UserRepository;

@Service
public class PortfolioService {

    private final HoldingRepository holdingRepository;
    private final AiServiceClient aiServiceClient;
    private final UserRepository userRepository;
    public PortfolioService(HoldingRepository holdingRepository,
                            AiServiceClient aiServiceClient, UserRepository userRepository) {
        this.holdingRepository = holdingRepository;
        this.aiServiceClient = aiServiceClient;
        this.userRepository = userRepository;
    }

    public PortfolioAnalysisResponse analyzePortfolio(Long userId) {

        // 1. Fetch from DB
        List<Holding> holdings = holdingRepository.findByUserId(userId);

        // 2. Convert to AI request
        List<HoldingRequest> requestList = holdings.stream().map(h -> {
            HoldingRequest r = new HoldingRequest();
            r.setSymbol(h.getSymbol());
            r.setQuantity(h.getQuantity());
            r.setBuy_price(h.getBuyPrice());
            return r;
        }).collect(Collectors.toList());

        PortfolioRequest request = new PortfolioRequest();
        request.setHoldings(requestList);

        // 3. Call AI
        return aiServiceClient.analyzePortfolio(request);
    }

    // ADD HOLDING
    public void addHolding(Long userId, HoldingRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Holding holding = new Holding();
        holding.setSymbol(request.getSymbol());
        holding.setQuantity(request.getQuantity());
        holding.setBuyPrice(request.getBuy_price());
        holding.setUser(user);

        holdingRepository.save(holding);
    }

    // GET ALL HOLDINGS
    public List<Holding> getUserHoldings(Long userId) {
        return holdingRepository.findByUserId(userId);
    }

    // UPDATE HOLDING
    public void updateHolding(Long holdingId, HoldingRequest request) {

        Holding holding = holdingRepository.findById(holdingId)
                .orElseThrow(() -> new RuntimeException("Holding not found"));

        holding.setSymbol(request.getSymbol());
        holding.setQuantity(request.getQuantity());
        holding.setBuyPrice(request.getBuy_price());

        holdingRepository.save(holding);
    }

    // DELETE HOLDING
    public void deleteHolding(Long holdingId) {
        holdingRepository.deleteById(holdingId);
    }
}