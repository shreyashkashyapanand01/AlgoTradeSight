package com.shreyas.Ai_Trading_Coach_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shreyas.Ai_Trading_Coach_backend.dto.request.TickerData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

//import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@EnableScheduling
@Slf4j
public class MarketService {
    @Value("${alphavantage.api.key:demo}")
    private String API_KEY;

    @Value("${app.market.symbols}")
    private List<String> SYMBOLS;

    // The memory cache for the React UI
    private final List<TickerData> cachedTickerData = new ArrayList<>();

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    // The React frontend calls this endpoint to get deep, instant cache data
    public List<TickerData> getLiveTickerData() {
        if (cachedTickerData.isEmpty()) {
            return getFallbackData(); // Return mock data while server slowly warms up
        }
        return new ArrayList<>(cachedTickerData);
    }
    // Runs every 6 Hours (fixedRate = 21600000 ms)
    @Scheduled(fixedRate = 21600000)
    public void fetchAllStocksEverySixHours() {
        log.info("⏳ Starting 6-Hour Market Data Fetch Cycle...");
        for (String symbol : SYMBOLS) {
            try {
                String url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + API_KEY;
                String response = restTemplate.getForObject(url, String.class);
                JsonNode quote = objectMapper.readTree(response).path("Global Quote");
                
                if (!quote.isMissingNode() && quote.has("05. price")) {
                    BigDecimal price = new BigDecimal(quote.get("05. price").asText());
                    BigDecimal changePct = new BigDecimal(quote.get("10. change percent").asText().replace("%", ""));
                    boolean isUp = changePct.compareTo(BigDecimal.ZERO) > 0;
                    TickerData newData = new TickerData(
                            symbol.replace(".BSE", ""),
                            String.format("%,.2f", price),
                            String.format("%s%.2f%%", isUp ? "+" : "", changePct),
                            isUp
                    );
                    updateCache(newData);
                    log.info("✅ Successfully fetched: {}", symbol);
                } else {
                    log.warn("⚠️ Rate limit or invalid JSON for: {}. Response: {}", symbol, response);
                }
                
                // Still using a sleep to respect the free-tier API rate limits (5 calls/min)
                // but wrapped in a slightly cleaner approach inside the loop.
                Thread.sleep(15000); 
            } catch (InterruptedException ie) {
                log.error("❌ Yielding fetch cycle due to interruption");
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                log.error("❌ Network failed for {}: {}", symbol, e.getMessage());
            }
        }
        log.info("✅ Finished 6-Hour Fetch Cycle! Cache is fully loaded.");
    }
    private synchronized void updateCache(TickerData newData) {
        cachedTickerData.removeIf(t -> t.getSymbol().equals(newData.getSymbol()));
        cachedTickerData.add(newData);
    }
    // Temporary Fallback Data until the slow 15-second loops finish bringing in the real data
    private List<TickerData> getFallbackData() {
        return List.of(
                new TickerData("NIFTY 50", "22,500.45", "+0.45%", true),
                new TickerData("RELIANCE", "2,950.20", "+1.20%", true),
                new TickerData("HDFCBANK", "1,520.45", "-0.50%", false),
                new TickerData("TCS", "4,050.15", "+0.10%", true)
        );
    }
}