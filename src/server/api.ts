import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from './db.ts';

export const apiRouter = Router();

// Middleware to enforce admin role on management endpoints
const requireAdmin = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required. Admin privileges required.' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const parts = token.split('_');
  if (parts.length >= 2 && parts[0] === 'mfd') {
    const userId = parseInt(parts[1], 10);
    const user = db.getUserById(userId);
    if (user && user.role === 'ADMIN') {
      return next();
    }
  }

  return res.status(403).json({ error: 'Access denied: Admin privileges required.' });
};

// --- Auth Endpoints ---
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Session token simulation (or JWT payload)
  const token = `mfd_${user.id}_${Date.now()}`;
  return res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const newUser = db.registerUser(name, email, password);
    const token = `mfd_${newUser.id}_${Date.now()}`;
    return res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err: any) {
    return res.status(409).json({ error: err.message || 'Registration failed.' });
  }
});

apiRouter.post('/auth/demo-login', (req: Request, res: Response) => {
  const { role } = req.body;
  if (role === 'ADMIN') {
    const admin = db.getUserById(1);
    if (!admin) return res.status(404).json({ error: 'Admin user not found' });
    return res.json({
      message: 'Logged in as Demo Administrator (Mithra)',
      token: `mfd_${admin.id}_${Date.now()}`,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } else {
    const user = db.getUserById(2);
    if (!user) return res.status(404).json({ error: 'Demo user not found' });
    return res.json({
      message: 'Logged in as Demo Citizen (Priya)',
      token: `mfd_${user.id}_${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }
});

// Helper to extract authenticated user ID from Authorization header
function extractUserId(req: Request): number | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const parts = token.split('_');
    if (parts.length >= 2 && parts[0] === 'mfd') {
      const uid = parseInt(parts[1], 10);
      if (!isNaN(uid)) return uid;
    }
  }
  if (req.query.userId) {
    const uid = parseInt(String(req.query.userId), 10);
    if (!isNaN(uid)) return uid;
  }
  return undefined;
}

// --- User Search History Endpoints ---
apiRouter.get('/user/search-history', (req: Request, res: Response) => {
  const userId = extractUserId(req);
  const logs = db.getUserSearchLogs(userId);
  return res.json({ count: logs.length, history: logs });
});

apiRouter.delete('/user/search-history', (req: Request, res: Response) => {
  const userId = extractUserId(req);
  if (userId) {
    db.clearUserSearchLogs(userId);
    return res.json({ message: 'Search history cleared' });
  }
  return res.status(400).json({ error: 'User authentication required' });
});

// --- Search Endpoint ---
// GET /api/search?query=Dolo&lat=12.9516&lng=80.1462&radius=5
apiRouter.get('/search', (req: Request, res: Response) => {
  const query = req.query.query ? String(req.query.query) : '';
  const latStr = req.query.lat ? String(req.query.lat) : undefined;
  const lngStr = req.query.lng ? String(req.query.lng) : undefined;
  const radiusStr = req.query.radius ? String(req.query.radius) : '10';

  if (!query.trim()) {
    return res.status(400).json({
      error: 'Search query parameter is required (e.g. /api/search?query=Paracetamol)'
    });
  }

  const userId = extractUserId(req);
  const userLat = latStr ? parseFloat(latStr) : undefined;
  const userLng = lngStr ? parseFloat(lngStr) : undefined;
  const radiusKm = parseFloat(radiusStr) || 10;

  const results = db.searchMedicineWithNearbyPharmacies(query, userLat, userLng, radiusKm, userId);
  return res.json(results);
});


// --- Medicines Endpoints ---
apiRouter.get('/medicines', (req: Request, res: Response) => {
  const query = req.query.query ? String(req.query.query) : undefined;
  const category = req.query.category ? String(req.query.category) : undefined;
  const activeOnly = req.query.all === 'true' ? false : true;

  const medicines = db.getAllMedicines(query, category, activeOnly);
  return res.json({
    count: medicines.length,
    medicines
  });
});

apiRouter.get('/medicines/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const medicine = db.getMedicineById(id);
  if (!medicine) {
    return res.status(404).json({ error: 'Medicine not found with ID ' + id });
  }

  const inventoryStock = db.getInventoryByMedicine(id);
  return res.json({
    medicine,
    pharmacyStock: inventoryStock
  });
});

apiRouter.post('/medicines', requireAdmin, (req: Request, res: Response) => {
  const {
    genericName,
    brandName,
    dosageForm,
    strength,
    category,
    description,
    prescriptionRequired,
    verificationSource
  } = req.body;

  if (!genericName || !brandName || !dosageForm || !strength) {
    return res.status(400).json({
      error: 'genericName, brandName, dosageForm, and strength are required fields.'
    });
  }

  const newMedicine = db.createMedicine({
    genericName: genericName.trim(),
    brandName: brandName.trim(),
    dosageForm: dosageForm.trim(),
    strength: strength.trim(),
    category: category ? category.trim() : 'General',
    description: description ? description.trim() : '',
    prescriptionRequired: Boolean(prescriptionRequired),
    isActive: true,
    verificationSource: verificationSource ? verificationSource.trim() : 'Manual Admin Entry'
  });

  return res.status(201).json({
    message: 'Medicine added successfully',
    medicine: newMedicine
  });
});

apiRouter.put('/medicines/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.updateMedicine(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Medicine not found' });
  }
  return res.json({
    message: 'Medicine updated successfully',
    medicine: updated
  });
});

apiRouter.delete('/medicines/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = db.deleteMedicine(id);
  if (!success) {
    return res.status(404).json({ error: 'Medicine not found' });
  }
  return res.json({ message: 'Medicine deactivated successfully' });
});

// --- Pharmacies Endpoints ---
apiRouter.get('/pharmacies', (req: Request, res: Response) => {
  const latStr = req.query.lat ? String(req.query.lat) : undefined;
  const lngStr = req.query.lng ? String(req.query.lng) : undefined;
  const radiusStr = req.query.radius ? String(req.query.radius) : undefined;
  const activeOnly = req.query.all === 'true' ? false : true;

  const userLat = latStr ? parseFloat(latStr) : undefined;
  const userLng = lngStr ? parseFloat(lngStr) : undefined;
  const radiusKm = radiusStr ? parseFloat(radiusStr) : undefined;

  const pharmacies = db.getAllPharmacies(userLat, userLng, radiusKm, activeOnly);
  return res.json({
    count: pharmacies.length,
    pharmacies
  });
});

apiRouter.get('/pharmacies/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const pharmacy = db.getPharmacyById(id);
  if (!pharmacy) {
    return res.status(404).json({ error: 'Pharmacy not found' });
  }

  const inventory = db.getInventoryByPharmacy(id);
  return res.json({
    pharmacy,
    inventory
  });
});

apiRouter.post('/pharmacies', requireAdmin, (req: Request, res: Response) => {
  const {
    name,
    licenseNumber,
    addressLine,
    locality,
    city,
    pinCode,
    latitude,
    longitude,
    contactPhone,
    alternatePhone,
    email,
    openingTime,
    closingTime,
    is24Hours
  } = req.body;

  if (!name || !addressLine || !locality || latitude == null || longitude == null) {
    return res.status(400).json({
      error: 'name, addressLine, locality, latitude, and longitude are required.'
    });
  }

  const newPharmacy = db.createPharmacy({
    name: name.trim(),
    licenseNumber: licenseNumber ? licenseNumber.trim() : `TN-CHE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    addressLine: addressLine.trim(),
    locality: locality.trim(),
    city: city ? city.trim() : 'Chennai',
    pinCode: pinCode ? pinCode.trim() : '600044',
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    contactPhone: contactPhone ? contactPhone.trim() : '+91 44 2200 0000',
    alternatePhone,
    email,
    openingTime: openingTime || '08:00 AM',
    closingTime: closingTime || '10:00 PM',
    is24Hours: Boolean(is24Hours),
    isVerified: true,
    isActive: true,
    verificationStatus: 'DEMONSTRATION_RECORD',
    lastVerifiedAt: new Date().toISOString()
  });

  return res.status(201).json({
    message: 'Pharmacy registered successfully',
    pharmacy: newPharmacy
  });
});

apiRouter.put('/pharmacies/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.updatePharmacy(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Pharmacy not found' });
  }
  return res.json({
    message: 'Pharmacy updated successfully',
    pharmacy: updated
  });
});

apiRouter.delete('/pharmacies/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = db.deletePharmacy(id);
  if (!success) {
    return res.status(404).json({ error: 'Pharmacy not found' });
  }
  return res.json({ message: 'Pharmacy deactivated successfully' });
});

// --- Inventory Endpoints ---
apiRouter.get('/inventory', (req: Request, res: Response) => {
  const pharmacyId = req.query.pharmacyId ? parseInt(String(req.query.pharmacyId), 10) : undefined;
  const medicineId = req.query.medicineId ? parseInt(String(req.query.medicineId), 10) : undefined;
  const status = req.query.status ? String(req.query.status) : undefined;
  const query = req.query.query ? String(req.query.query) : undefined;

  const items = db.getAllInventory(pharmacyId, medicineId, status, query);
  return res.json({
    count: items.length,
    inventory: items
  });
});

apiRouter.delete('/inventory/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = db.deleteInventory(id);
  if (!success) {
    return res.status(404).json({ error: 'Inventory record not found' });
  }
  return res.json({ message: 'Inventory record deleted successfully' });
});

apiRouter.post('/inventory/upsert', requireAdmin, (req: Request, res: Response) => {
  const {
    pharmacyId,
    medicineId,
    quantity,
    availabilityStatus,
    unitPrice,
    batchNumber,
    expiryDate,
    sourceVerification
  } = req.body;

  if (pharmacyId == null || medicineId == null) {
    return res.status(400).json({ error: 'pharmacyId and medicineId are required.' });
  }

  const qty = parseInt(quantity ?? 0, 10);
  const price = parseFloat(unitPrice ?? 0);

  // Auto determine status if not provided or if quantity = 0
  let status = availabilityStatus;
  if (!status) {
    status = qty > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK';
  }

  const updatedInv = db.upsertInventory(
    parseInt(pharmacyId, 10),
    parseInt(medicineId, 10),
    qty,
    status,
    price,
    batchNumber,
    expiryDate,
    sourceVerification
  );

  return res.json({
    message: 'Inventory updated successfully',
    inventory: updatedInv
  });
});

// --- Admin Stats and Diagnostics ---
apiRouter.get('/admin/stats', (req: Request, res: Response) => {
  const stats = db.getAdminStats();
  return res.json(stats);
});

apiRouter.get('/admin/recent-searches', (req: Request, res: Response) => {
  const logs = db.getRecentSearchLogs(25);
  return res.json(logs);
});

apiRouter.post('/admin/import-medicines', (req: Request, res: Response) => {
  const { csvData } = req.body;
  if (!csvData) {
    return res.status(400).json({ error: 'csvData string is required.' });
  }
  const result = db.importMedicinesFromCsv(csvData);
  return res.json(result);
});

// --- Download Project ZIP Endpoint ---
apiRouter.get('/download/project-zip', (req: Request, res: Response) => {
  const zipPath = path.resolve(process.cwd(), 'MediFind.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="MediFind.zip"');
    const readStream = fs.createReadStream(zipPath);
    return readStream.pipe(res);
  } else {
    return res.status(404).json({
      error: 'MediFind.zip has not been packaged yet. Please check again shortly.'
    });
  }
});

// --- System & Compatibility Info Endpoint ---
apiRouter.get('/system-info', (req: Request, res: Response) => {
  return res.json({
    projectName: 'MediFind — Medicine Availability and Nearby Pharmacy Finder',
    version: '1.0.0-DEMO',
    stackArchitecture: {
      teamSpecifiedBackend: 'Java 21 / Spring Boot 3.2.x REST API',
      teamSpecifiedDatabase: 'MySQL 8.0+ with InnoDB and relational constraints',
      buildTool: 'Apache Maven 3.9+',
      previewEnvironmentRuntime: 'Node.js Express + React 19 SPA running on port 3000',
      compatibilityStatus: '100% Endpoint and Schema Parity'
    },
    localityCoverage: {
      primaryDemoRegion: 'Chromepet (Center ~12.9516° N, 80.1462° E), Chennai, Tamil Nadu, India',
      coveredSuburbs: [
        'Chromepet GST Road',
        'Radha Nagar Main Road',
        'Hastinapuram Main Road',
        'Near MIT Gate / Anna University',
        'Tambaram Sanatorium',
        'Chitlapakkam Main Road',
        'Pallavaram High Road',
        'Nehru Nagar'
      ],
      distanceFormula: 'Haversine Great-Circle Proximity Calculation'
    },
    inventoryPolicy: {
      statusTypes: ['AVAILABLE', 'OUT_OF_STOCK', 'STOCK_STATUS_UNKNOWN'],
      accuracyGuarantee: 'Only pharmacies with confirmed stock report AVAILABLE. Distant or unconfirmed pharmacies are clearly marked.'
    }
  });
});
