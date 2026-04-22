package com.shreyas.Ai_Trading_Coach_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class Opportunity implements Serializable {

    private String symbol;
    private String sector;
    private double score;
    private double momentum;
    private String summary;

}