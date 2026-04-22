package com.shreyas.Ai_Trading_Coach_backend.dto.response;


import com.shreyas.Ai_Trading_Coach_backend.dto.Opportunity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.io.Serializable;

@Setter
@Getter
public class ScanResponse implements Serializable {

    private List<Opportunity> opportunities;

}