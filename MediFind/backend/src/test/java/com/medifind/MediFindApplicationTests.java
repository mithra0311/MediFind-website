package com.medifind;

import com.medifind.service.DistanceCalculationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MediFindApplicationTests {

    private final DistanceCalculationService distanceService = new DistanceCalculationService();

    @Test
    @DisplayName("Verify Haversine distance between Chromepet GST and Radha Nagar")
    void testHaversineDistanceCalculation() {
        // Chromepet GST: 12.9528, 80.1465
        // Radha Nagar: 12.9561, 80.1492
        double distance = distanceService.calculateDistanceKm(12.9528, 80.1465, 12.9561, 80.1492);
        assertTrue(distance > 0.3 && distance < 0.6, "Distance between Chromepet GST and Radha Nagar should be ~0.46 km");
    }

    @Test
    @DisplayName("Zero distance for identical coordinates")
    void testZeroDistanceForSameLocation() {
        double distance = distanceService.calculateDistanceKm(12.9516, 80.1462, 12.9516, 80.1462);
        assertEquals(0.0, distance, 0.001);
    }
}
