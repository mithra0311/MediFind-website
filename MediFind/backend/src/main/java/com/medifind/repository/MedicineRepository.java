package com.medifind.repository;

import com.medifind.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByIsActiveTrue();

    @Query("SELECT m FROM Medicine m WHERE m.isActive = true AND " +
           "(LOWER(m.genericName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(m.brandName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(m.category) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Medicine> searchMedicines(@Param("query") String query);

    List<Medicine> findByCategoryIgnoreCaseAndIsActiveTrue(String category);
}
