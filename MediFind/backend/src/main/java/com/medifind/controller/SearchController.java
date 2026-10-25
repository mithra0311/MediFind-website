package com.medifind.controller;

import com.medifind.dto.SearchResponseDTO;
import com.medifind.model.Inventory;
import com.medifind.model.Medicine;
import com.medifind.model.Pharmacy;
import com.medifind.repository.InventoryRepository;
import com.medifind.repository.MedicineRepository;
import com.medifind.repository.PharmacyRepository;
import com.medifind.service.DistanceCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final MedicineRepository medicineRepository;
    private final PharmacyRepository pharmacyRepository;
    private final InventoryRepository inventoryRepository;
    private final DistanceCalculationService distanceCalculationService;

    @Autowired
    public SearchController(MedicineRepository medicineRepository,
                            PharmacyRepository pharmacyRepository,
                            InventoryRepository inventoryRepository,
                            DistanceCalculationService distanceCalculationService) {
        this.medicineRepository = medicineRepository;
        this.pharmacyRepository = pharmacyRepository;
        this.inventoryRepository = inventoryRepository;
        this.distanceCalculationService = distanceCalculationService;
    }

    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam String query,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false, defaultValue = "10.0") Double radius) {

        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Search query is required"));
        }

        List<Medicine> matched = medicineRepository.searchMedicines(query.trim());
        if (matched.isEmpty()) {
            return ResponseEntity.ok(SearchResponseDTO.builder()
                    .matchedMedicines(Collections.emptyList())
                    .primaryMedicine(null)
                    .confirmedAvailable(Collections.emptyList())
                    .outOfStock(Collections.emptyList())
                    .unknownStock(Collections.emptyList())
                    .radiusKm(radius)
                    .totalPharmaciesEvaluated(0)
                    .build());
        }

        Medicine primary = matched.get(0);
        List<Inventory> inventories = inventoryRepository.findByMedicineId(primary.getId());
        Map<Long, Inventory> invMap = inventories.stream()
                .collect(Collectors.toMap(inv -> inv.getPharmacy().getId(), inv -> inv, (a, b) -> a));

        List<Pharmacy> allPharmacies = pharmacyRepository.findByIsActiveTrue();

        List<SearchResponseDTO.PharmacyStockDTO> availableList = new ArrayList<>();
        List<SearchResponseDTO.PharmacyStockDTO> outOfStockList = new ArrayList<>();
        List<SearchResponseDTO.PharmacyStockDTO> unknownList = new ArrayList<>();

        for (Pharmacy p : allPharmacies) {
            Double dist = null;
            if (lat != null && lng != null) {
                dist = distanceCalculationService.calculateDistanceKm(
                        lat, lng,
                        p.getLatitude().doubleValue(),
                        p.getLongitude().doubleValue()
                );
            }

            if (dist != null && radius != null && dist > radius) {
                continue; // outside radius
            }

            Inventory inv = invMap.get(p.getId());

            SearchResponseDTO.StockDetailsDTO stockDto;
            if (inv != null) {
                stockDto = SearchResponseDTO.StockDetailsDTO.builder()
                        .status(inv.getAvailabilityStatus())
                        .quantity(inv.getQuantity())
                        .unitPrice(inv.getUnitPrice())
                        .batchNumber(inv.getBatchNumber())
                        .lastUpdatedAt(inv.getLastUpdatedAt() != null ? inv.getLastUpdatedAt().toString() : null)
                        .sourceVerification(inv.getSourceVerification())
                        .build();
            } else {
                stockDto = SearchResponseDTO.StockDetailsDTO.builder()
                        .status("STOCK_STATUS_UNKNOWN")
                        .quantity(0)
                        .unitPrice(null)
                        .lastUpdatedAt(null)
                        .sourceVerification("No active stock feed for this item")
                        .build();
            }

            SearchResponseDTO.PharmacyStockDTO pharmDto = SearchResponseDTO.PharmacyStockDTO.builder()
                    .pharmacyId(p.getId())
                    .pharmacyName(p.getName())
                    .address(p.getAddressLine())
                    .locality(p.getLocality())
                    .city(p.getCity())
                    .pinCode(p.getPinCode())
                    .latitude(p.getLatitude())
                    .longitude(p.getLongitude())
                    .contactPhone(p.getContactPhone())
                    .alternatePhone(p.getAlternatePhone())
                    .openingTime(p.getOpeningTime())
                    .closingTime(p.getClosingTime())
                    .is24Hours(p.getIs24Hours())
                    .isVerified(p.getIsVerified())
                    .verificationStatus(p.getVerificationStatus())
                    .distanceKm(dist)
                    .inventory(stockDto)
                    .build();

            if (inv != null && "AVAILABLE".equalsIgnoreCase(inv.getAvailabilityStatus()) && inv.getQuantity() > 0) {
                availableList.add(pharmDto);
            } else if (inv != null && ("OUT_OF_STOCK".equalsIgnoreCase(inv.getAvailabilityStatus()) || inv.getQuantity() == 0)) {
                outOfStockList.add(pharmDto);
            } else {
                unknownList.add(pharmDto);
            }
        }

        // Sort by distance
        Comparator<SearchResponseDTO.PharmacyStockDTO> distComp =
                Comparator.comparing(SearchResponseDTO.PharmacyStockDTO::getDistanceKm, Comparator.nullsLast(Double::compareTo));
        availableList.sort(distComp);
        outOfStockList.sort(distComp);
        unknownList.sort(distComp);

        SearchResponseDTO response = SearchResponseDTO.builder()
                .matchedMedicines(matched)
                .primaryMedicine(primary)
                .confirmedAvailable(availableList)
                .outOfStock(outOfStockList)
                .unknownStock(unknownList)
                .radiusKm(radius)
                .totalPharmaciesEvaluated(allPharmacies.size())
                .build();

        return ResponseEntity.ok(response);
    }
}
