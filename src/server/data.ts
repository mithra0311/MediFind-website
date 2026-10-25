export interface MedicineRecord {
  id: number;
  genericName: string;
  brandName: string;
  dosageForm: string; // Tablet, Capsule, Syrup, Inhaler, Sachet, Injection
  strength: string;
  category: string;
  description: string;
  prescriptionRequired: boolean;
  isActive: boolean;
  verificationSource: string;
  createdDate: string;
}

export interface PharmacyRecord {
  id: number;
  name: string;
  licenseNumber: string;
  addressLine: string;
  locality: string;
  city: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  alternatePhone?: string;
  email?: string;
  openingTime: string;
  closingTime: string;
  is24Hours: boolean;
  isVerified: boolean;
  isActive: boolean;
  verificationStatus: 'VERIFIED' | 'DEMONSTRATION_RECORD' | 'PENDING_AUDIT';
  lastVerifiedAt: string;
}

export type StockStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'STOCK_STATUS_UNKNOWN';

export interface InventoryRecord {
  id: number;
  pharmacyId: number;
  medicineId: number;
  quantity: number;
  availabilityStatus: StockStatus;
  unitPrice: number; // in INR
  batchNumber: string;
  expiryDate: string;
  lastUpdatedAt: string;
  sourceVerification: string;
}

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface SearchLogRecord {
  id: number;
  userId?: number;
  query: string;
  userLat?: number;
  userLng?: number;
  resultsCount: number;
  timestamp: string;
}

// Initial demonstration medicines (Extensible, verified standard formulations)
export const initialMedicines: MedicineRecord[] = [
  {
    id: 1,
    genericName: "Paracetamol",
    brandName: "Dolo 650",
    dosageForm: "Tablet",
    strength: "650 mg",
    category: "Analgesic & Antipyretic",
    description: "Indicated for effective relief of fever, headache, body aches, and mild to moderate pain.",
    prescriptionRequired: false,
    isActive: true,
    verificationSource: "Indian Pharmacopoeia / Micro Labs Ltd",
    createdDate: "2026-01-15T09:00:00Z"
  },
  {
    id: 2,
    genericName: "Paracetamol",
    brandName: "Calpol 500",
    dosageForm: "Tablet",
    strength: "500 mg",
    category: "Analgesic & Antipyretic",
    description: "Pediatric and adult antipyretic for temperature management and pain relief.",
    prescriptionRequired: false,
    isActive: true,
    verificationSource: "GSK Pharmaceuticals",
    createdDate: "2026-01-15T09:30:00Z"
  },
  {
    id: 3,
    genericName: "Amoxicillin and Potassium Clavulanate",
    brandName: "Augmentin 625 Duo",
    dosageForm: "Tablet",
    strength: "500 mg + 125 mg",
    category: "Antibacterial / Penicillin",
    description: "Broad-spectrum beta-lactam antibiotic with beta-lactamase inhibitor for respiratory, ENT, and soft tissue bacterial infections.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "GlaxoSmithKline Pharmaceuticals",
    createdDate: "2026-01-16T10:00:00Z"
  },
  {
    id: 4,
    genericName: "Azithromycin",
    brandName: "Azithral 500",
    dosageForm: "Tablet",
    strength: "500 mg",
    category: "Macrolide Antibiotic",
    description: "Macrolide antibiotic used to treat bacterial chest infections, sinusitis, tonsillitis, and skin infections.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "Alembic Pharmaceuticals",
    createdDate: "2026-01-16T11:00:00Z"
  },
  {
    id: 5,
    genericName: "Metformin Hydrochloride",
    brandName: "Glycomet 500 SR",
    dosageForm: "Sustained Release Tablet",
    strength: "500 mg",
    category: "Antidiabetic / Biguanide",
    description: "First-line oral antidiabetic medication for managing Type 2 diabetes mellitus.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "USV Private Limited",
    createdDate: "2026-01-18T08:00:00Z"
  },
  {
    id: 6,
    genericName: "Telmisartan",
    brandName: "Telma 40",
    dosageForm: "Tablet",
    strength: "40 mg",
    category: "Antihypertensive / ARB",
    description: "Angiotensin II receptor antagonist for blood pressure control and cardiovascular risk reduction.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "Glenmark Pharmaceuticals",
    createdDate: "2026-01-18T09:00:00Z"
  },
  {
    id: 7,
    genericName: "Pantoprazole Gastro-resistant",
    brandName: "Pan 40",
    dosageForm: "Tablet",
    strength: "40 mg",
    category: "Proton Pump Inhibitor (PPI)",
    description: "Reduces stomach acid production; indicated for gastroesophageal reflux disease (GERD), heartburn, and peptic ulcer prophylaxis.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "Alkem Laboratories",
    createdDate: "2026-01-20T12:00:00Z"
  },
  {
    id: 8,
    genericName: "Montelukast Sodium and Levocetirizine Hydrochloride",
    brandName: "Montair LC",
    dosageForm: "Tablet",
    strength: "10 mg + 5 mg",
    category: "Antiallergic & Antiasthmatic",
    description: "Combined leukotriene receptor antagonist and antihistamine for allergic rhinitis and chronic asthma maintenance.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "Cipla Ltd",
    createdDate: "2026-01-20T13:00:00Z"
  },
  {
    id: 9,
    genericName: "Cetirizine Dihydrochloride",
    brandName: "Cetzine 10",
    dosageForm: "Tablet",
    strength: "10 mg",
    category: "Antihistamine",
    description: "Non-sedating antihistamine for hay fever, conjunctivitis, insect bites, and allergic skin conditions.",
    prescriptionRequired: false,
    isActive: true,
    verificationSource: "Dr. Reddy's Laboratories",
    createdDate: "2026-01-22T10:00:00Z"
  },
  {
    id: 10,
    genericName: "Salbutamol (Albuterol)",
    brandName: "Asthalin Inhaler",
    dosageForm: "Metered Dose Inhaler",
    strength: "100 mcg/dose",
    category: "Bronchodilator (Beta-2 Agonist)",
    description: "Fast-acting relief inhaler for acute bronchospasm, asthma attacks, and COPD exacerbations.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "Cipla Respiratory",
    createdDate: "2026-01-22T11:00:00Z"
  },
  {
    id: 11,
    genericName: "Atorvastatin Calcium",
    brandName: "Atorva 10",
    dosageForm: "Tablet",
    strength: "10 mg",
    category: "Lipid Lowering / Statin",
    description: "HMG-CoA reductase inhibitor for dyslipidemia and primary prevention of coronary events.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "Zydus Cadila",
    createdDate: "2026-01-24T09:00:00Z"
  },
  {
    id: 12,
    genericName: "Oral Rehydration Salts (WHO Formulation)",
    brandName: "Electral Sachet",
    dosageForm: "Powder / Oral Sachet",
    strength: "21.8 g",
    category: "Electrolytes & Rehydration",
    description: "Restores fluids and essential electrolytes lost due to dehydration, diarrhoea, or strenuous physical activity.",
    prescriptionRequired: false,
    isActive: true,
    verificationSource: "FDC Ltd / WHO Formula",
    createdDate: "2026-01-24T10:00:00Z"
  },
  {
    id: 13,
    genericName: "Ibuprofen and Paracetamol",
    brandName: "Combiflam",
    dosageForm: "Tablet",
    strength: "400 mg + 325 mg",
    category: "NSAID & Analgesic",
    description: "Synergistic dual action analgesic and anti-inflammatory for joint pain, toothache, and sprains.",
    prescriptionRequired: false,
    isActive: true,
    verificationSource: "Sanofi India",
    createdDate: "2026-01-25T14:00:00Z"
  },
  {
    id: 14,
    genericName: "Omeprazole",
    brandName: "Omez 20",
    dosageForm: "Capsule",
    strength: "20 mg",
    category: "Proton Pump Inhibitor (PPI)",
    description: "Gastric acid suppressant for hyperacidity, duodenal ulcers, and NSAID-associated gastritis.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "Dr. Reddy's Laboratories",
    createdDate: "2026-01-26T08:30:00Z"
  },
  {
    id: 15,
    genericName: "Budesonide and Formoterol Fumarate",
    brandName: "Foracort 200 Inhaler",
    dosageForm: "Dry Powder / Metered Inhaler",
    strength: "200 mcg + 6 mcg",
    category: "Corticosteroid & LABA",
    description: "Controller inhaler combining anti-inflammatory corticosteroid and long-acting bronchodilator for asthma and COPD.",
    prescriptionRequired: true,
    isActive: true,
    verificationSource: "Cipla Ltd",
    createdDate: "2026-01-26T11:00:00Z"
  }
];

// Seed demonstration pharmacies in Chromepet and nearby localities of Chennai
// Coordinates accurately centered around Chromepet (~12.9516° N, 80.1462° E)
export const initialPharmacies: PharmacyRecord[] = [
  {
    id: 1,
    name: "Apollo Pharmacy - Chromepet GST Road",
    licenseNumber: "TN-CHE-2023-A04192",
    addressLine: "No. 142/2, Grand Southern Trunk Rd, Near MIT Overbridge",
    locality: "Chromepet",
    city: "Chennai",
    pinCode: "600044",
    latitude: 12.9528,
    longitude: 80.1465,
    contactPhone: "+91 44 2223 8811",
    alternatePhone: "+91 98400 12345",
    email: "apollo.chromepet.gst@demopharmacy.in",
    openingTime: "07:00 AM",
    closingTime: "11:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-20T10:30:00Z"
  },
  {
    id: 2,
    name: "MedPlus Pharmacy - Radha Nagar Main Road",
    licenseNumber: "TN-CHE-2022-M09321",
    addressLine: "Shop No. 18, Radha Nagar Main Rd, Next to Axis Bank ATM",
    locality: "Radha Nagar, Chromepet",
    city: "Chennai",
    pinCode: "600044",
    latitude: 12.9561,
    longitude: 80.1492,
    contactPhone: "+91 44 2265 4420",
    alternatePhone: "+91 94440 23456",
    email: "medplus.radhanagar@demopharmacy.in",
    openingTime: "08:00 AM",
    closingTime: "10:30 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-22T14:15:00Z"
  },
  {
    id: 3,
    name: "Netmeds Pharmacy Store - Hastinapuram",
    licenseNumber: "TN-CHE-2024-N01140",
    addressLine: "Plot 34, Hastinapuram Main Road, Opp. Bus Terminus",
    locality: "Hastinapuram, Chromepet",
    city: "Chennai",
    pinCode: "600064",
    latitude: 12.9589,
    longitude: 80.1558,
    contactPhone: "+91 44 2277 5599",
    email: "netmeds.hastinapuram@demopharmacy.in",
    openingTime: "08:00 AM",
    closingTime: "11:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-23T09:00:00Z"
  },
  {
    id: 4,
    name: "Sri Balaji Medicals & General Store",
    licenseNumber: "TN-CHE-2018-B08761",
    addressLine: "No. 5, CLC Works Road, Near Chromepet Railway Station (West)",
    locality: "Chromepet Station West",
    city: "Chennai",
    pinCode: "600044",
    latitude: 12.9508,
    longitude: 80.1418,
    contactPhone: "+91 44 2238 1290",
    openingTime: "08:30 AM",
    closingTime: "10:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-21T16:00:00Z"
  },
  {
    id: 5,
    name: "24x7 LifeCare Pharmacy - Sanatorium Junction",
    licenseNumber: "TN-CHE-2021-L03329",
    addressLine: "No. 88, GST Road, Tambaram Sanatorium (Opp. National Institute of Siddha)",
    locality: "Tambaram Sanatorium",
    city: "Chennai",
    pinCode: "600047",
    latitude: 12.9421,
    longitude: 80.1385,
    contactPhone: "+91 44 2241 7700",
    alternatePhone: "+91 98840 99881",
    email: "lifecare247.sanatorium@demopharmacy.in",
    openingTime: "00:00 AM",
    closingTime: "11:59 PM",
    is24Hours: true,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T18:00:00Z"
  },
  {
    id: 6,
    name: "Lakshmi Medicals & Surgicals",
    licenseNumber: "TN-CHE-2019-L04822",
    addressLine: "Corner Building, Chitlapakkam 2nd Main Road",
    locality: "Chitlapakkam",
    city: "Chennai",
    pinCode: "600064",
    latitude: 12.9435,
    longitude: 80.1532,
    contactPhone: "+91 44 2223 4901",
    openingTime: "08:00 AM",
    closingTime: "10:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-19T11:45:00Z"
  },
  {
    id: 7,
    name: "Apollo Pharmacy - Pallavaram High Road",
    licenseNumber: "TN-CHE-2022-A08910",
    addressLine: "No. 221, GST Road, Pallavaram",
    locality: "Pallavaram",
    city: "Chennai",
    pinCode: "600043",
    latitude: 12.9678,
    longitude: 80.1495,
    contactPhone: "+91 44 2264 1155",
    openingTime: "00:00 AM",
    closingTime: "11:59 PM",
    is24Hours: true,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T12:00:00Z"
  },
  {
    id: 8,
    name: "Cauvery Health & Pharmacy",
    licenseNumber: "TN-CHE-2020-C06432",
    addressLine: "No. 12, Nehru Nagar Main Road",
    locality: "Nehru Nagar, Chrompet",
    city: "Chennai",
    pinCode: "600044",
    latitude: 12.9488,
    longitude: 80.1499,
    contactPhone: "+91 44 2238 6721",
    openingTime: "09:00 AM",
    closingTime: "09:30 PM",
    is24Hours: false,
    isVerified: false,
    isActive: true,
    verificationStatus: "PENDING_AUDIT",
    lastVerifiedAt: "2026-09-30T10:00:00Z"
  },
  {
    id: 9,
    name: "Apollo Pharmacy - Sithalapakkam",
    licenseNumber: "TN-CHE-2023-A11029",
    addressLine: "No. 74, Mambakkam Main Road, Sithalapakkam Junction",
    locality: "Sithalapakkam",
    city: "Chennai",
    pinCode: "600126",
    latitude: 12.8985,
    longitude: 80.1872,
    contactPhone: "+91 44 2278 1199",
    openingTime: "07:30 AM",
    closingTime: "10:30 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T14:00:00Z"
  },
  {
    id: 10,
    name: "MedPlus Pharmacy - Keelkattalai",
    licenseNumber: "TN-CHE-2022-M07718",
    addressLine: "No. 18, Medavakkam Main Road, Near Keelkattalai Bus Terminus",
    locality: "Keelkattalai",
    city: "Chennai",
    pinCode: "600117",
    latitude: 12.9645,
    longitude: 80.1815,
    contactPhone: "+91 44 2247 8820",
    openingTime: "08:00 AM",
    closingTime: "11:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T16:30:00Z"
  },
  {
    id: 11,
    name: "Guardian Healthcare & Pharmacy - Madipakkam",
    licenseNumber: "TN-CHE-2021-G04412",
    addressLine: "Shop 5, Madipakkam Koot Road, Near Bazaar Road",
    locality: "Madipakkam",
    city: "Chennai",
    pinCode: "600091",
    latitude: 12.9623,
    longitude: 80.1986,
    contactPhone: "+91 44 2258 4110",
    openingTime: "08:00 AM",
    closingTime: "10:30 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-23T11:20:00Z"
  },
  {
    id: 12,
    name: "Wellness Forever 24x7 - Velachery",
    licenseNumber: "TN-CHE-2024-W09110",
    addressLine: "Plot 89, Velachery Bypass Road, Opp. Grand Mall",
    locality: "Velachery",
    city: "Chennai",
    pinCode: "600042",
    latitude: 12.9815,
    longitude: 80.2180,
    contactPhone: "+91 44 2243 9900",
    openingTime: "00:00 AM",
    closingTime: "11:59 PM",
    is24Hours: true,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-25T01:00:00Z"
  },
  {
    id: 13,
    name: "Sri Sai Medicals & Surgicals - Medavakkam",
    licenseNumber: "TN-CHE-2020-S03391",
    addressLine: "No. 33, Tambaram-Velachery Main Road, Medavakkam Junction",
    locality: "Medavakkam",
    city: "Chennai",
    pinCode: "600100",
    latitude: 12.9185,
    longitude: 80.1923,
    contactPhone: "+91 44 2277 8844",
    openingTime: "08:30 AM",
    closingTime: "10:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T18:15:00Z"
  },
  {
    id: 14,
    name: "Guardian Pharmacy - Tambaram West",
    licenseNumber: "TN-CHE-2022-G02881",
    addressLine: "No. 12, Mudichur Road, Near Tambaram Bus Terminus",
    locality: "Tambaram",
    city: "Chennai",
    pinCode: "600045",
    latitude: 12.9249,
    longitude: 80.1278,
    contactPhone: "+91 44 2226 7710",
    openingTime: "08:00 AM",
    closingTime: "11:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T15:00:00Z"
  },
  {
    id: 15,
    name: "Apollo Pharmacy - Nanmangalam",
    licenseNumber: "TN-CHE-2023-A05519",
    addressLine: "Plot 42, Velachery Main Road, Nanmangalam Junction",
    locality: "Nanmangalam",
    city: "Chennai",
    pinCode: "600129",
    latitude: 12.9352,
    longitude: 80.1810,
    contactPhone: "+91 44 2279 2211",
    openingTime: "07:30 AM",
    closingTime: "11:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T17:30:00Z"
  },
  {
    id: 16,
    name: "MedPlus Pharmacy - Kovilambakkam",
    licenseNumber: "TN-CHE-2021-M06634",
    addressLine: "No. 8, 200 Feet Radial Road, Opp. Rose Nagar",
    locality: "Kovilambakkam",
    city: "Chennai",
    pinCode: "600129",
    latitude: 12.9420,
    longitude: 80.1915,
    contactPhone: "+91 44 2249 3320",
    openingTime: "08:00 AM",
    closingTime: "10:30 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T12:00:00Z"
  },
  {
    id: 17,
    name: "Health & Care Chemist - Pallikaranai",
    licenseNumber: "TN-CHE-2023-H07712",
    addressLine: "No. 95, Pallikaranai High Road, Near Marshland Park",
    locality: "Pallikaranai",
    city: "Chennai",
    pinCode: "600100",
    latitude: 12.9376,
    longitude: 80.2155,
    contactPhone: "+91 44 2246 8810",
    openingTime: "08:00 AM",
    closingTime: "10:30 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T19:00:00Z"
  },
  {
    id: 18,
    name: "Selaiyur Medicals & Surgicals",
    licenseNumber: "TN-CHE-2019-S04481",
    addressLine: "No. 64, Velachery Main Road, Selaiyur Near Bharat Univ.",
    locality: "Selaiyur",
    city: "Chennai",
    pinCode: "600073",
    latitude: 12.9192,
    longitude: 80.1450,
    contactPhone: "+91 44 2229 1145",
    openingTime: "08:00 AM",
    closingTime: "10:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T16:00:00Z"
  },
  {
    id: 19,
    name: "Apollo Pharmacy - East Tambaram MCC",
    licenseNumber: "TN-CHE-2022-A09923",
    addressLine: "No. 31, Station Road, Opp. Madras Christian College",
    locality: "East Tambaram",
    city: "Chennai",
    pinCode: "600059",
    latitude: 12.9230,
    longitude: 80.1385,
    contactPhone: "+91 44 2239 5566",
    openingTime: "07:00 AM",
    closingTime: "11:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T18:00:00Z"
  },
  {
    id: 20,
    name: "MedPlus Chemist - Camp Road Junction",
    licenseNumber: "TN-CHE-2021-M03345",
    addressLine: "Corner Plaza, Camp Road Junction, Selaiyur",
    locality: "Camp Road",
    city: "Chennai",
    pinCode: "600073",
    latitude: 12.9150,
    longitude: 80.1420,
    contactPhone: "+91 44 2228 9900",
    openingTime: "08:00 AM",
    closingTime: "11:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T14:45:00Z"
  },
  {
    id: 21,
    name: "LifeLine Medicals - Zamin Pallavaram",
    licenseNumber: "TN-CHE-2020-L06612",
    addressLine: "No. 19, Dharga Road, Zamin Pallavaram",
    locality: "Zamin Pallavaram",
    city: "Chennai",
    pinCode: "600043",
    latitude: 12.9730,
    longitude: 80.1550,
    contactPhone: "+91 44 2266 1122",
    openingTime: "08:30 AM",
    closingTime: "10:30 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T11:15:00Z"
  },
  {
    id: 22,
    name: "Sembakkam Care Pharmacy",
    licenseNumber: "TN-CHE-2022-S08831",
    addressLine: "No. 45, Velachery Main Road, Sembakkam Bus Stop",
    locality: "Sembakkam",
    city: "Chennai",
    pinCode: "600073",
    latitude: 12.9255,
    longitude: 80.1610,
    contactPhone: "+91 44 2278 4400",
    openingTime: "08:00 AM",
    closingTime: "10:00 PM",
    is24Hours: false,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-24T16:20:00Z"
  },
  {
    id: 23,
    name: "Global City 24x7 Pharmacy - Perumbakkam",
    licenseNumber: "TN-CHE-2024-G01129",
    addressLine: "Cheran Nagar, Near Gleneagles Global Health City",
    locality: "Perumbakkam",
    city: "Chennai",
    pinCode: "600100",
    latitude: 12.9015,
    longitude: 80.2010,
    contactPhone: "+91 44 2277 9900",
    openingTime: "00:00 AM",
    closingTime: "11:59 PM",
    is24Hours: true,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-25T02:00:00Z"
  },
  {
    id: 24,
    name: "Apollo Pharmacy 24x7 - Sholinganallur OMR",
    licenseNumber: "TN-CHE-2023-A09911",
    addressLine: "OMR Junction, Near Sholinganallur Signal, Rajiv Gandhi Salai",
    locality: "Sholinganallur",
    city: "Chennai",
    pinCode: "600119",
    latitude: 12.8990,
    longitude: 80.2280,
    contactPhone: "+91 44 2450 8899",
    openingTime: "00:00 AM",
    closingTime: "11:59 PM",
    is24Hours: true,
    isVerified: true,
    isActive: true,
    verificationStatus: "DEMONSTRATION_RECORD",
    lastVerifiedAt: "2026-10-25T01:45:00Z"
  }
];


// Initial inventory mappings
// Showing realistic variety: Some AVAILABLE with quantities & prices,
// some OUT_OF_STOCK, and some pharmacies without inventory entries (STOCK_STATUS_UNKNOWN).
export const initialInventory: InventoryRecord[] = [
  // Paracetamol (Dolo 650 - id 1)
  {
    id: 1,
    pharmacyId: 1, // Apollo Chromepet
    medicineId: 1,
    quantity: 45,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.50,
    batchNumber: "DL-26A4",
    expiryDate: "2027-08-31",
    lastUpdatedAt: "2026-10-24T10:30:00Z",
    sourceVerification: "Direct POS Feed"
  },
  {
    id: 2,
    pharmacyId: 2, // MedPlus Radha Nagar
    medicineId: 1,
    quantity: 60,
    availabilityStatus: "AVAILABLE",
    unitPrice: 31.80,
    batchNumber: "DL-26B1",
    expiryDate: "2027-09-30",
    lastUpdatedAt: "2026-10-24T11:45:00Z",
    sourceVerification: "Stock Audit"
  },
  {
    id: 3,
    pharmacyId: 4, // Sri Balaji
    medicineId: 1,
    quantity: 0,
    availabilityStatus: "OUT_OF_STOCK",
    unitPrice: 32.00,
    batchNumber: "DL-25Z9",
    expiryDate: "2027-05-31",
    lastUpdatedAt: "2026-10-23T16:00:00Z",
    sourceVerification: "Pharmacist Log"
  },
  {
    id: 4,
    pharmacyId: 5, // 24x7 Sanatorium
    medicineId: 1,
    quantity: 120,
    availabilityStatus: "AVAILABLE",
    unitPrice: 33.00,
    batchNumber: "DL-26C3",
    expiryDate: "2027-11-30",
    lastUpdatedAt: "2026-10-25T01:10:00Z",
    sourceVerification: "Verified POS"
  },

  // Augmentin 625 Duo (id 3)
  {
    id: 5,
    pharmacyId: 1,
    medicineId: 3,
    quantity: 14,
    availabilityStatus: "AVAILABLE",
    unitPrice: 204.00,
    batchNumber: "AG-8841",
    expiryDate: "2027-04-30",
    lastUpdatedAt: "2026-10-23T14:20:00Z",
    sourceVerification: "Direct POS Feed"
  },
  {
    id: 6,
    pharmacyId: 2,
    medicineId: 3,
    quantity: 0,
    availabilityStatus: "OUT_OF_STOCK",
    unitPrice: 202.50,
    batchNumber: "AG-8812",
    expiryDate: "2027-03-31",
    lastUpdatedAt: "2026-10-24T09:15:00Z",
    sourceVerification: "Pharmacist Log"
  },
  {
    id: 7,
    pharmacyId: 3, // Netmeds Hastinapuram
    medicineId: 3,
    quantity: 28,
    availabilityStatus: "AVAILABLE",
    unitPrice: 201.00,
    batchNumber: "AG-8899",
    expiryDate: "2027-06-30",
    lastUpdatedAt: "2026-10-24T18:00:00Z",
    sourceVerification: "System Sync"
  },

  // Azithral 500 (id 4)
  {
    id: 8,
    pharmacyId: 1,
    medicineId: 4,
    quantity: 22,
    availabilityStatus: "AVAILABLE",
    unitPrice: 135.00,
    batchNumber: "AZ-4102",
    expiryDate: "2027-07-31",
    lastUpdatedAt: "2026-10-24T12:00:00Z",
    sourceVerification: "Direct POS Feed"
  },
  {
    id: 9,
    pharmacyId: 5,
    medicineId: 4,
    quantity: 18,
    availabilityStatus: "AVAILABLE",
    unitPrice: 136.00,
    batchNumber: "AZ-4190",
    expiryDate: "2027-08-31",
    lastUpdatedAt: "2026-10-25T02:00:00Z",
    sourceVerification: "Verified POS"
  },

  // Glycomet 500 SR (id 5)
  {
    id: 10,
    pharmacyId: 2,
    medicineId: 5,
    quantity: 85,
    availabilityStatus: "AVAILABLE",
    unitPrice: 48.00,
    batchNumber: "GL-109",
    expiryDate: "2027-10-31",
    lastUpdatedAt: "2026-10-24T15:30:00Z",
    sourceVerification: "Stock Audit"
  },
  {
    id: 11,
    pharmacyId: 4,
    medicineId: 5,
    quantity: 30,
    availabilityStatus: "AVAILABLE",
    unitPrice: 47.50,
    batchNumber: "GL-102",
    expiryDate: "2027-09-30",
    lastUpdatedAt: "2026-10-22T17:00:00Z",
    sourceVerification: "Pharmacist Log"
  },

  // Telma 40 (id 6)
  {
    id: 12,
    pharmacyId: 1,
    medicineId: 6,
    quantity: 50,
    availabilityStatus: "AVAILABLE",
    unitPrice: 142.00,
    batchNumber: "TL-552",
    expiryDate: "2027-12-31",
    lastUpdatedAt: "2026-10-24T09:40:00Z",
    sourceVerification: "Direct POS Feed"
  },
  {
    id: 13,
    pharmacyId: 6, // Lakshmi Medicals
    medicineId: 6,
    quantity: 0,
    availabilityStatus: "OUT_OF_STOCK",
    unitPrice: 140.00,
    batchNumber: "TL-510",
    expiryDate: "2027-06-30",
    lastUpdatedAt: "2026-10-21T18:00:00Z",
    sourceVerification: "Stock Audit"
  },

  // Pan 40 (id 7)
  {
    id: 14,
    pharmacyId: 1,
    medicineId: 7,
    quantity: 75,
    availabilityStatus: "AVAILABLE",
    unitPrice: 160.00,
    batchNumber: "PN-771",
    expiryDate: "2027-11-30",
    lastUpdatedAt: "2026-10-24T10:00:00Z",
    sourceVerification: "Direct POS Feed"
  },
  {
    id: 15,
    pharmacyId: 2,
    medicineId: 7,
    quantity: 40,
    availabilityStatus: "AVAILABLE",
    unitPrice: 158.00,
    batchNumber: "PN-740",
    expiryDate: "2027-10-31",
    lastUpdatedAt: "2026-10-24T14:00:00Z",
    sourceVerification: "Stock Audit"
  },
  {
    id: 16,
    pharmacyId: 7, // Apollo Pallavaram
    medicineId: 7,
    quantity: 90,
    availabilityStatus: "AVAILABLE",
    unitPrice: 160.00,
    batchNumber: "PN-790",
    expiryDate: "2028-01-31",
    lastUpdatedAt: "2026-10-24T20:00:00Z",
    sourceVerification: "System Sync"
  },

  // Asthalin Inhaler (id 10)
  {
    id: 17,
    pharmacyId: 5, // 24x7 Sanatorium
    medicineId: 10,
    quantity: 15,
    availabilityStatus: "AVAILABLE",
    unitPrice: 148.00,
    batchNumber: "AS-301",
    expiryDate: "2027-07-31",
    lastUpdatedAt: "2026-10-25T03:00:00Z",
    sourceVerification: "Verified POS"
  },
  {
    id: 18,
    pharmacyId: 3,
    medicineId: 10,
    quantity: 0,
    availabilityStatus: "OUT_OF_STOCK",
    unitPrice: 146.50,
    batchNumber: "AS-288",
    expiryDate: "2027-04-30",
    lastUpdatedAt: "2026-10-23T11:00:00Z",
    sourceVerification: "Stock Audit"
  },

  // Electral Sachet (id 12)
  {
    id: 19,
    pharmacyId: 1,
    medicineId: 12,
    quantity: 110,
    availabilityStatus: "AVAILABLE",
    unitPrice: 22.00,
    batchNumber: "EL-901",
    expiryDate: "2028-03-31",
    lastUpdatedAt: "2026-10-24T08:00:00Z",
    sourceVerification: "Direct POS Feed"
  },
  {
    id: 20,
    pharmacyId: 4,
    medicineId: 12,
    quantity: 35,
    availabilityStatus: "AVAILABLE",
    unitPrice: 21.50,
    batchNumber: "EL-880",
    expiryDate: "2028-01-31",
    lastUpdatedAt: "2026-10-22T15:00:00Z",
    sourceVerification: "Pharmacist Log"
  },
  // Sithalapakkam (pharmacy 9)
  {
    id: 21,
    pharmacyId: 9,
    medicineId: 1, // Dolo 650
    quantity: 50,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.00,
    batchNumber: "DL-26S1",
    expiryDate: "2027-10-31",
    lastUpdatedAt: "2026-10-24T14:30:00Z",
    sourceVerification: "Direct POS Feed"
  },
  {
    id: 22,
    pharmacyId: 9,
    medicineId: 5, // Glycomet 500
    quantity: 40,
    availabilityStatus: "AVAILABLE",
    unitPrice: 48.00,
    batchNumber: "GL-110",
    expiryDate: "2027-11-30",
    lastUpdatedAt: "2026-10-24T14:30:00Z",
    sourceVerification: "Direct POS Feed"
  },
  // Keelkattalai (pharmacy 10)
  {
    id: 23,
    pharmacyId: 10,
    medicineId: 1, // Dolo 650
    quantity: 65,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.50,
    batchNumber: "DL-26K1",
    expiryDate: "2027-09-30",
    lastUpdatedAt: "2026-10-24T17:00:00Z",
    sourceVerification: "Stock Audit"
  },
  {
    id: 24,
    pharmacyId: 10,
    medicineId: 3, // Augmentin 625
    quantity: 18,
    availabilityStatus: "AVAILABLE",
    unitPrice: 204.00,
    batchNumber: "AG-8871",
    expiryDate: "2027-05-31",
    lastUpdatedAt: "2026-10-24T17:00:00Z",
    sourceVerification: "Stock Audit"
  },
  // Madipakkam (pharmacy 11)
  {
    id: 25,
    pharmacyId: 11,
    medicineId: 1, // Dolo 650
    quantity: 80,
    availabilityStatus: "AVAILABLE",
    unitPrice: 31.50,
    batchNumber: "DL-26M4",
    expiryDate: "2027-12-31",
    lastUpdatedAt: "2026-10-23T11:45:00Z",
    sourceVerification: "Verified POS"
  },
  {
    id: 26,
    pharmacyId: 11,
    medicineId: 7, // Pan 40
    quantity: 0,
    availabilityStatus: "OUT_OF_STOCK",
    unitPrice: 159.00,
    batchNumber: "PN-731",
    expiryDate: "2027-08-31",
    lastUpdatedAt: "2026-10-23T11:45:00Z",
    sourceVerification: "Stock Audit"
  },
  // Velachery (pharmacy 12)
  {
    id: 27,
    pharmacyId: 12,
    medicineId: 1, // Dolo 650
    quantity: 150,
    availabilityStatus: "AVAILABLE",
    unitPrice: 33.00,
    batchNumber: "DL-26V2",
    expiryDate: "2028-02-28",
    lastUpdatedAt: "2026-10-25T01:30:00Z",
    sourceVerification: "Verified POS"
  },
  {
    id: 28,
    pharmacyId: 12,
    medicineId: 3, // Augmentin 625
    quantity: 35,
    availabilityStatus: "AVAILABLE",
    unitPrice: 204.00,
    batchNumber: "AG-8910",
    expiryDate: "2027-07-31",
    lastUpdatedAt: "2026-10-25T01:30:00Z",
    sourceVerification: "Verified POS"
  },
  // Medavakkam (pharmacy 13)
  {
    id: 29,
    pharmacyId: 13,
    medicineId: 1, // Dolo 650
    quantity: 45,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.00,
    batchNumber: "DL-26MD",
    expiryDate: "2027-09-30",
    lastUpdatedAt: "2026-10-24T18:30:00Z",
    sourceVerification: "Pharmacist Log"
  },
  {
    id: 30,
    pharmacyId: 13,
    medicineId: 5, // Glycomet 500
    quantity: 55,
    availabilityStatus: "AVAILABLE",
    unitPrice: 47.50,
    batchNumber: "GL-112",
    expiryDate: "2027-10-31",
    lastUpdatedAt: "2026-10-24T18:30:00Z",
    sourceVerification: "Pharmacist Log"
  },
  // Tambaram West (14)
  {
    id: 31,
    pharmacyId: 14,
    medicineId: 1, // Dolo 650
    quantity: 65,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.50,
    batchNumber: "DL-26TW",
    expiryDate: "2027-11-30",
    lastUpdatedAt: "2026-10-24T15:00:00Z",
    sourceVerification: "Stock Audit"
  },
  {
    id: 32,
    pharmacyId: 14,
    medicineId: 3, // Augmentin 625 Duo
    quantity: 18,
    availabilityStatus: "AVAILABLE",
    unitPrice: 204.00,
    batchNumber: "AG-8890",
    expiryDate: "2027-06-30",
    lastUpdatedAt: "2026-10-24T15:00:00Z",
    sourceVerification: "Direct POS Feed"
  },
  // Nanmangalam (15)
  {
    id: 33,
    pharmacyId: 15,
    medicineId: 1, // Dolo 650
    quantity: 40,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.00,
    batchNumber: "DL-26NM",
    expiryDate: "2027-08-31",
    lastUpdatedAt: "2026-10-24T17:30:00Z",
    sourceVerification: "Verified POS"
  },
  {
    id: 34,
    pharmacyId: 15,
    medicineId: 6, // Telma 40
    quantity: 25,
    availabilityStatus: "AVAILABLE",
    unitPrice: 142.00,
    batchNumber: "TL-554",
    expiryDate: "2027-12-31",
    lastUpdatedAt: "2026-10-24T17:30:00Z",
    sourceVerification: "Stock Audit"
  },
  // Kovilambakkam (16)
  {
    id: 35,
    pharmacyId: 16,
    medicineId: 1, // Dolo 650
    quantity: 50,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.50,
    batchNumber: "DL-26KB",
    expiryDate: "2027-09-30",
    lastUpdatedAt: "2026-10-24T12:00:00Z",
    sourceVerification: "System Sync"
  },
  {
    id: 36,
    pharmacyId: 16,
    medicineId: 4, // Azithral 500
    quantity: 12,
    availabilityStatus: "AVAILABLE",
    unitPrice: 135.00,
    batchNumber: "AZ-4195",
    expiryDate: "2027-07-31",
    lastUpdatedAt: "2026-10-24T12:00:00Z",
    sourceVerification: "Stock Audit"
  },
  // Pallikaranai (17)
  {
    id: 37,
    pharmacyId: 17,
    medicineId: 1, // Dolo 650
    quantity: 70,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.00,
    batchNumber: "DL-26PK",
    expiryDate: "2027-10-31",
    lastUpdatedAt: "2026-10-24T19:00:00Z",
    sourceVerification: "Direct POS Feed"
  },
  {
    id: 38,
    pharmacyId: 17,
    medicineId: 7, // Pan 40
    quantity: 45,
    availabilityStatus: "AVAILABLE",
    unitPrice: 160.00,
    batchNumber: "PN-789",
    expiryDate: "2027-11-30",
    lastUpdatedAt: "2026-10-24T19:00:00Z",
    sourceVerification: "Direct POS Feed"
  },
  // Selaiyur (18)
  {
    id: 39,
    pharmacyId: 18,
    medicineId: 1, // Dolo 650
    quantity: 35,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.00,
    batchNumber: "DL-26SL",
    expiryDate: "2027-08-31",
    lastUpdatedAt: "2026-10-24T16:00:00Z",
    sourceVerification: "Pharmacist Log"
  },
  {
    id: 40,
    pharmacyId: 18,
    medicineId: 3, // Augmentin 625 Duo
    quantity: 0,
    availabilityStatus: "OUT_OF_STOCK",
    unitPrice: 204.00,
    batchNumber: "AG-8822",
    expiryDate: "2027-03-31",
    lastUpdatedAt: "2026-10-24T16:00:00Z",
    sourceVerification: "Pharmacist Log"
  },
  // East Tambaram (19)
  {
    id: 41,
    pharmacyId: 19,
    medicineId: 1, // Dolo 650
    quantity: 80,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.50,
    batchNumber: "DL-26ET",
    expiryDate: "2027-12-31",
    lastUpdatedAt: "2026-10-24T18:00:00Z",
    sourceVerification: "Verified POS"
  },
  {
    id: 42,
    pharmacyId: 19,
    medicineId: 5, // Glycomet 500 SR
    quantity: 40,
    availabilityStatus: "AVAILABLE",
    unitPrice: 48.00,
    batchNumber: "GL-118",
    expiryDate: "2027-10-31",
    lastUpdatedAt: "2026-10-24T18:00:00Z",
    sourceVerification: "Verified POS"
  },
  // Camp Road (20)
  {
    id: 43,
    pharmacyId: 20,
    medicineId: 1, // Dolo 650
    quantity: 55,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.00,
    batchNumber: "DL-26CR",
    expiryDate: "2027-09-30",
    lastUpdatedAt: "2026-10-24T14:45:00Z",
    sourceVerification: "System Sync"
  },
  // Zamin Pallavaram (21)
  {
    id: 44,
    pharmacyId: 21,
    medicineId: 1, // Dolo 650
    quantity: 30,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.50,
    batchNumber: "DL-26ZP",
    expiryDate: "2027-07-31",
    lastUpdatedAt: "2026-10-24T11:15:00Z",
    sourceVerification: "Pharmacist Log"
  },
  // Sembakkam (22)
  {
    id: 45,
    pharmacyId: 22,
    medicineId: 1, // Dolo 650
    quantity: 42,
    availabilityStatus: "AVAILABLE",
    unitPrice: 32.00,
    batchNumber: "DL-26SB",
    expiryDate: "2027-10-31",
    lastUpdatedAt: "2026-10-24T16:20:00Z",
    sourceVerification: "Stock Audit"
  },
  // Perumbakkam (23 - 24x7)
  {
    id: 46,
    pharmacyId: 23,
    medicineId: 1, // Dolo 650
    quantity: 110,
    availabilityStatus: "AVAILABLE",
    unitPrice: 33.00,
    batchNumber: "DL-26PB",
    expiryDate: "2028-01-31",
    lastUpdatedAt: "2026-10-25T02:00:00Z",
    sourceVerification: "Verified POS Feed"
  },
  {
    id: 47,
    pharmacyId: 23,
    medicineId: 3, // Augmentin 625 Duo
    quantity: 30,
    availabilityStatus: "AVAILABLE",
    unitPrice: 204.00,
    batchNumber: "AG-8955",
    expiryDate: "2027-08-31",
    lastUpdatedAt: "2026-10-25T02:00:00Z",
    sourceVerification: "Verified POS Feed"
  },
  // Sholinganallur (24 - 24x7)
  {
    id: 48,
    pharmacyId: 24,
    medicineId: 1, // Dolo 650
    quantity: 95,
    availabilityStatus: "AVAILABLE",
    unitPrice: 33.00,
    batchNumber: "DL-26SH",
    expiryDate: "2028-02-28",
    lastUpdatedAt: "2026-10-25T01:45:00Z",
    sourceVerification: "Direct POS Feed"
  }
];


export const initialUsers: UserRecord[] = [
  {
    id: 1,
    name: "Mithra (Lead Administrator)",
    email: "mithra.admin@medifind.example",
    // SHA256 of 'Admin@1234'
    passwordHash: "bc78e58d55cde1346e68f8e5fe588dedf62fa457aa646a500a53347faff6ee24",
    role: "ADMIN",
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Priya Ramanathan (College Demo User)",
    email: "priya.demo@medifind.example",
    // SHA256 of 'User@1234'
    passwordHash: "1b992a2bb0984ad12a5efc86fb260801e275d71419c7b748b5ff33a497af8423",
    role: "USER",
    createdAt: "2026-02-10T10:00:00Z"
  },
  {
    id: 3,
    name: "Dr. K. Senthil Kumar (Chief Admin)",
    email: "admin@medifind.org",
    passwordHash: "bc78e58d55cde1346e68f8e5fe588dedf62fa457aa646a500a53347faff6ee24",
    role: "ADMIN",
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Priya (Student Account)",
    email: "priya@student.edu",
    passwordHash: "1b992a2bb0984ad12a5efc86fb260801e275d71419c7b748b5ff33a497af8423",
    role: "USER",
    createdAt: "2026-02-10T10:00:00Z"
  }
];

