package com.medifind.controller;

import com.medifind.model.Inventory;
import com.medifind.model.Pharmacy;
import com.medifind.service.InventoryService;
import com.medifind.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacies")
public class PharmacyController {

    private final PharmacyService pharmacyService;
    private final InventoryService inventoryService;

    @Autowired
    public PharmacyController(PharmacyService pharmacyService, InventoryService inventoryService) {
        this.pharmacyService = pharmacyService;
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPharmacies(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double radius,
            @RequestParam(required = false, defaultValue = "false") boolean all) {
        List<Pharmacy> list = pharmacyService.getAllPharmacies(lat, lng, radius, !all);
        Map<String, Object> resp = new HashMap<>();
        resp.put("count", list.size());
        resp.put("pharmacies", list);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPharmacyById(@PathVariable Long id) {
        return pharmacyService.getPharmacyById(id)
                .map(pharm -> {
                    List<Inventory> inv = inventoryService.getInventoryByPharmacy(id);
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("pharmacy", pharm);
                    resp.put("inventory", inv);
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPharmacy(@RequestBody Pharmacy pharmacy) {
        if (pharmacy.getName() == null || pharmacy.getAddressLine() == null ||
            pharmacy.getLatitude() == null || pharmacy.getLongitude() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name, address, latitude, and longitude are required"));
        }
        Pharmacy created = pharmacyService.createPharmacy(pharmacy);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Pharmacy created successfully",
                "pharmacy", created
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePharmacy(@PathVariable Long id, @RequestBody Pharmacy pharmacy) {
        return pharmacyService.updatePharmacy(id, pharmacy)
                .map(updated -> ResponseEntity.ok(Map.of(
                        "message", "Pharmacy updated successfully",
                        "pharmacy", updated
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivatePharmacy(@PathVariable Long id) {
        boolean ok = pharmacyService.deactivatePharmacy(id);
        if (ok) {
            return ResponseEntity.ok(Map.of("message", "Pharmacy deactivated successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
