package com.shreyas.Ai_Trading_Coach_backend.controller;

import com.shreyas.Ai_Trading_Coach_backend.dto.request.TradeDTO;
import com.shreyas.Ai_Trading_Coach_backend.dto.request.TradeUploadRequest;
import com.shreyas.Ai_Trading_Coach_backend.dto.response.TradeAnalysisResponse;
import com.shreyas.Ai_Trading_Coach_backend.parser.TradeParserService;
import com.shreyas.Ai_Trading_Coach_backend.service.TradeService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/trade")
public class TradeController {

    private final TradeService tradeService;
    private final TradeParserService parserService;

    public TradeController(TradeService tradeService, TradeParserService parserService) {
        this.tradeService = tradeService;
        this.parserService = parserService;
    }

    // ✅ CSV Upload
    @PostMapping("/upload")
    public TradeAnalysisResponse uploadTrades(@RequestParam("file") MultipartFile file) {

        List<TradeDTO> trades = parserService.parseCSV(file);

        return tradeService.analyzeTrades(trades);
    }

    // ✅ Manual Input
    @PostMapping("/analyze")
    public TradeAnalysisResponse analyzeTrades(@RequestBody TradeUploadRequest request) {

        return tradeService.analyzeTrades(request.getTrades());
    }
}