-- =========================================================================
-- PROJECT: MediFind — Medicine Availability & Nearby Pharmacy Finder
-- DATABASE: MySQL 8.0+ Relational Schema (InnoDB)
-- Team College Project Database Architecture
-- =========================================================================

CREATE DATABASE IF NOT EXISTS medifind_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE medifind_db;

-- Drop tables in reverse order of foreign key dependency if re-running
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS search_logs;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS pharmacies;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------------------------
-- TABLE 1: users
-- Manages citizen users and authorized pharmacy/system administrators
-- -------------------------------------------------------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    phone VARCHAR(30) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- TABLE 2: medicines
-- Comprehensive catalogue of generic medicines and branded pharmaceutical formulations
-- -------------------------------------------------------------------------
CREATE TABLE medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    generic_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    dosage_form VARCHAR(80) NOT NULL COMMENT 'Tablet, Capsule, Syrup, Inhaler, Sachet, Injection',
    strength VARCHAR(80) NOT NULL COMMENT 'e.g. 650mg, 500mg+125mg, 100mcg/puff',
    category VARCHAR(120) NOT NULL COMMENT 'e.g. Analgesic, Antibiotic, Antidiabetic, Antihypertensive',
    description TEXT NULL,
    prescription_required BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'True for Schedule H / H1 / X medications',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    verification_source VARCHAR(255) DEFAULT 'National Pharmacopoeia / Drug Formulary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_med_generic (generic_name),
    INDEX idx_med_brand (brand_name),
    INDEX idx_med_category (category),
    INDEX idx_med_active (is_active)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- TABLE 3: pharmacies
-- Registered brick-and-mortar pharmacies with precise geo-coordinates
-- (Default demonstration dataset centered around Chromepet, Chennai)
-- -------------------------------------------------------------------------
CREATE TABLE pharmacies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    address_line VARCHAR(255) NOT NULL,
    locality VARCHAR(120) NOT NULL COMMENT 'e.g. Chromepet, Radha Nagar, Hastinapuram',
    city VARCHAR(100) NOT NULL DEFAULT 'Chennai',
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    pin_code VARCHAR(15) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    contact_phone VARCHAR(35) NOT NULL,
    alternate_phone VARCHAR(35) NULL,
    email VARCHAR(191) NULL,
    opening_time VARCHAR(20) DEFAULT '08:00 AM',
    closing_time VARCHAR(20) DEFAULT '10:30 PM',
    is_24_hours BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    verification_status ENUM('VERIFIED', 'DEMONSTRATION_RECORD', 'PENDING_AUDIT') NOT NULL DEFAULT 'DEMONSTRATION_RECORD',
    last_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pharm_locality (locality),
    INDEX idx_pharm_city (city),
    INDEX idx_pharm_coords (latitude, longitude),
    INDEX idx_pharm_active (is_active)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- TABLE 4: inventory
-- Relational junction establishing stock tracking and pricing per pharmacy
-- -------------------------------------------------------------------------
CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pharmacy_id BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    availability_status ENUM('AVAILABLE', 'OUT_OF_STOCK', 'STOCK_STATUS_UNKNOWN') NOT NULL DEFAULT 'STOCK_STATUS_UNKNOWN',
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Price in INR (₹)',
    batch_number VARCHAR(80) NULL,
    expiry_date DATE NULL,
    source_verification VARCHAR(150) DEFAULT 'Pharmacist Portal Entry',
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_pharmacy FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id) ON DELETE CASCADE,
    CONSTRAINT fk_inv_medicine FOREIGN KEY (medicine_id) REFERENCES medicines (id) ON DELETE CASCADE,
    CONSTRAINT uq_pharm_medicine UNIQUE (pharmacy_id, medicine_id),
    INDEX idx_inv_status (availability_status),
    INDEX idx_inv_qty (quantity)
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- TABLE 5: search_logs
-- Query analytics and proximity search audit trail
-- -------------------------------------------------------------------------
CREATE TABLE search_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    search_query VARCHAR(255) NOT NULL,
    user_latitude DECIMAL(10, 7) NULL,
    user_longitude DECIMAL(10, 7) NULL,
    results_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_search_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_search_query (search_query),
    INDEX idx_search_time (created_at)
) ENGINE=InnoDB;
