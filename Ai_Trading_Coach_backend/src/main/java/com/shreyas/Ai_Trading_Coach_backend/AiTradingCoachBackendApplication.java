package com.shreyas.Ai_Trading_Coach_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AiTradingCoachBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiTradingCoachBackendApplication.class, args);
	}

}
