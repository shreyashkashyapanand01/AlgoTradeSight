package com.shreyas.Ai_Trading_Coach_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TickerData {
    private String symbol;
    private String price;
    private String change;
    private boolean isUp;
    // Constructors
    public TickerData(String symbol, String price, String change, boolean isUp) {
        this.symbol = symbol;
        this.price = price;
        this.change = change;
        this.isUp = isUp;
    }
}
