-- =========================================================================
-- PROJECT: MediFind — Medicine Availability & Nearby Pharmacy Finder
-- SEED DATA: Chromepet and Chennai Demonstration Dataset
-- =========================================================================

USE medifind_db;

-- 1. SEED USERS
-- Password for mithra.admin@medifind.example is 'Admin@1234' (SHA256: bc78e58d55cde1346e68f8e5fe588dedf62fa457aa646a500a53347faff6ee24)
-- Password for priya.demo@medifind.example is 'User@1234' (SHA256: 1b992a2bb0984ad12a5efc86fb260801e275d71419c7b748b5ff33a497af8423)
INSERT INTO users (id, name, email, password_hash, role, phone) VALUES
(1, 'Mithra (Lead Administrator)', 'mithra.admin@medifind.example', 'bc78e58d55cde1346e68f8e5fe588dedf62fa457aa646a500a53347faff6ee24', 'ADMIN', '+91 98401 55667'),
(2, 'Priya Ramanathan (College Demo User)', 'priya.demo@medifind.example', '1b992a2bb0984ad12a5efc86fb260801e275d71419c7b748b5ff33a497af8423', 'USER', '+91 94441 22334'),
(3, 'Dr. K. Senthil Kumar (Chief Admin)', 'admin@medifind.org', 'bc78e58d55cde1346e68f8e5fe588dedf62fa457aa646a500a53347faff6ee24', 'ADMIN', '+91 98401 55667'),
(4, 'Priya (Student Account)', 'priya@student.edu', '1b992a2bb0984ad12a5efc86fb260801e275d71419c7b748b5ff33a497af8423', 'USER', '+91 94441 22334');

-- 2. SEED MEDICINES
INSERT INTO medicines (id, generic_name, brand_name, dosage_form, strength, category, description, prescription_required, is_active, verification_source) VALUES
(1, 'Paracetamol', 'Dolo 650', 'Tablet', '650 mg', 'Analgesic & Antipyretic', 'Relief of fever, headache, body aches, and mild to moderate pain.', FALSE, TRUE, 'Indian Pharmacopoeia / Micro Labs'),
(2, 'Paracetamol', 'Calpol 500', 'Tablet', '500 mg', 'Analgesic & Antipyretic', 'Antipyretic and analgesic for pain and fever control.', FALSE, TRUE, 'GSK Pharmaceuticals'),
(3, 'Amoxicillin and Potassium Clavulanate', 'Augmentin 625 Duo', 'Tablet', '500 mg + 125 mg', 'Antibacterial / Penicillin', 'Broad-spectrum antibiotic for respiratory, ENT, and dental infections.', TRUE, TRUE, 'GlaxoSmithKline Pharmaceuticals'),
(4, 'Azithromycin', 'Azithral 500', 'Tablet', '500 mg', 'Macrolide Antibiotic', 'Treatment of bacterial chest infections, tonsillitis, and sinusitis.', TRUE, TRUE, 'Alembic Pharmaceuticals'),
(5, 'Metformin Hydrochloride', 'Glycomet 500 SR', 'Sustained Release Tablet', '500 mg', 'Antidiabetic / Biguanide', 'Oral antidiabetic medication for managing Type 2 diabetes.', TRUE, TRUE, 'USV Private Limited'),
(6, 'Telmisartan', 'Telma 40', 'Tablet', '40 mg', 'Antihypertensive / ARB', 'Angiotensin II receptor antagonist for essential hypertension.', TRUE, TRUE, 'Glenmark Pharmaceuticals'),
(7, 'Pantoprazole Gastro-resistant', 'Pan 40', 'Tablet', '40 mg', 'Proton Pump Inhibitor (PPI)', 'Reduces stomach acid; for GERD, acid reflux, and gastric irritation.', TRUE, TRUE, 'Alkem Laboratories'),
(8, 'Montelukast Sodium and Levocetirizine Hydrochloride', 'Montair LC', 'Tablet', '10 mg + 5 mg', 'Antiallergic & Antiasthmatic', 'For allergic rhinitis, sneezing, watery eyes, and asthma symptoms.', TRUE, TRUE, 'Cipla Ltd'),
(9, 'Cetirizine Dihydrochloride', 'Cetzine 10', 'Tablet', '10 mg', 'Antihistamine', 'Non-sedating antihistamine for hives, allergies, and rhinitis.', FALSE, TRUE, 'Dr. Reddy Laboratories'),
(10, 'Salbutamol (Albuterol)', 'Asthalin Inhaler', 'Metered Dose Inhaler', '100 mcg/dose', 'Bronchodilator (Beta-2 Agonist)', 'Fast-acting relief inhaler for acute bronchospasm and asthma attacks.', TRUE, TRUE, 'Cipla Respiratory'),
(11, 'Atorvastatin Calcium', 'Atorva 10', 'Tablet', '10 mg', 'Lipid Lowering / Statin', 'HMG-CoA reductase inhibitor for reducing LDL cholesterol.', TRUE, TRUE, 'Zydus Cadila'),
(12, 'Oral Rehydration Salts (WHO Formula)', 'Electral Sachet', 'Powder / Oral Sachet', '21.8 g', 'Electrolytes & Rehydration', 'Restores vital electrolytes and fluids during dehydration.', FALSE, TRUE, 'FDC Ltd / WHO Formula'),
(13, 'Ibuprofen and Paracetamol', 'Combiflam', 'Tablet', '400 mg + 325 mg', 'NSAID & Analgesic', 'Dual action anti-inflammatory and pain reliever for joint pain.', FALSE, TRUE, 'Sanofi India'),
(14, 'Omeprazole', 'Omez 20', 'Capsule', '20 mg', 'Proton Pump Inhibitor (PPI)', 'Proton pump inhibitor for heartburn and ulcer prophylaxis.', TRUE, TRUE, 'Dr. Reddy Laboratories'),
(15, 'Budesonide and Formoterol Fumarate', 'Foracort 200 Inhaler', 'Metered Inhaler', '200 mcg + 6 mcg', 'Corticosteroid & LABA', 'Maintenance therapy for asthma and COPD.', TRUE, TRUE, 'Cipla Ltd');

-- 3. SEED PHARMACIES IN CHROMEPET AND NEARBY CHENNAI LOCALITIES
-- Chromepet benchmark coordinate is: 12.9516° N, 80.1462° E
INSERT INTO pharmacies (id, name, license_number, address_line, locality, city, state, pin_code, latitude, longitude, contact_phone, alternate_phone, email, opening_time, closing_time, is_24_hours, is_verified, is_active, verification_status, last_verified_at) VALUES
(1, 'Apollo Pharmacy - Chromepet GST Road', 'TN-CHE-2023-A04192', 'No. 142/2, Grand Southern Trunk Rd, Near MIT Overbridge', 'Chromepet', 'Chennai', 'Tamil Nadu', '600044', 12.9528000, 80.1465000, '+91 44 2223 8811', '+91 98400 12345', 'apollo.chromepet.gst@demopharmacy.in', '07:00 AM', '11:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-20 10:30:00'),
(2, 'MedPlus Pharmacy - Radha Nagar Main Road', 'TN-CHE-2022-M09321', 'Shop No. 18, Radha Nagar Main Rd, Next to Axis Bank ATM', 'Radha Nagar, Chromepet', 'Chennai', 'Tamil Nadu', '600044', 12.9561000, 80.1492000, '+91 44 2265 4420', '+91 94440 23456', 'medplus.radhanagar@demopharmacy.in', '08:00 AM', '10:30 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-22 14:15:00'),
(3, 'Netmeds Pharmacy Store - Hastinapuram', 'TN-CHE-2024-N01140', 'Plot 34, Hastinapuram Main Road, Opp. Bus Terminus', 'Hastinapuram, Chromepet', 'Chennai', 'Tamil Nadu', '600064', 12.9589000, 80.1558000, '+91 44 2277 5599', NULL, 'netmeds.hastinapuram@demopharmacy.in', '08:00 AM', '11:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-23 09:00:00'),
(4, 'Sri Balaji Medicals & General Store', 'TN-CHE-2018-B08761', 'No. 5, CLC Works Road, Near Chromepet Railway Station (West)', 'Chromepet Station West', 'Chennai', 'Tamil Nadu', '600044', 12.9508000, 80.1418000, '+91 44 2238 1290', NULL, NULL, '08:30 AM', '10:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-21 16:00:00'),
(5, '24x7 LifeCare Pharmacy - Sanatorium Junction', 'TN-CHE-2021-L03329', 'No. 88, GST Road, Tambaram Sanatorium (Opp. National Institute of Siddha)', 'Tambaram Sanatorium', 'Chennai', 'Tamil Nadu', '600047', 12.9421000, 80.1385000, '+91 44 2241 7700', '+91 98840 99881', 'lifecare247.sanatorium@demopharmacy.in', '00:00 AM', '11:59 PM', TRUE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 18:00:00'),
(6, 'Lakshmi Medicals & Surgicals', 'TN-CHE-2019-L04822', 'Corner Building, Chitlapakkam 2nd Main Road', 'Chitlapakkam', 'Chennai', 'Tamil Nadu', '600064', 12.9435000, 80.1532000, '+91 44 2223 4901', NULL, NULL, '08:00 AM', '10:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-19 11:45:00'),
(7, 'Apollo Pharmacy - Pallavaram High Road', 'TN-CHE-2022-A08910', 'No. 221, GST Road, Pallavaram', 'Pallavaram', 'Chennai', 'Tamil Nadu', '600043', 12.9678000, 80.1495000, '+91 44 2264 1155', NULL, NULL, '00:00 AM', '11:59 PM', TRUE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 12:00:00'),
(8, 'Cauvery Health & Pharmacy', 'TN-CHE-2020-C06432', 'No. 12, Nehru Nagar Main Road', 'Nehru Nagar, Chrompet', 'Chennai', 'Tamil Nadu', '600044', 12.9488000, 80.1499000, '+91 44 2238 6721', NULL, NULL, '09:00 AM', '09:30 PM', FALSE, FALSE, TRUE, 'PENDING_AUDIT', '2026-09-30 10:00:00'),
(9, 'Apollo Pharmacy - Sithalapakkam', 'TN-CHE-2023-A11029', 'No. 74, Mambakkam Main Road, Sithalapakkam Junction', 'Sithalapakkam', 'Chennai', 'Tamil Nadu', '600126', 12.8985000, 80.1872000, '+91 44 2278 1199', NULL, NULL, '07:30 AM', '10:30 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 14:00:00'),
(10, 'MedPlus Pharmacy - Keelkattalai', 'TN-CHE-2022-M07718', 'No. 18, Medavakkam Main Road, Near Bus Terminus', 'Keelkattalai', 'Chennai', 'Tamil Nadu', '600117', 12.9645000, 80.1815000, '+91 44 2247 8820', NULL, NULL, '08:00 AM', '11:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 16:30:00'),
(11, 'Guardian Healthcare & Pharmacy - Madipakkam', 'TN-CHE-2021-G04412', 'Shop 5, Madipakkam Koot Road, Near Bazaar Road', 'Madipakkam', 'Chennai', 'Tamil Nadu', '600091', 12.9623000, 80.1986000, '+91 44 2258 4110', NULL, NULL, '08:00 AM', '10:30 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-23 11:20:00'),
(12, 'Wellness Forever 24x7 - Velachery', 'TN-CHE-2024-W09110', 'Plot 89, Velachery Bypass Road, Opp. Grand Mall', 'Velachery', 'Chennai', 'Tamil Nadu', '600042', 12.9815000, 80.2180000, '+91 44 2243 9900', NULL, NULL, '00:00 AM', '11:59 PM', TRUE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-25 01:00:00'),
(13, 'Sri Sai Medicals & Surgicals - Medavakkam', 'TN-CHE-2020-S03391', 'No. 33, Tambaram-Velachery Main Road, Junction', 'Medavakkam', 'Chennai', 'Tamil Nadu', '600100', 12.9185000, 80.1923000, '+91 44 2277 8844', NULL, NULL, '08:30 AM', '10:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 18:15:00'),
(14, 'Guardian Pharmacy - Tambaram West', 'TN-CHE-2022-G02881', 'No. 12, Mudichur Road, Near Tambaram Bus Terminus', 'Tambaram', 'Chennai', 'Tamil Nadu', '600045', 12.9249000, 80.1278000, '+91 44 2226 7710', NULL, NULL, '08:00 AM', '11:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 15:00:00'),
(15, 'Apollo Pharmacy - Nanmangalam', 'TN-CHE-2023-A05519', 'Plot 42, Velachery Main Road, Nanmangalam Junction', 'Nanmangalam', 'Chennai', 'Tamil Nadu', '600129', 12.9352000, 80.1810000, '+91 44 2279 2211', NULL, NULL, '07:30 AM', '11:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 17:30:00'),
(16, 'MedPlus Pharmacy - Kovilambakkam', 'TN-CHE-2021-M06634', 'No. 8, 200 Feet Radial Road, Opp. Rose Nagar', 'Kovilambakkam', 'Chennai', 'Tamil Nadu', '600129', 12.9420000, 80.1915000, '+91 44 2249 3320', NULL, NULL, '08:00 AM', '10:30 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 12:00:00'),
(17, 'Health & Care Chemist - Pallikaranai', 'TN-CHE-2023-H07712', 'No. 95, Pallikaranai High Road, Near Marshland Park', 'Pallikaranai', 'Chennai', 'Tamil Nadu', '600100', 12.9376000, 80.2155000, '+91 44 2246 8810', NULL, NULL, '08:00 AM', '10:30 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 19:00:00'),
(18, 'Selaiyur Medicals & Surgicals', 'TN-CHE-2019-S04481', 'No. 64, Velachery Main Road, Selaiyur Near Bharat Univ.', 'Selaiyur', 'Chennai', 'Tamil Nadu', '600073', 12.9192000, 80.1450000, '+91 44 2229 1145', NULL, NULL, '08:00 AM', '10:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 16:00:00'),
(19, 'Apollo Pharmacy - East Tambaram MCC', 'TN-CHE-2022-A09923', 'No. 31, Station Road, Opp. Madras Christian College', 'East Tambaram', 'Chennai', 'Tamil Nadu', '600059', 12.9230000, 80.1385000, '+91 44 2239 5566', NULL, NULL, '07:00 AM', '11:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 18:00:00'),
(20, 'MedPlus Chemist - Camp Road Junction', 'TN-CHE-2021-M03345', 'Corner Plaza, Camp Road Junction, Selaiyur', 'Camp Road', 'Chennai', 'Tamil Nadu', '600073', 12.9150000, 80.1420000, '+91 44 2228 9900', NULL, NULL, '08:00 AM', '11:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 14:45:00'),
(21, 'LifeLine Medicals - Zamin Pallavaram', 'TN-CHE-2020-L06612', 'No. 19, Dharga Road, Zamin Pallavaram', 'Zamin Pallavaram', 'Chennai', 'Tamil Nadu', '600043', 12.9730000, 80.1550000, '+91 44 2266 1122', NULL, NULL, '08:30 AM', '10:30 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 11:15:00'),
(22, 'Sembakkam Care Pharmacy', 'TN-CHE-2022-S08831', 'No. 45, Velachery Main Road, Sembakkam Bus Stop', 'Sembakkam', 'Chennai', 'Tamil Nadu', '600073', 12.9255000, 80.1610000, '+91 44 2278 4400', NULL, NULL, '08:00 AM', '10:00 PM', FALSE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-24 16:20:00'),
(23, 'Global City 24x7 Pharmacy - Perumbakkam', 'TN-CHE-2024-G01129', 'Cheran Nagar, Near Gleneagles Global Health City', 'Perumbakkam', 'Chennai', 'Tamil Nadu', '600100', 12.9015000, 80.2010000, '+91 44 2277 9900', NULL, NULL, '00:00 AM', '11:59 PM', TRUE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-25 02:00:00'),
(24, 'Apollo Pharmacy 24x7 - Sholinganallur OMR', 'TN-CHE-2023-A09911', 'OMR Junction, Near Sholinganallur Signal, Rajiv Gandhi Salai', 'Sholinganallur', 'Chennai', 'Tamil Nadu', '600119', 12.8990000, 80.2280000, '+91 44 2450 8899', NULL, NULL, '00:00 AM', '11:59 PM', TRUE, TRUE, TRUE, 'DEMONSTRATION_RECORD', '2026-10-25 01:45:00');


-- 4. SEED INVENTORY AND STOCK LEVELS
-- Explicitly shows AVAILABLE with stock qty, OUT_OF_STOCK with qty 0, and omitted combinations (STOCK_STATUS_UNKNOWN)
INSERT INTO inventory (id, pharmacy_id, medicine_id, quantity, availability_status, unit_price, batch_number, expiry_date, source_verification, last_updated_at) VALUES
-- Dolo 650 (med_id: 1)
(1, 1, 1, 45, 'AVAILABLE', 32.50, 'DL-26A4', '2027-08-31', 'Direct POS Feed', '2026-10-24 10:30:00'),
(2, 2, 1, 60, 'AVAILABLE', 31.80, 'DL-26B1', '2027-09-30', 'Stock Audit', '2026-10-24 11:45:00'),
(3, 4, 1, 0, 'OUT_OF_STOCK', 32.00, 'DL-25Z9', '2027-05-31', 'Pharmacist Log', '2026-10-23 16:00:00'),
(4, 5, 1, 120, 'AVAILABLE', 33.00, 'DL-26C3', '2027-11-30', 'Verified POS', '2026-10-25 01:10:00'),

-- Augmentin 625 Duo (med_id: 3)
(5, 1, 3, 14, 'AVAILABLE', 204.00, 'AG-8841', '2027-04-30', 'Direct POS Feed', '2026-10-23 14:20:00'),
(6, 2, 3, 0, 'OUT_OF_STOCK', 202.50, 'AG-8812', '2027-03-31', 'Pharmacist Log', '2026-10-24 09:15:00'),
(7, 3, 3, 28, 'AVAILABLE', 201.00, 'AG-8899', '2027-06-30', 'System Sync', '2026-10-24 18:00:00'),

-- Azithral 500 (med_id: 4)
(8, 1, 4, 22, 'AVAILABLE', 135.00, 'AZ-4102', '2027-07-31', 'Direct POS Feed', '2026-10-24 12:00:00'),
(9, 5, 4, 18, 'AVAILABLE', 136.00, 'AZ-4190', '2027-08-31', 'Verified POS', '2026-10-25 02:00:00'),

-- Glycomet 500 SR (med_id: 5)
(10, 2, 5, 85, 'AVAILABLE', 48.00, 'GL-109', '2027-10-31', 'Stock Audit', '2026-10-24 15:30:00'),
(11, 4, 5, 30, 'AVAILABLE', 47.50, 'GL-102', '2027-09-30', 'Pharmacist Log', '2026-10-22 17:00:00'),

-- Telma 40 (med_id: 6)
(12, 1, 6, 50, 'AVAILABLE', 142.00, 'TL-552', '2027-12-31', 'Direct POS Feed', '2026-10-24 09:40:00'),
(13, 6, 6, 0, 'OUT_OF_STOCK', 140.00, 'TL-510', '2027-06-30', 'Stock Audit', '2026-10-21 18:00:00'),

-- Pan 40 (med_id: 7)
(14, 1, 7, 75, 'AVAILABLE', 160.00, 'PN-771', '2027-11-30', 'Direct POS Feed', '2026-10-24 10:00:00'),
(15, 2, 7, 40, 'AVAILABLE', 158.00, 'PN-740', '2027-10-31', 'Stock Audit', '2026-10-24 14:00:00'),
(16, 7, 7, 90, 'AVAILABLE', 160.00, 'PN-790', '2028-01-31', 'System Sync', '2026-10-24 20:00:00'),

-- Asthalin Inhaler (med_id: 10)
(17, 5, 10, 15, 'AVAILABLE', 148.00, 'AS-301', '2027-07-31', 'Verified POS', '2026-10-25 03:00:00'),
(18, 3, 10, 0, 'OUT_OF_STOCK', 146.50, 'AS-288', '2027-04-30', 'Stock Audit', '2026-10-23 11:00:00'),

-- Electral Sachet (med_id: 12)
(19, 1, 12, 110, 'AVAILABLE', 22.00, 'EL-901', '2028-03-31', 'Direct POS Feed', '2026-10-24 08:00:00'),
(20, 4, 12, 35, 'AVAILABLE', 21.50, 'EL-880', '2028-01-31', 'Pharmacist Log', '2026-10-22 15:00:00'),

-- Expanded Locality Records (Sithalapakkam, Keelkattalai, Madipakkam, Velachery, Medavakkam)
-- Sithalapakkam (pharmacy 9)
(21, 9, 1, 35, 'AVAILABLE', 32.50, 'DL-26ST', '2027-08-31', 'Direct POS Feed', '2026-10-24 14:00:00'),
(22, 9, 7, 20, 'AVAILABLE', 160.00, 'PN-782', '2027-11-30', 'Direct POS Feed', '2026-10-24 14:00:00'),
-- Keelkattalai (pharmacy 10)
(23, 10, 1, 50, 'AVAILABLE', 32.00, 'DL-26KL', '2027-09-30', 'Stock Audit', '2026-10-24 16:30:00'),
(24, 10, 4, 15, 'AVAILABLE', 135.00, 'AZ-4180', '2027-07-31', 'Stock Audit', '2026-10-24 16:30:00'),
-- Madipakkam (pharmacy 11)
(25, 11, 1, 40, 'AVAILABLE', 33.00, 'DL-26MP', '2027-10-31', 'System Sync', '2026-10-24 17:00:00'),
(26, 11, 3, 0, 'OUT_OF_STOCK', 205.00, 'AG-8830', '2027-05-31', 'System Sync', '2026-10-24 17:00:00'),
-- Velachery (pharmacy 12 - 24x7)
(27, 12, 1, 80, 'AVAILABLE', 33.00, 'DL-26VL', '2027-12-31', 'Verified POS', '2026-10-25 01:30:00'),
(28, 12, 3, 35, 'AVAILABLE', 204.00, 'AG-8910', '2027-07-31', 'Verified POS', '2026-10-25 01:30:00'),
-- Medavakkam (pharmacy 13)
(29, 13, 1, 45, 'AVAILABLE', 32.00, 'DL-26MD', '2027-09-30', 'Pharmacist Log', '2026-10-24 18:30:00'),
(30, 13, 5, 55, 'AVAILABLE', 47.50, 'GL-112', '2027-10-31', 'Pharmacist Log', '2026-10-24 18:30:00');
