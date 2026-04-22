package com.shreyas.Ai_Trading_Coach_backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TradeDTO {

    private String symbol;
    @JsonProperty("entry_price")
    private double entryPrice;

    @JsonProperty("exit_price")
    private double exitPrice;

    private int quantity;

    private String type;
    private String side;

    @JsonProperty("holdingMinutes")
    private double holdingMinutes;

    @JsonProperty("profitLoss")
    private double profitLoss;
    // Getters & Setters

}