import React, { useState } from 'react';
import { X, Download, Database, Server, Code, FileText, CheckCircle2, Copy } from 'lucide-react';

interface CollegeDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeDocsModal: React.FC<CollegeDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'database' | 'viva' | 'setup'>('architecture');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/MediFind.zip';
    link.download = 'MediFind.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schemaSnippet = `-- MediFind Relational Database Schema
CREATE TABLE medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    generic_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    dosage_form VARCHAR(80) NOT NULL,
    strength VARCHAR(80) NOT NULL,
    category VARCHAR(120) NOT NULL,
    prescription_required BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_med_generic (generic_name),
    INDEX idx_med_brand (brand_name)
) ENGINE=InnoDB;

CREATE TABLE pharmacies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    address_line VARCHAR(255) NOT NULL,
    locality VARCHAR(120) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Chennai',
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    contact_phone VARCHAR(35) NOT NULL,
    is_24_hours BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_pharm_coords (latitude, longitude)
) ENGINE=InnoDB;

CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pharmacy_id BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    availability_status ENUM('AVAILABLE', 'OUT_OF_STOCK', 'STOCK_STATUS_UNKNOWN') NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_pharmacy FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id) ON DELETE CASCADE,
    CONSTRAINT fk_inv_medicine FOREIGN KEY (medicine_id) REFERENCES medicines (id) ON DELETE CASCADE,
    CONSTRAINT uq_pharm_medicine UNIQUE (pharmacy_id, medicine_id)
) ENGINE=InnoDB;`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">
                MediFind Project Architecture & Team Integration Dossier
              </h3>
              <p className="text-xs text-slate-400">
                Complete technical documentation for College Lab Evaluation & Viva Voce
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download MediFind.zip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-2 overflow-x-auto">
          {[
            { id: 'architecture', label: 'System Architecture', icon: Server },
            { id: 'database', label: 'Relational Schema & ERD', icon: Database },
            { id: 'viva', label: 'Viva Voce Q&A', icon: Code },
            { id: 'setup', label: 'Running Locally (Spring Boot + MySQL)', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'border-teal-600 text-teal-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed flex-1">
          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl">
                <h4 className="font-bold text-teal-900 text-sm mb-1">
                  Three-Tier Enterprise Architecture
                </h4>
                <p className="text-xs text-teal-800">
                  MediFind is structured in strict separation of concerns, ensuring effortless integration into the team repository without framework collisions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                    Tier 1: Presentation Layer
                  </span>
                  <h5 className="font-bold text-slate-900 mt-1">Responsive Web Client</h5>
                  <ul className="text-xs text-slate-600 space-y-1 mt-2 list-disc list-inside">
                    <li>HTML5 / CSS3 / Vanilla ES6 JavaScript</li>
                    <li>Browser Geolocation API with fallback</li>
                    <li>3-Tier Stock Availability rendering</li>
                    <li>Google Maps directions deep-links</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                    Tier 2: Business Logic Layer
                  </span>
                  <h5 className="font-bold text-slate-900 mt-1">Spring Boot 3.2.x REST API</h5>
                  <ul className="text-xs text-slate-600 space-y-1 mt-2 list-disc list-inside">
                    <li>Haversine Great-Circle Distance Engine</li>
                    <li>Case-insensitive substring search</li>
                    <li>Role-Based Access (USER, ADMIN)</li>
                    <li>BCrypt / SHA-256 password hashing</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                    Tier 3: Persistence Layer
                  </span>
                  <h5 className="font-bold text-slate-900 mt-1">MySQL 8.0+ Relational DB</h5>
                  <ul className="text-xs text-slate-600 space-y-1 mt-2 list-disc list-inside">
                    <li>InnoDB storage engine with ACID safety</li>
                    <li>Compound unique keys on (pharmacy_id, medicine_id)</li>
                    <li>B-Tree indexing on names and coordinates</li>
                    <li>Full audit logging for search inquiries</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">
                  Proximity Calculation (Haversine Formula Implementation)
                </h4>
                <div className="bg-slate-900 text-teal-300 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                  {`// Haversine formula implemented in Java DistanceCalculationService.java
double dLat = Math.toRadians(lat2 - lat1);
double dLon = Math.toRadians(lon2 - lon1);
double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
           Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
           Math.sin(dLon / 2) * Math.sin(dLon / 2);
double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
return 6371.0 * c; // Earth radius = 6371 km`}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'database' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">
                    Relational Entity-Relationship Diagram (ERD)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Normalized 3NF relational schema with strict Foreign Key constraints
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(schemaSnippet)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </div>

              {/* ASCII ERD */}
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
{`+----------------+            +-------------------+            +-----------------+
|   MEDICINES    | 1        N |     INVENTORY     | N        1 |   PHARMACIES    |
+----------------+------------+-------------------+------------+-----------------+
| id (PK)        |            | id (PK)           |            | id (PK)         |
| generic_name   |            | pharmacy_id (FK)  |            | name            |
| brand_name     |            | medicine_id (FK)  |            | license_number  |
| dosage_form    |            | quantity          |            | address_line    |
| strength       |            | availability_stat |            | locality        |
| category       |            | unit_price (INR)  |            | city (Chennai)  |
| prescription_req            | batch_number      |            | latitude        |
| is_active      |            | last_updated_at   |            | longitude       |
+----------------+            +-------------------+            | contact_phone   |
                                                               | is_24_hours     |
                                                               +-----------------+`}
              </div>

              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Database Table Specifications:
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong>1. medicines:</strong> Primary catalogue containing generic name, brand name, strength, dosage form, regulatory status (Schedule H vs OTC), and pharmacopoeia source.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong>2. pharmacies:</strong> Physical pharmacies with high-precision decimal coordinates (latitude/longitude), contact details, 24x7 status, and verification badges.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong>3. inventory:</strong> Junction table maintaining stock availability states (`AVAILABLE`, `OUT_OF_STOCK`, `STOCK_STATUS_UNKNOWN`), units on shelf, batch numbers, and audit update timestamps.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong>4. users:</strong> Stores citizen accounts and administrative credentials with role-based authorization (`USER` vs `ADMIN`).
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong>5. search_logs:</strong> Audit trail capturing user search strings, search coordinates, and result counts for demand analytics.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'viva' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 mb-2">
                Frequently Asked College Viva Voce Questions & Answers
              </h4>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 text-xs mb-1">
                  Q1: How does MediFind calculate the distance between a patient and a pharmacy?
                </div>
                <div className="text-xs text-slate-600">
                  We use the <strong>Haversine Formula</strong> to compute the great-circle distance between two pairs of spherical coordinates (latitude and longitude). This accounts for the curvature of the Earth (radius R = 6,371 km) and returns precise municipal distances in kilometres, allowing sorting by closest pharmacy.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 text-xs mb-1">
                  Q2: Why are there 3 stock statuses instead of a simple boolean (In Stock / Out of Stock)?
                </div>
                <div className="text-xs text-slate-600">
                  In healthcare informatics, pharmacies without recent stock feeds should NOT be assumed to have or not have a medicine. We classify stock into:
                  <strong>1) AVAILABLE:</strong> Verified recent inventory record with quantity &gt; 0.
                  <strong>2) OUT_OF_STOCK:</strong> Pharmacy actively stocks the product, but currently has 0 units.
                  <strong>3) STOCK_STATUS_UNKNOWN:</strong> Pharmacy is within range, but this medicine has no recent verified inventory entry. The user is instructed to call ahead.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 text-xs mb-1">
                  Q3: How does the search algorithm handle brand names versus generic names?
                </div>
                <div className="text-xs text-slate-600">
                  Search is case-insensitive and partial-matching across both <code>brand_name</code> (e.g., &ldquo;Dolo 650&rdquo;) and <code>generic_name</code> (e.g., &ldquo;Paracetamol&rdquo;). Searching either term queries the catalogue index and returns matching formulations, linking to live pharmacy inventories.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 text-xs mb-1">
                  Q4: How does the database prevent duplicate inventory rows for the same medicine and chemist?
                </div>
                <div className="text-xs text-slate-600">
                  Through a compound unique constraint: <code>CONSTRAINT uq_pharm_medicine UNIQUE (pharmacy_id, medicine_id)</code> in the MySQL schema. Any updates use an UPSERT operation, ensuring O(1) relational lookups and absolute data integrity.
                </div>
              </div>
            </div>
          )}

          {activeSection === 'setup' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900">
                Step-by-Step Local Deployment Guide
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Step 1: Download & Extract MediFind.zip</div>
                  <p className="text-slate-600">
                    Click the &ldquo;Download MediFind.zip&rdquo; button above. Extract the archive into your workspace folder or Eclipse/IntelliJ project directory.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Step 2: MySQL Database Initialization</div>
                  <pre className="bg-slate-900 text-teal-300 p-2 rounded mt-1 overflow-x-auto">
{`mysql -u root -p
mysql> source /path/to/MediFind/database/schema.sql;
mysql> source /path/to/MediFind/database/seed.sql;`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Step 3: Spring Boot Backend Execution</div>
                  <p className="text-slate-600 mb-1">
                    Edit <code>src/main/resources/application.properties</code> with your MySQL password, then execute:
                  </p>
                  <pre className="bg-slate-900 text-teal-300 p-2 rounded overflow-x-auto">
{`cd MediFind/backend
mvn clean install
mvn spring-boot:run`}
                  </pre>
                  <p className="text-slate-500 mt-1">
                    Spring Boot will start at <code>http://localhost:8080</code>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Step 4: Launch Frontend</div>
                  <p className="text-slate-600">
                    Open <code>MediFind/frontend/index.html</code> in any browser or run with VS Code Live Server. It automatically communicates with the Spring Boot REST API!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Complete project files generated and ready for team integration</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
