package com.shreyas.Ai_Trading_Coach_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class TradeUploadRequest {

    private List<TradeDTO> trades;

}