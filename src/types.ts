export interface Medicine {
  id: number;
  genericName: string;
  brandName: string;
  dosageForm: string;
  strength: string;
  category: string;
  description: string;
  prescriptionRequired: boolean;
  isActive: boolean;
  verificationSource: string;
  createdDate?: string;
}

export interface Pharmacy {
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
  distanceKm?: number | null;
}

export type StockStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'STOCK_STATUS_UNKNOWN';

export interface PharmacyStockResult {
  pharmacyId: number;
  pharmacyName: string;
  address: string;
  locality: string;
  city: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  alternatePhone?: string;
  openingTime: string;
  closingTime: string;
  is24Hours: boolean;
  isVerified: boolean;
  verificationStatus: string;
  distanceKm: number | null;
  inventory: {
    status: StockStatus;
    quantity: number;
    unitPrice: number | null;
    batchNumber?: string;
    expiryDate?: string;
    lastUpdatedAt: string | null;
    sourceVerification: string;
  };
}

export interface SearchResponse {
  matchedMedicines: Medicine[];
  primaryMedicine: Medicine | null;
  confirmedAvailable: PharmacyStockResult[];
  outOfStock: PharmacyStockResult[];
  unknownStock: PharmacyStockResult[];
  radiusKm: number;
  totalPharmaciesEvaluated: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AdminStats {
  totalMedicines: number;
  totalPharmacies: number;
  totalInventoryEntries: number;
  availableStockCount: number;
  outOfStockCount: number;
  unknownStockCount: number;
  pendingVerificationCount: number;
  totalSearchesLogged: number;
}

export interface InventoryItem {
  id: number;
  pharmacyId: number;
  medicineId: number;
  quantity: number;
  availabilityStatus: StockStatus;
  unitPrice: number;
  batchNumber: string;
  expiryDate: string;
  lastUpdatedAt: string;
  sourceVerification: string;
  medicine: Medicine;
  pharmacy: Pharmacy;
}
