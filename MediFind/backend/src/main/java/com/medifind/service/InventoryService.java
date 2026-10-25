package com.medifind.service;

import com.medifind.model.Inventory;
import com.medifind.model.Medicine;
import com.medifind.model.Pharmacy;
import com.medifind.repository.InventoryRepository;
import com.medifind.repository.MedicineRepository;
import com.medifind.repository.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final PharmacyRepository pharmacyRepository;
    private final MedicineRepository medicineRepository;

    @Autowired
    public InventoryService(InventoryRepository inventoryRepository,
                            PharmacyRepository pharmacyRepository,
                            MedicineRepository medicineRepository) {
        this.inventoryRepository = inventoryRepository;
        this.pharmacyRepository = pharmacyRepository;
        this.medicineRepository = medicineRepository;
    }

    public List<Inventory> getInventoryByPharmacy(Long pharmacyId) {
        return inventoryRepository.findByPharmacyId(pharmacyId);
    }

    public List<Inventory> getInventoryByMedicine(Long medicineId) {
        return inventoryRepository.findActiveStocksByMedicineId(medicineId);
    }

    @Transactional
    public Inventory upsertStock(Long pharmacyId, Long medicineId, Integer quantity,
                                 String status, BigDecimal unitPrice, String batchNumber,
                                 LocalDate expiryDate, String sourceVerification) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new IllegalArgumentException("Pharmacy not found with id: " + pharmacyId));
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found with id: " + medicineId));

        Optional<Inventory> existingOpt = inventoryRepository.findByPharmacyIdAndMedicineId(pharmacyId, medicineId);

        String computedStatus = status;
        if (computedStatus == null || computedStatus.trim().isEmpty()) {
            computedStatus = (quantity != null && quantity > 0) ? "AVAILABLE" : "OUT_OF_STOCK";
        }

        Inventory inventory;
        if (existingOpt.isPresent()) {
            inventory = existingOpt.get();
            inventory.setQuantity(quantity != null ? quantity : 0);
            inventory.setAvailabilityStatus(computedStatus);
            if (unitPrice != null && unitPrice.compareTo(BigDecimal.ZERO) > 0) {
                inventory.setUnitPrice(unitPrice);
            }
            if (batchNumber != null) inventory.setBatchNumber(batchNumber);
            if (expiryDate != null) inventory.setExpiryDate(expiryDate);
            if (sourceVerification != null) inventory.setSourceVerification(sourceVerification);
        } else {
            inventory = Inventory.builder()
                    .pharmacy(pharmacy)
                    .medicine(medicine)
                    .quantity(quantity != null ? quantity : 0)
                    .availabilityStatus(computedStatus)
                    .unitPrice(unitPrice != null ? unitPrice : BigDecimal.ZERO)
                    .batchNumber(batchNumber != null ? batchNumber : "BAT-DEMO")
                    .expiryDate(expiryDate != null ? expiryDate : LocalDate.now().plusYears(1))
                    .sourceVerification(sourceVerification != null ? sourceVerification : "Admin Entry")
                    .build();
        }

        return inventoryRepository.save(inventory);
    }
}
