package com.medifind.controller;

import com.medifind.model.Inventory;
import com.medifind.model.Medicine;
import com.medifind.service.InventoryService;
import com.medifind.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;
    private final InventoryService inventoryService;

    @Autowired
    public MedicineController(MedicineService medicineService, InventoryService inventoryService) {
        this.medicineService = medicineService;
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<?> getAllMedicines(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category) {
        List<Medicine> list = medicineService.getAllActiveMedicines(query, category);
        Map<String, Object> resp = new HashMap<>();
        resp.put("count", list.size());
        resp.put("medicines", list);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id)
                .map(med -> {
                    List<Inventory> stocks = inventoryService.getInventoryByMedicine(id);
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("medicine", med);
                    resp.put("pharmacyStock", stocks);
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMedicine(@RequestBody Medicine medicine) {
        if (medicine.getGenericName() == null || medicine.getBrandName() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Generic name and Brand name are required"));
        }
        Medicine created = medicineService.createMedicine(medicine);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Medicine added successfully",
                "medicine", created
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        return medicineService.updateMedicine(id, medicine)
                .map(updated -> ResponseEntity.ok(Map.of(
                        "message", "Medicine updated successfully",
                        "medicine", updated
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateMedicine(@PathVariable Long id) {
        boolean ok = medicineService.deactivateMedicine(id);
        if (ok) {
            return ResponseEntity.ok(Map.of("message", "Medicine deactivated successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
