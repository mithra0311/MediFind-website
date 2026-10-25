import crypto from 'crypto';
import {
  initialMedicines,
  initialPharmacies,
  initialInventory,
  initialUsers,
  MedicineRecord,
  PharmacyRecord,
  InventoryRecord,
  UserRecord,
  SearchLogRecord,
  StockStatus
} from './data.ts';

export class MediFindDB {
  private medicines: MedicineRecord[] = [...initialMedicines];
  private pharmacies: PharmacyRecord[] = [...initialPharmacies];
  private inventory: InventoryRecord[] = [...initialInventory];
  private users: UserRecord[] = [...initialUsers];
  private searchLogs: SearchLogRecord[] = [];
  private nextMedicineId = 16;
  private nextPharmacyId = 25;
  private nextInventoryId = 49;
  private nextUserId = 5;

  public static hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password.trim()).digest('hex');
  }

  // --- Distance Calculation (Haversine Formula in Kilometres) ---
  public static calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return Math.round(dist * 100) / 100; // 2 decimal places
  }

  // --- Medicine Methods ---
  public getAllMedicines(query?: string, category?: string, activeOnly = true): MedicineRecord[] {
    return this.medicines.filter((m) => {
      if (activeOnly && !m.isActive) return false;
      if (category && category !== 'ALL' && m.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        const matchGeneric = m.genericName.toLowerCase().includes(q);
        const matchBrand = m.brandName.toLowerCase().includes(q);
        const matchCat = m.category.toLowerCase().includes(q);
        if (!matchGeneric && !matchBrand && !matchCat) return false;
      }
      return true;
    });
  }

  public getMedicineById(id: number): MedicineRecord | undefined {
    return this.medicines.find((m) => m.id === id);
  }

  public createMedicine(data: Omit<MedicineRecord, 'id' | 'createdDate'>): MedicineRecord {
    const newRecord: MedicineRecord = {
      ...data,
      id: this.nextMedicineId++,
      createdDate: new Date().toISOString()
    };
    this.medicines.push(newRecord);
    return newRecord;
  }

  public updateMedicine(id: number, data: Partial<MedicineRecord>): MedicineRecord | null {
    const idx = this.medicines.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.medicines[idx] = { ...this.medicines[idx], ...data };
    return this.medicines[idx];
  }

  public deleteMedicine(id: number): boolean {
    const idx = this.medicines.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    // Deactivate instead of hard delete to preserve relational integrity
    this.medicines[idx].isActive = false;
    return true;
  }

  // --- Pharmacy Methods ---
  public getAllPharmacies(userLat?: number, userLng?: number, maxRadiusKm?: number, activeOnly = true) {
    let result = this.pharmacies.filter((p) => (activeOnly ? p.isActive : true));

    return result.map((p) => {
      let distanceKm: number | null = null;
      if (userLat != null && userLng != null) {
        distanceKm = MediFindDB.calculateHaversineDistance(userLat, userLng, p.latitude, p.longitude);
      }
      return {
        ...p,
        distanceKm
      };
    })
    .filter((p) => {
      if (maxRadiusKm != null && p.distanceKm != null) {
        return p.distanceKm <= maxRadiusKm;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.distanceKm == null) return 0;
      if (b.distanceKm == null) return 0;
      return a.distanceKm - b.distanceKm;
    });
  }

  public getPharmacyById(id: number): PharmacyRecord | undefined {
    return this.pharmacies.find((p) => p.id === id);
  }

  public createPharmacy(data: Omit<PharmacyRecord, 'id'>): PharmacyRecord {
    const newRecord: PharmacyRecord = {
      ...data,
      id: this.nextPharmacyId++
    };
    this.pharmacies.push(newRecord);
    return newRecord;
  }

  public updatePharmacy(id: number, data: Partial<PharmacyRecord>): PharmacyRecord | null {
    const idx = this.pharmacies.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.pharmacies[idx] = { ...this.pharmacies[idx], ...data };
    return this.pharmacies[idx];
  }

  public deletePharmacy(id: number): boolean {
    const idx = this.pharmacies.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.pharmacies[idx].isActive = false;
    return true;
  }

  // --- Inventory Methods ---
  public getInventoryByPharmacy(pharmacyId: number): Array<InventoryRecord & { medicine: MedicineRecord }> {
    return this.inventory
      .filter((inv) => inv.pharmacyId === pharmacyId)
      .map((inv) => {
        const med = this.getMedicineById(inv.medicineId)!;
        return { ...inv, medicine: med };
      })
      .filter((inv) => Boolean(inv.medicine));
  }

  public getInventoryByMedicine(medicineId: number): Array<InventoryRecord & { pharmacy: PharmacyRecord }> {
    return this.inventory
      .filter((inv) => inv.medicineId === medicineId)
      .map((inv) => {
        const pharm = this.getPharmacyById(inv.pharmacyId)!;
        return { ...inv, pharmacy: pharm };
      })
      .filter((inv) => Boolean(inv.pharmacy && inv.pharmacy.isActive));
  }

  public upsertInventory(
    pharmacyId: number,
    medicineId: number,
    quantity: number,
    availabilityStatus: StockStatus,
    unitPrice: number,
    batchNumber?: string,
    expiryDate?: string,
    sourceVerification?: string
  ): InventoryRecord {
    const existingIdx = this.inventory.findIndex(
      (inv) => inv.pharmacyId === pharmacyId && inv.medicineId === medicineId
    );

    const now = new Date().toISOString();

    if (existingIdx !== -1) {
      this.inventory[existingIdx] = {
        ...this.inventory[existingIdx],
        quantity,
        availabilityStatus,
        unitPrice: unitPrice > 0 ? unitPrice : this.inventory[existingIdx].unitPrice,
        batchNumber: batchNumber || this.inventory[existingIdx].batchNumber,
        expiryDate: expiryDate || this.inventory[existingIdx].expiryDate,
        lastUpdatedAt: now,
        sourceVerification: sourceVerification || this.inventory[existingIdx].sourceVerification
      };
      return this.inventory[existingIdx];
    } else {
      const newInv: InventoryRecord = {
        id: this.nextInventoryId++,
        pharmacyId,
        medicineId,
        quantity,
        availabilityStatus,
        unitPrice,
        batchNumber: batchNumber || 'BAT-' + Math.floor(1000 + Math.random() * 9000),
        expiryDate: expiryDate || '2027-12-31',
        lastUpdatedAt: now,
        sourceVerification: sourceVerification || 'Admin Portal Entry'
      };
      this.inventory.push(newInv);
      return newInv;
    }
  }

  public getAllInventory(
    pharmacyId?: number,
    medicineId?: number,
    status?: string,
    query?: string
  ): Array<InventoryRecord & { medicine: MedicineRecord; pharmacy: PharmacyRecord }> {
    let list = this.inventory
      .map((inv) => {
        const med = this.getMedicineById(inv.medicineId);
        const pharm = this.getPharmacyById(inv.pharmacyId);
        if (!med || !pharm) return null;
        return {
          ...inv,
          medicine: med,
          pharmacy: pharm
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (pharmacyId) {
      list = list.filter((item) => item.pharmacyId === pharmacyId);
    }
    if (medicineId) {
      list = list.filter((item) => item.medicineId === medicineId);
    }
    if (status && status !== 'ALL') {
      list = list.filter((item) => item.availabilityStatus === status);
    }
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.medicine.brandName.toLowerCase().includes(q) ||
          item.medicine.genericName.toLowerCase().includes(q) ||
          item.pharmacy.name.toLowerCase().includes(q) ||
          item.pharmacy.locality.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public deleteInventory(id: number): boolean {
    const idx = this.inventory.findIndex((inv) => inv.id === id);
    if (idx === -1) return false;
    this.inventory.splice(idx, 1);
    return true;
  }

  // --- Core Smart Search Logic ---
  // When a user searches for ANY medicine, we:
  // 1. Find matching medicines in the catalogue (case-insensitive, generic or brand)
  // 2. Identify pharmacies that stock it or are nearby
  // 3. Calculate distance from user coords
  // 4. Group results into:
  //    - Confirmed Stock (AVAILABLE with qty & price)
  //    - Out of Stock (Tracked item, but quantity is 0)
  //    - Status Unknown (Nearby pharmacy where this medicine has no current inventory record)
  public searchMedicineWithNearbyPharmacies(
    searchTerm: string,
    userLat?: number,
    userLng?: number,
    radiusKm: number = 10,
    userId?: number
  ) {
    const trimmed = searchTerm.trim().toLowerCase();

    // 1. Search catalogue
    const matchingMedicines = this.medicines.filter((m) => {
      if (!m.isActive) return false;
      const genericMatch = m.genericName.toLowerCase().includes(trimmed);
      const brandMatch = m.brandName.toLowerCase().includes(trimmed);
      return genericMatch || brandMatch;
    });

    // Log the search
    this.searchLogs.unshift({
      id: this.searchLogs.length + 1,
      userId,
      query: searchTerm,
      userLat,
      userLng,
      resultsCount: matchingMedicines.length,
      timestamp: new Date().toISOString()
    });

    if (matchingMedicines.length === 0) {
      return {
        matchedMedicines: [],
        primaryMedicine: null,
        confirmedAvailable: [],
        outOfStock: [],
        unknownStock: [],
        radiusKm,
        totalPharmaciesEvaluated: this.pharmacies.length
      };
    }

    // Pick primary match (exact or first match)
    const primaryMedicine = matchingMedicines[0];

    // Get inventory records for this primary medicine
    const inventoryForMed = this.inventory.filter((inv) => inv.medicineId === primaryMedicine.id);
    const pharmacyInventoryMap = new Map<number, InventoryRecord>();
    for (const inv of inventoryForMed) {
      pharmacyInventoryMap.set(inv.pharmacyId, inv);
    }

    // Evaluate all active pharmacies
    const confirmedAvailable: any[] = [];
    const outOfStock: any[] = [];
    const unknownStock: any[] = [];

    const activePharmacies = this.pharmacies.filter((p) => p.isActive);

    for (const p of activePharmacies) {
      let distanceKm: number | null = null;
      if (userLat != null && userLng != null) {
        distanceKm = MediFindDB.calculateHaversineDistance(userLat, userLng, p.latitude, p.longitude);
      }

      // If radius filter is active and distance is greater than radius, skip
      if (userLat != null && userLng != null && distanceKm != null && distanceKm > radiusKm) {
        continue;
      }

      const inv = pharmacyInventoryMap.get(p.id);

      const pharmacyResult = {
        pharmacyId: p.id,
        pharmacyName: p.name,
        address: p.addressLine,
        locality: p.locality,
        city: p.city,
        pinCode: p.pinCode,
        latitude: p.latitude,
        longitude: p.longitude,
        contactPhone: p.contactPhone,
        alternatePhone: p.alternatePhone,
        openingTime: p.openingTime,
        closingTime: p.closingTime,
        is24Hours: p.is24Hours,
        isVerified: p.isVerified,
        verificationStatus: p.verificationStatus,
        distanceKm,
        inventory: inv
          ? {
              status: inv.availabilityStatus,
              quantity: inv.quantity,
              unitPrice: inv.unitPrice,
              batchNumber: inv.batchNumber,
              expiryDate: inv.expiryDate,
              lastUpdatedAt: inv.lastUpdatedAt,
              sourceVerification: inv.sourceVerification
            }
          : {
              status: 'STOCK_STATUS_UNKNOWN' as StockStatus,
              quantity: 0,
              unitPrice: null,
              lastUpdatedAt: null,
              sourceVerification: 'No active stock feed for this item'
            }
      };

      if (inv && inv.availabilityStatus === 'AVAILABLE' && inv.quantity > 0) {
        confirmedAvailable.push(pharmacyResult);
      } else if (inv && (inv.availabilityStatus === 'OUT_OF_STOCK' || inv.quantity === 0)) {
        outOfStock.push(pharmacyResult);
      } else {
        unknownStock.push(pharmacyResult);
      }
    }

    // Sort all arrays by calculated distance (closest first)
    const sortByDistance = (a: any, b: any) => {
      if (a.distanceKm == null) return 0;
      if (b.distanceKm == null) return 0;
      return a.distanceKm - b.distanceKm;
    };

    confirmedAvailable.sort(sortByDistance);
    outOfStock.sort(sortByDistance);
    unknownStock.sort(sortByDistance);

    return {
      matchedMedicines: matchingMedicines,
      primaryMedicine,
      confirmedAvailable,
      outOfStock,
      unknownStock,
      radiusKm,
      totalPharmaciesEvaluated: activePharmacies.length
    };
  }

  // --- Auth Methods ---
  public authenticateUser(email: string, passwordPlain: string): UserRecord | null {
    const hash = MediFindDB.hashPassword(passwordPlain);
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.passwordHash === hash) {
      return user;
    }
    return null;
  }

  public registerUser(name: string, email: string, passwordPlain: string): UserRecord {
    const existing = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('A user with this email address already exists.');
    }
    const newUser: UserRecord = {
      id: this.nextUserId++,
      name,
      email,
      passwordHash: MediFindDB.hashPassword(passwordPlain),
      role: 'USER',
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  public getUserById(id: number): UserRecord | undefined {
    return this.users.find((u) => u.id === id);
  }

  public getRecentSearchLogs(limit = 20): SearchLogRecord[] {
    return this.searchLogs.slice(0, limit);
  }

  public getUserSearchLogs(userId?: number, limit = 20): SearchLogRecord[] {
    if (userId) {
      return this.searchLogs.filter((log) => log.userId === userId).slice(0, limit);
    }
    return this.searchLogs.slice(0, limit);
  }

  public clearUserSearchLogs(userId: number): boolean {
    this.searchLogs = this.searchLogs.filter((log) => log.userId !== userId);
    return true;
  }

  public getAdminStats() {
    const totalMedicines = this.medicines.filter((m) => m.isActive).length;
    const totalPharmacies = this.pharmacies.filter((p) => p.isActive).length;
    const totalInventoryEntries = this.inventory.length;
    const availableStockCount = this.inventory.filter((i) => i.availabilityStatus === 'AVAILABLE').length;
    const outOfStockCount = this.inventory.filter((i) => i.availabilityStatus === 'OUT_OF_STOCK').length;
    const unknownStockCount = this.inventory.filter((i) => i.availabilityStatus === 'STOCK_STATUS_UNKNOWN').length;
    const pendingVerificationCount = this.pharmacies.filter((p) => p.verificationStatus === 'PENDING_AUDIT').length;

    return {
      totalMedicines,
      totalPharmacies,
      totalInventoryEntries,
      availableStockCount,
      outOfStockCount,
      unknownStockCount,
      pendingVerificationCount,
      totalSearchesLogged: this.searchLogs.length
    };
  }

  // Batch CSV Import for Medicines
  public importMedicinesFromCsv(csvText: string): { imported: number; errors: string[] } {
    const lines = csvText.trim().split('\n');
    let imported = 0;
    const errors: string[] = [];

    // Header expected: genericName,brandName,dosageForm,strength,category,description,prescriptionRequired
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 5) {
        errors.push(`Row ${i + 1}: Insufficient columns`);
        continue;
      }
      const [genericName, brandName, dosageForm, strength, category, description = '', rx = 'true'] = parts;
      this.createMedicine({
        genericName,
        brandName,
        dosageForm,
        strength,
        category,
        description: description || `${genericName} ${strength} ${dosageForm}`,
        prescriptionRequired: rx.toLowerCase() === 'true' || rx === '1' || rx.toLowerCase() === 'yes',
        isActive: true,
        verificationSource: 'Bulk CSV Import'
      });
      imported++;
    }

    return { imported, errors };
  }
}

// Global Singleton for the server session
export const db = new MediFindDB();
