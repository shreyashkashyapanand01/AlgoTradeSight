package com.shreyas.Ai_Trading_Coach_backend.parser;

import com.shreyas.Ai_Trading_Coach_backend.dto.request.TradeDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class TradeParserService {

    public List<TradeDTO> parseCSV(MultipartFile file) {

        List<TradeDTO> trades = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {

            String line;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {

                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                String[] data = line.split(",");

                TradeDTO trade = new TradeDTO();
                trade.setSymbol(data[0]);
                trade.setEntryPrice(Double.parseDouble(data[1]));
                trade.setExitPrice(Double.parseDouble(data[2]));
                trade.setQuantity(Integer.parseInt(data[3]));
                trade.setType(data[4]);
                trade.setSide(data[5]);
                trade.setHoldingMinutes(Double.parseDouble(data[6]));
                trade.setProfitLoss(Double.parseDouble(data[7]));

                trades.add(trade);
            }

        } catch (Exception e) {
            throw new RuntimeException("Error parsing CSV file");
        }

        return trades;
    }
}