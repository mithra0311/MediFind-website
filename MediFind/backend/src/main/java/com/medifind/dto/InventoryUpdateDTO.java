package com.medifind.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InventoryUpdateDTO {
    @NotNull(message = "Pharmacy ID is required")
    private Long pharmacyId;

    @NotNull(message = "Medicine ID is required")
    private Long medicineId;

    private Integer quantity;
    private String availabilityStatus; // AVAILABLE, OUT_OF_STOCK, STOCK_STATUS_UNKNOWN
    private BigDecimal unitPrice;
    private String batchNumber;
    private LocalDate expiryDate;
    private String sourceVerification;
}
