package com.shreyas.Ai_Trading_Coach_backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HoldingRequest {

    private String symbol;
    private int quantity;
    @JsonProperty("buy_price")
    private double buy_price;
}