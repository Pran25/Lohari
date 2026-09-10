package com.lohari;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LohariBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LohariBackendApplication.class, args);
		
		System.out.println("==========================================");
		System.out.println("🏗️  LOHARI BACKEND STARTED SUCCESSFULLY!");
		System.out.println("==========================================");
		System.out.println("📡 API Base URL: http://localhost:8081");
		System.out.println("==========================================");
	}

}
