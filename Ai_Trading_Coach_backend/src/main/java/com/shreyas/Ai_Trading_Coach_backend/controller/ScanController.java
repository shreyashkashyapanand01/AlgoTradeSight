package com.shreyas.Ai_Trading_Coach_backend.controller;

import com.shreyas.Ai_Trading_Coach_backend.dto.response.ScanResponse;
import com.shreyas.Ai_Trading_Coach_backend.service.ScanService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stock")
public class ScanController {
    private final ScanService scanService;

    public ScanController(ScanService scanService) {
        this.scanService = scanService;
    }

    @GetMapping("/scan")
    public ScanResponse scanMarket() {
        return scanService.scanMarket();
    }
}
