package com.medifind.repository;

import com.medifind.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByMedicineId(Long medicineId);

    List<Inventory> findByPharmacyId(Long pharmacyId);

    Optional<Inventory> findByPharmacyIdAndMedicineId(Long pharmacyId, Long medicineId);

    @Query("SELECT i FROM Inventory i WHERE i.medicine.id = :medicineId AND i.pharmacy.isActive = true")
    List<Inventory> findActiveStocksByMedicineId(@Param("medicineId") Long medicineId);
}
