package com.medifind.service;

import com.medifind.model.Medicine;
import com.medifind.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    @Autowired
    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    public List<Medicine> getAllActiveMedicines(String query, String category) {
        if (query != null && !query.trim().isEmpty()) {
            return medicineRepository.searchMedicines(query.trim());
        }
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            return medicineRepository.findByCategoryIgnoreCaseAndIsActiveTrue(category.trim());
        }
        return medicineRepository.findByIsActiveTrue();
    }

    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }

    @Transactional
    public Medicine createMedicine(Medicine medicine) {
        medicine.setIsActive(true);
        return medicineRepository.save(medicine);
    }

    @Transactional
    public Optional<Medicine> updateMedicine(Long id, Medicine updated) {
        return medicineRepository.findById(id).map(existing -> {
            existing.setGenericName(updated.getGenericName());
            existing.setBrandName(updated.getBrandName());
            existing.setDosageForm(updated.getDosageForm());
            existing.setStrength(updated.getStrength());
            existing.setCategory(updated.getCategory());
            existing.setDescription(updated.getDescription());
            existing.setPrescriptionRequired(updated.getPrescriptionRequired());
            existing.setVerificationSource(updated.getVerificationSource());
            return medicineRepository.save(existing);
        });
    }

    @Transactional
    public boolean deactivateMedicine(Long id) {
        return medicineRepository.findById(id).map(med -> {
            med.setIsActive(false);
            medicineRepository.save(med);
            return true;
        }).orElse(false);
    }
}
