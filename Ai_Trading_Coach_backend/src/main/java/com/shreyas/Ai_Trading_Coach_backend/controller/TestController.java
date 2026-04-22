package com.shreyas.Ai_Trading_Coach_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {
    @GetMapping("/ai")
    public String testApi(){
        return "Spring Boot Running";
    }
}
