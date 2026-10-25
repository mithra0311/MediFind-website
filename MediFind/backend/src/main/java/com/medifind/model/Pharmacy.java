package com.medifind.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pharmacies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "license_number", nullable = false, unique = true, length = 100)
    private String licenseNumber;

    @Column(name = "address_line", nullable = false)
    private String addressLine;

    @Column(nullable = false, length = 120)
    private String locality;

    @Column(nullable = false, length = 100)
    private String city = "Chennai";

    @Column(nullable = false, length = 100)
    private String state = "Tamil Nadu";

    @Column(name = "pin_code", nullable = false, length = 15)
    private String pinCode;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "contact_phone", nullable = false, length = 35)
    private String contactPhone;

    @Column(name = "alternate_phone", length = 35)
    private String alternatePhone;

    @Column(length = 191)
    private String email;

    @Column(name = "opening_time", length = 20)
    private String openingTime = "08:00 AM";

    @Column(name = "closing_time", length = 20)
    private String closingTime = "10:30 PM";

    @Column(name = "is_24_hours", nullable = false)
    private Boolean is24Hours = false;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = true;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "verification_status", nullable = false, length = 50)
    private String verificationStatus = "DEMONSTRATION_RECORD";

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Transient
    private Double distanceKm; // Transient calculated proximity distance

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
