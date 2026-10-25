# MediFind — Medicine Availability & Nearby Pharmacy Finder

A complete, full-stack college team project designed to search for medicines and discover nearby pharmacies stocking them, calculating proximity distances and displaying accurate stock-status tiers.

Target demonstration region: **Chromepet, Chennai, Tamil Nadu, India** (with support for surrounding localities such as Radha Nagar, Hastinapuram, Tambaram Sanatorium, Chitlapakkam, and Pallavaram).

---

## 1. Architecture Overview

- **Frontend**: Responsive HTML5, CSS3, JavaScript (Vanilla ES6), Geolocation API, Google Maps Directions Integration.
- **Backend**: Java 21 / Spring Boot 3.2.x REST API with Spring Data JPA & Hibernate.
- **Database**: MySQL 8.0+ Relational Database (InnoDB) with Foreign Key constraints and B-Tree indexes.
- **Build Tool**: Apache Maven 3.9+.
- **Distance Metric**: Great-circle proximity via the **Haversine Formula** in kilometres.
- **Stock Tracking Policy**:
  - `AVAILABLE`: Confirmed quantity in stock with verified price.
  - `OUT_OF_STOCK`: Pharmacist confirmed stock depleted (qty 0).
  - `STOCK_STATUS_UNKNOWN`: Pharmacy is within distance radius, but has no verified stock log for this item (user is advised to call ahead).

---

## 2. Project Directory Structure

```
MediFind/
├── frontend/
│   ├── index.html          # Main citizen search & proximity view
│   ├── login.html           # Authentication login
│   ├── register.html        # User account registration
│   ├── admin.html           # Admin inventory & catalogue manager
│   ├── css/
│   │   └── style.css        # Clean medical design system
│   └── js/
│       ├── api.js           # REST API client
│       ├── app.js           # Distance ranking & stock categorization
│       └── admin.js         # Inventory CRUD & CSV bulk upload
├── backend/
│   ├── pom.xml              # Maven configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/medifind/
│       │   │   ├── MediFindApplication.java
│       │   │   ├── config/CorsConfig.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── MedicineController.java
│       │   │   │   ├── PharmacyController.java
│       │   │   │   ├── InventoryController.java
│       │   │   │   └── SearchController.java
│       │   │   ├── dto/*.java
│       │   │   ├── model/
│       │   │   │   ├── Medicine.java
│       │   │   │   ├── Pharmacy.java
│       │   │   │   ├── Inventory.java
│       │   │   │   ├── User.java
│       │   │   │   └── SearchLog.java
│       │   │   ├── repository/*.java
│       │   │   └── service/
│       │   │       ├── DistanceCalculationService.java
│       │   │       ├── MedicineService.java
│       │   │       ├── PharmacyService.java
│       │   │       ├── InventoryService.java
│       │   │       └── AuthService.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/java/com/medifind/MediFindApplicationTests.java
├── database/
│   ├── schema.sql           # MySQL DDL with FOREIGN KEYS & INDEXES
│   └── seed.sql             # Chromepet & Chennai demonstration records
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Database Setup (MySQL)

1. Ensure MySQL Server 8.0+ is running.
2. Open MySQL CLI or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
3. Run the schema creation script:
   ```sql
   source /path/to/MediFind/database/schema.sql;
   ```
4. Populate demonstration data for Chromepet and Chennai:
   ```sql
   source /path/to/MediFind/database/seed.sql;
   ```
5. Verify created tables:
   ```sql
   USE medifind_db;
   SHOW TABLES;
   SELECT COUNT(*) FROM medicines;
   SELECT COUNT(*) FROM pharmacies;
   SELECT COUNT(*) FROM inventory;
   ```

---

## 4. Backend Setup & Run (Java Spring Boot)

1. Open `MediFind/backend/src/main/resources/application.properties`.
2. Configure your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/medifind_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```
3. In terminal, navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
4. Build the project using Maven:
   ```bash
   mvn clean install
   ```
5. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
6. The REST API will be accessible at `http://localhost:8080/api`.

---

## 5. Frontend Setup

1. The frontend consists of standard HTML5, CSS3, and modern JavaScript.
2. Open `MediFind/frontend/index.html` in any browser, or use VS Code extension **Live Server** (Right click `index.html` -> "Open with Live Server").
3. By default, `api.js` points to `http://localhost:8080/api`.

---

## 6. Seed Credentials (College Demo)

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator (Mithra)** | `mithra.admin@medifind.example` | `Admin@1234` | Full CRUD on medicines, pharmacies, inventory, and CSV imports |
| **Citizen User (Priya)** | `priya.demo@medifind.example` | `User@1234` | Medicine search, stock view, directions, search history |
| **Legacy Admin** | `admin@medifind.org` | `Admin@1234` | Administrator access |
| **Legacy Student** | `priya@student.edu` | `User@1234` | Standard user access |

---

## 7. REST API Endpoints Reference

### Public Endpoints:
- `GET /api/search?query={term}&lat={lat}&lng={lng}&radius={km}`: Search medicines and find categorized nearby pharmacies (Confirmed In Stock, Out of Stock, Unknown).
- `GET /api/medicines`: List all active medicines. Supports `?query=` and `?category=`.
- `GET /api/medicines/{id}`: Detailed medicine info with current pharmacy stock listings.
- `GET /api/pharmacies`: List pharmacies sorted by proximity to given latitude/longitude.
- `GET /api/pharmacies/{id}`: Detailed pharmacy information and inventory.

### Authentication:
- `POST /api/auth/login`: Authenticate with `{ email, password }`.
- `POST /api/auth/register`: Create citizen account `{ name, email, password, phone }`.

### Administrative (Protected):
- `POST /api/medicines`: Add new medicine to catalogue.
- `PUT /api/medicines/{id}`: Update medicine details.
- `DELETE /api/medicines/{id}`: Deactivate medicine.
- `POST /api/pharmacies`: Register new pharmacy.
- `POST /api/inventory/upsert`: Update stock level, quantity, status, and price.

---

## 8. College Viva Voce & Presentation Talking Points

1. **How is distance calculated?**
   MediFind uses the **Haversine Formula**:
   $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
   Where $R = 6371\text{ km}$. This accounts for the spherical curvature of the Earth and gives millimetre precision for municipal distances.

2. **Why does MediFind have three stock states instead of just Yes/No?**
   In real healthcare informatics, assuming unverified pharmacies either have or don't have a drug is misleading. By distinguishing **Available (Confirmed)**, **Out of Stock**, and **Stock Status Unknown (Call Ahead)**, we prevent patients from making futile trips while still showing nearby alternative chemists.

3. **How does the database scale?**
   The relational schema isolates `medicines` and `pharmacies` with a many-to-many junction table `inventory`. Compound unique index `(pharmacy_id, medicine_id)` ensures fast O(1) lookups and prevents duplicate stock rows.
