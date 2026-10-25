package com.medifind.controller;

import com.medifind.dto.InventoryUpdateDTO;
import com.medifind.model.Inventory;
import com.medifind.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/upsert")
    public ResponseEntity<?> upsertInventory(@Valid @RequestBody InventoryUpdateDTO dto) {
        try {
            Inventory saved = inventoryService.upsertStock(
                    dto.getPharmacyId(),
                    dto.getMedicineId(),
                    dto.getQuantity(),
                    dto.getAvailabilityStatus(),
                    dto.getUnitPrice(),
                    dto.getBatchNumber(),
                    dto.getExpiryDate(),
                    dto.getSourceVerification()
            );
            return ResponseEntity.ok(Map.of(
                    "message", "Inventory updated successfully",
                    "inventory", saved
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
