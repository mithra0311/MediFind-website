package com.medifind.dto;

import com.medifind.model.Medicine;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class SearchResponseDTO {
    private List<Medicine> matchedMedicines;
    private Medicine primaryMedicine;
    private List<PharmacyStockDTO> confirmedAvailable;
    private List<PharmacyStockDTO> outOfStock;
    private List<PharmacyStockDTO> unknownStock;
    private Double radiusKm;
    private Integer totalPharmaciesEvaluated;

    @Data
    @Builder
    public static class PharmacyStockDTO {
        private Long pharmacyId;
        private String pharmacyName;
        private String address;
        private String locality;
        private String city;
        private String pinCode;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String contactPhone;
        private String alternatePhone;
        private String openingTime;
        private String closingTime;
        private Boolean is24Hours;
        private Boolean isVerified;
        private String verificationStatus;
        private Double distanceKm;
        private StockDetailsDTO inventory;
    }

    @Data
    @Builder
    public static class StockDetailsDTO {
        private String status; // AVAILABLE, OUT_OF_STOCK, STOCK_STATUS_UNKNOWN
        private Integer quantity;
        private BigDecimal unitPrice;
        private String batchNumber;
        private String lastUpdatedAt;
        private String sourceVerification;
    }
}
