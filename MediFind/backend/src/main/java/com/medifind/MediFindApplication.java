package com.medifind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for MediFind Spring Boot Application.
 * MediFind: Medicine Availability and Nearby Pharmacy Finder
 */
@SpringBootApplication
public class MediFindApplication {

    public static void main(String[] args) {
        SpringApplication.run(MediFindApplication.class, args);
        System.out.println("==========================================================");
        System.out.println(" MediFind Backend REST API started on http://localhost:8080");
        System.out.println(" Target Region: Chromepet & Chennai Localities");
        System.out.println("==========================================================");
    }
}
