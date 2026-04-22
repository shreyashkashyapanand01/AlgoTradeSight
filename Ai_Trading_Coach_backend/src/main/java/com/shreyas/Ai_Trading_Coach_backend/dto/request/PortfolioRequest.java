package com.shreyas.Ai_Trading_Coach_backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class PortfolioRequest {

    private List<HoldingRequest> holdings;
}