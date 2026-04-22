package com.shreyas.Ai_Trading_Coach_backend.controller;

import com.shreyas.Ai_Trading_Coach_backend.dto.request.TickerData;
import com.shreyas.Ai_Trading_Coach_backend.service.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "http://localhost:5173") // Allow React Frontend to connect!
public class MarketController {
    @Autowired
    private MarketService marketService;
    @GetMapping("/ticker")
    public List<TickerData> getLiveTicker() {
        return marketService.getLiveTickerData();
    }
}
