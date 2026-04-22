package com.shreyas.Ai_Trading_Coach_backend.controller;

import com.shreyas.Ai_Trading_Coach_backend.dto.response.StockResponse;
import com.shreyas.Ai_Trading_Coach_backend.service.StockService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/stock")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    //  Analyze stock
    @GetMapping("/{symbol}")
    public StockResponse analyzeStock(@PathVariable String symbol) {
        return stockService.analyze(symbol);
    }

}