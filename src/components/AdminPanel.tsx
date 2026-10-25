import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Pill,
  Building2,
  Package,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  MapPin,
  Clock,
  Phone,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Medicine, Pharmacy, AdminStats, InventoryItem, User } from '../types.ts';
import { api } from '../services/api.ts';
import { SUPPORTED_LOCALITIES } from './SearchSection.tsx';

interface AdminPanelProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigateHome
}) => {
  const [activeMenu, setActiveMenu] = useState<'overview' | 'medicines' | 'pharmacies' | 'inventory'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filters
  const [medicineFilter, setMedicineFilter] = useState('');
  const [pharmacyFilter, setPharmacyFilter] = useState('');
  const [invSearchQuery, setInvSearchQuery] = useState('');
  const [invPharmacyFilter, setInvPharmacyFilter] = useState<string>('ALL');
  const [invStatusFilter, setInvStatusFilter] = useState<string>('ALL');

  // Modals for Add/Edit
  const [medicineModalMode, setMedicineModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const [pharmacyModalMode, setPharmacyModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);

  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<InventoryItem | null>(null);

  // Medicine Form Fields
  const [medGeneric, setMedGeneric] = useState('');
  const [medBrand, setMedBrand] = useState('');
  const [medCategory, setMedCategory] = useState('');
  const [medStrength, setMedStrength] = useState('');
  const [medDosageForm, setMedDosageForm] = useState('Tablet');
  const [medPrescription, setMedPrescription] = useState(false);
  const [medDescription, setMedDescription] = useState('');

  // Pharmacy Form Fields
  const [pharmName, setPharmName] = useState('');
  const [pharmLicense, setPharmLicense] = useState('');
  const [pharmAddress, setPharmAddress] = useState('');
  const [pharmLocality, setPharmLocality] = useState('Chrompet');
  const [pharmCustomLocality, setPharmCustomLocality] = useState('');
  const [pharmLat, setPharmLat] = useState('12.9516');
  const [pharmLng, setPharmLng] = useState('80.1462');
  const [pharmPhone, setPharmPhone] = useState('');
  const [pharm24h, setPharm24h] = useState(false);
  const [pharmOpening, setPharmOpening] = useState('08:00 AM');
  const [pharmClosing, setPharmClosing] = useState('10:00 PM');

  // Inventory Form Fields
  const [invPharmacyId, setInvPharmacyId] = useState<number | ''>('');
  const [invMedicineId, setInvMedicineId] = useState<number | ''>('');
  const [invQty, setInvQty] = useState<number>(30);
  const [invStatus, setInvStatus] = useState<string>('AVAILABLE');
  const [invPrice, setInvPrice] = useState<number>(45.0);
  const [invBatch, setInvBatch] = useState('BAT-2026');

  // Delete Confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'medicine' | 'pharmacy' | 'inventory';
    id: number;
    name: string;
  } | null>(null);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [s, m, p, inv] = await Promise.all([
        api.getAdminStats(),
        api.getMedicines(undefined, undefined, true),
        api.getPharmacies(undefined, undefined, undefined, true),
        api.getAllInventory()
      ]);
      setStats(s);
      setMedicines(m.medicines || []);
      setPharmacies(p.pharmacies || []);
      setInventoryList(inv.inventory || []);

      if (p.pharmacies && p.pharmacies.length > 0 && invPharmacyId === '') {
        setInvPharmacyId(p.pharmacies[0].id);
      }
      if (m.medicines && m.medicines.length > 0 && invMedicineId === '') {
        setInvMedicineId(m.medicines[0].id);
      }
    } catch (e: any) {
      setMessage({ text: e.message || 'Failed to load administrative data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      loadAllData();
    }
  }, [currentUser]);

  // Auth gate
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Administrator Access Required
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
          The Admin Dashboard is strictly reserved for authorized healthcare system and pharmacy administrators. Please authenticate with administrator credentials to manage catalogue medicines, pharmacies, and inventory stock.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all"
          >
            Sign In as Administrator
          </button>
          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
          >
            Return to Public Search
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
          Tip: Use the one-click <strong>Demo Admin</strong> button in the Sign In modal for testing.
        </div>
      </div>
    );
  }

  // --- Medicine Handlers ---
  const handleOpenAddMedicine = () => {
    setEditingMedicine(null);
    setMedGeneric('');
    setMedBrand('');
    setMedCategory('');
    setMedStrength('');
    setMedDosageForm('Tablet');
    setMedPrescription(false);
    setMedDescription('');
    setMedicineModalMode('add');
  };

  const handleOpenEditMedicine = (med: Medicine) => {
    setEditingMedicine(med);
    setMedGeneric(med.genericName);
    setMedBrand(med.brandName);
    setMedCategory(med.category);
    setMedStrength(med.strength);
    setMedDosageForm(med.dosageForm);
    setMedPrescription(med.prescriptionRequired);
    setMedDescription(med.description || '');
    setMedicineModalMode('edit');
  };

  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medGeneric.trim() || !medBrand.trim() || !medStrength.trim()) {
      setMessage({ text: 'Generic name, brand name, and strength are required.', type: 'error' });
      return;
    }

    try {
      if (medicineModalMode === 'add') {
        const res = await api.createMedicine({
          genericName: medGeneric.trim(),
          brandName: medBrand.trim(),
          category: medCategory.trim() || 'General Formulation',
          strength: medStrength.trim(),
          dosageForm: medDosageForm,
          prescriptionRequired: medPrescription,
          description: medDescription.trim() || `${medGeneric} ${medStrength} ${medDosageForm}`,
          verificationSource: 'Admin Catalogue Entry'
        });
        setMessage({ text: `Medicine "${res.medicine.brandName}" created and is now searchable!`, type: 'success' });
      } else if (medicineModalMode === 'edit' && editingMedicine) {
        const res = await api.updateMedicine(editingMedicine.id, {
          genericName: medGeneric.trim(),
          brandName: medBrand.trim(),
          category: medCategory.trim(),
          strength: medStrength.trim(),
          dosageForm: medDosageForm,
          prescriptionRequired: medPrescription,
          description: medDescription.trim()
        });
        setMessage({ text: `Medicine "${res.medicine.brandName}" updated successfully!`, type: 'success' });
      }
      setMedicineModalMode(null);
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to save medicine.', type: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'medicine') {
        await api.deleteMedicine(deleteConfirm.id);
        setMessage({ text: `Medicine record deactivated successfully.`, type: 'success' });
      } else if (deleteConfirm.type === 'pharmacy') {
        await api.deletePharmacy(deleteConfirm.id);
        setMessage({ text: `Pharmacy record deactivated successfully.`, type: 'success' });
      } else if (deleteConfirm.type === 'inventory') {
        await api.deleteInventory(deleteConfirm.id);
        setMessage({ text: `Inventory stock entry deleted successfully.`, type: 'success' });
      }
      setDeleteConfirm(null);
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Operation failed.', type: 'error' });
    }
  };

  // --- Pharmacy Handlers ---
  const handleOpenAddPharmacy = () => {
    setEditingPharmacy(null);
    setPharmName('');
    setPharmLicense('');
    setPharmAddress('');
    setPharmLocality('Chrompet');
    setPharmCustomLocality('');
    setPharmLat('12.9516');
    setPharmLng('80.1462');
    setPharmPhone('');
    setPharm24h(false);
    setPharmOpening('08:00 AM');
    setPharmClosing('10:00 PM');
    setPharmacyModalMode('add');
  };

  const handleOpenEditPharmacy = (pharm: Pharmacy) => {
    setEditingPharmacy(pharm);
    setPharmName(pharm.name);
    setPharmLicense(pharm.licenseNumber);
    setPharmAddress(pharm.addressLine);
    setPharmLocality(pharm.locality);
    setPharmCustomLocality('');
    setPharmLat(pharm.latitude.toString());
    setPharmLng(pharm.longitude.toString());
    setPharmPhone(pharm.contactPhone);
    setPharm24h(pharm.is24Hours);
    setPharmOpening(pharm.openingTime);
    setPharmClosing(pharm.closingTime);
    setPharmacyModalMode('edit');
  };

  const handleSavePharmacy = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocality = pharmLocality === 'OTHER' ? pharmCustomLocality.trim() : pharmLocality;
    if (!pharmName.trim() || !pharmAddress.trim() || !finalLocality) {
      setMessage({ text: 'Pharmacy name, address, and locality are required.', type: 'error' });
      return;
    }

    const lat = parseFloat(pharmLat);
    const lng = parseFloat(pharmLng);
    if (isNaN(lat) || isNaN(lng)) {
      setMessage({ text: 'Please enter valid numerical coordinates.', type: 'error' });
      return;
    }

    try {
      if (pharmacyModalMode === 'add') {
        const res = await api.createPharmacy({
          name: pharmName.trim(),
          licenseNumber: pharmLicense.trim() || `TN-CHE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          addressLine: pharmAddress.trim(),
          locality: finalLocality,
          city: 'Chennai',
          pinCode: '600044',
          latitude: lat,
          longitude: lng,
          contactPhone: pharmPhone.trim() || '+91 44 2200 0000',
          is24Hours: pharm24h,
          openingTime: pharm24h ? '00:00 AM' : pharmOpening,
          closingTime: pharm24h ? '11:59 PM' : pharmClosing
        });
        setMessage({ text: `Pharmacy "${res.pharmacy.name}" registered and active!`, type: 'success' });
      } else if (pharmacyModalMode === 'edit' && editingPharmacy) {
        const res = await api.updatePharmacy(editingPharmacy.id, {
          name: pharmName.trim(),
          licenseNumber: pharmLicense.trim(),
          addressLine: pharmAddress.trim(),
          locality: finalLocality,
          latitude: lat,
          longitude: lng,
          contactPhone: pharmPhone.trim(),
          is24Hours: pharm24h,
          openingTime: pharm24h ? '00:00 AM' : pharmOpening,
          closingTime: pharm24h ? '11:59 PM' : pharmClosing
        });
        setMessage({ text: `Pharmacy "${res.pharmacy.name}" updated successfully!`, type: 'success' });
      }
      setPharmacyModalMode(null);
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to save pharmacy record.', type: 'error' });
    }
  };

  // --- Inventory Handlers ---
  const handleOpenAddStock = () => {
    setEditingInventory(null);
    if (pharmacies.length > 0) setInvPharmacyId(pharmacies[0].id);
    if (medicines.length > 0) setInvMedicineId(medicines[0].id);
    setInvQty(30);
    setInvStatus('AVAILABLE');
    setInvPrice(45.0);
    setInvBatch('BAT-' + Math.floor(1000 + Math.random() * 9000));
    setInventoryModalOpen(true);
  };

  const handleOpenEditStock = (inv: InventoryItem) => {
    setEditingInventory(inv);
    setInvPharmacyId(inv.pharmacyId);
    setInvMedicineId(inv.medicineId);
    setInvQty(inv.quantity);
    setInvStatus(inv.availabilityStatus);
    setInvPrice(inv.unitPrice);
    setInvBatch(inv.batchNumber);
    setInventoryModalOpen(true);
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invPharmacyId || !invMedicineId) {
      setMessage({ text: 'Please select both pharmacy and medicine.', type: 'error' });
      return;
    }

    try {
      await api.upsertInventory({
        pharmacyId: Number(invPharmacyId),
        medicineId: Number(invMedicineId),
        quantity: Number(invQty),
        availabilityStatus: invStatus,
        unitPrice: Number(invPrice),
        batchNumber: invBatch,
        sourceVerification: 'Admin Dashboard Update'
      });
      setMessage({ text: 'Inventory stock level saved and public results updated!', type: 'success' });
      setInventoryModalOpen(false);
      loadAllData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update inventory record.', type: 'error' });
    }
  };

  // Filtered lists
  const filteredMedicines = medicines.filter(
    (m) =>
      m.brandName.toLowerCase().includes(medicineFilter.toLowerCase()) ||
      m.genericName.toLowerCase().includes(medicineFilter.toLowerCase()) ||
      m.category.toLowerCase().includes(medicineFilter.toLowerCase())
  );

  const filteredPharmacies = pharmacies.filter(
    (p) =>
      p.name.toLowerCase().includes(pharmacyFilter.toLowerCase()) ||
      p.locality.toLowerCase().includes(pharmacyFilter.toLowerCase()) ||
      p.addressLine.toLowerCase().includes(pharmacyFilter.toLowerCase())
  );

  const filteredInventory = inventoryList.filter((item) => {
    if (invPharmacyFilter !== 'ALL' && item.pharmacyId !== Number(invPharmacyFilter)) return false;
    if (invStatusFilter !== 'ALL' && item.availabilityStatus !== invStatusFilter) return false;
    if (invSearchQuery.trim()) {
      const q = invSearchQuery.toLowerCase();
      const matchMed =
        item.medicine.brandName.toLowerCase().includes(q) ||
        item.medicine.genericName.toLowerCase().includes(q);
      const matchPharm =
        item.pharmacy.name.toLowerCase().includes(q) ||
        item.pharmacy.locality.toLowerCase().includes(q);
      if (!matchMed && !matchPharm) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[750px]">
      {/* 1. DEDICATED ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shrink-0 border-r border-slate-800">
        <div>
          {/* Sidebar Brand / User Header */}
          <div className="p-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Medifind Admin Dashboard</span>
            </div>
            <div className="font-black text-base text-white truncate">{currentUser.name}</div>
            <div className="text-xs text-slate-400 font-mono truncate">{currentUser.email}</div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveMenu('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                activeMenu === 'overview'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveMenu('medicines')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                activeMenu === 'medicines'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Pill className="w-4 h-4" />
                <span>Medicine Management</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                {medicines.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMenu('pharmacies')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                activeMenu === 'pharmacies'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4" />
                <span>Pharmacy Management</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                {pharmacies.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMenu('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                activeMenu === 'inventory'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Inventory &amp; Stock</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                {inventoryList.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span>&larr; View Public Search</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Administrator</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
        {/* Top Notification Bar */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-semibold flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-xs font-extrabold uppercase hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* MENU 1: DASHBOARD OVERVIEW */}
        {/* ============================================================ */}
        {activeMenu === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Medifind Admin Dashboard</h2>
                <p className="text-xs text-slate-500">
                  Key database metrics and inventory health calculated live from the persistent store
                </p>
              </div>
              <button
                onClick={loadAllData}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Live Counts</span>
              </button>
            </div>

            {/* 6 Summary Cards */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Medicines
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalMedicines}</div>
                  <span className="text-[10px] text-teal-600 font-semibold">Active in catalogue</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Pharmacies
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalPharmacies}</div>
                  <span className="text-[10px] text-teal-600 font-semibold">Registered Chemists</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Inventory
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalInventoryEntries}</div>
                  <span className="text-[10px] text-slate-500 font-semibold">Tracked Stock Items</span>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Available Stock
                  </span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{stats.availableStockCount}</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Units ready on shelf</span>
                </div>

                <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 shadow-xs">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                    Out of Stock
                  </span>
                  <div className="text-2xl font-black text-rose-700 mt-1">{stats.outOfStockCount}</div>
                  <span className="text-[10px] text-rose-700 font-semibold">0 units depleted</span>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    Unknown Status
                  </span>
                  <div className="text-2xl font-black text-amber-700 mt-1">{stats.unknownStockCount}</div>
                  <span className="text-[10px] text-amber-700 font-semibold">Call ahead needed</span>
                </div>
              </div>
            )}

            {/* Quick Actions & Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase">
                  <Pill className="w-4 h-4" />
                  <span>Catalogue Control</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Add New Medicine</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter new generic and brand formulations with clinical indications. Immediately searchable by patients.
                </p>
                <button
                  onClick={() => {
                    setActiveMenu('medicines');
                    handleOpenAddMedicine();
                  }}
                  className="w-full py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors"
                >
                  + Add Medicine
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase">
                  <Building2 className="w-4 h-4" />
                  <span>Pharmacy Directory</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Register New Pharmacy</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Register chemists across Chrompet, Pallavaram, Velachery, Medavakkam, etc., with precise decimal GPS coordinates.
                </p>
                <button
                  onClick={() => {
                    setActiveMenu('pharmacies');
                    handleOpenAddPharmacy();
                  }}
                  className="w-full py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors"
                >
                  + Register Pharmacy
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase">
                  <Package className="w-4 h-4" />
                  <span>Inventory Control</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Update Stock &amp; Pricing</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Adjust shelf quantities, availability statuses (AVAILABLE, OUT_OF_STOCK, UNKNOWN), and unit prices in ₹.
                </p>
                <button
                  onClick={() => {
                    setActiveMenu('inventory');
                    handleOpenAddStock();
                  }}
                  className="w-full py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors"
                >
                  + Update Inventory
                </button>
              </div>
            </div>

            {/* Initial Admin Documentation Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-2">
                Administrative Security &amp; Initial Account Setup
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Administrators are authorized with salted SHA-256 password hashing. In production, initial administrators are seeded securely through <code>database/seed.sql</code> or configured in <code>application.properties</code> using environment variables (no hardcoded passwords).
              </p>
              <div className="bg-slate-900 text-slate-300 p-3 rounded-xl font-mono text-xs overflow-x-auto">
{`-- MySQL Seed for Initial Administrator
INSERT INTO users (name, email, password_hash, role) VALUES 
('Chief Administrator', 'admin@medifind.org', SHA2('Admin@1234', 256), 'ADMIN');`}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MENU 2: MEDICINE MANAGEMENT */}
        {/* ============================================================ */}
        {activeMenu === 'medicines' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Medicine Management</h2>
                <p className="text-xs text-slate-500">
                  Manage pharmaceutical formulations, categories, and Schedule H prescription rules
                </p>
              </div>
              <button
                onClick={handleOpenAddMedicine}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
            </div>

            {/* Filter Search */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                placeholder="Search by brand name, generic salt, or category..."
                value={medicineFilter}
                onChange={(e) => setMedicineFilter(e.target.value)}
                className="w-full text-xs font-medium focus:outline-none bg-transparent"
              />
              {medicineFilter && (
                <button
                  onClick={() => setMedicineFilter('')}
                  className="text-xs text-slate-400 hover:text-slate-600 mr-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Medicines Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                      <th className="p-3">ID</th>
                      <th className="p-3">Brand Name</th>
                      <th className="p-3">Generic Composition</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Strength &amp; Form</th>
                      <th className="p-3">Rx Class</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMedicines.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono text-slate-400">MED-{m.id}</td>
                        <td className="p-3 font-bold text-slate-900">{m.brandName}</td>
                        <td className="p-3 text-slate-600">{m.genericName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                            {m.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">
                          {m.strength} • {m.dosageForm}
                        </td>
                        <td className="p-3">
                          {m.prescriptionRequired ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                              Rx Required
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                              OTC
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {m.isActive ? (
                            <span className="text-emerald-700 font-bold">Active</span>
                          ) : (
                            <span className="text-slate-400 font-semibold">Deactivated</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditMedicine(m)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                              title="Edit medicine"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'medicine',
                                  id: m.id,
                                  name: m.brandName
                                })
                              }
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="Deactivate medicine"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MENU 3: PHARMACY MANAGEMENT */}
        {/* ============================================================ */}
        {activeMenu === 'pharmacies' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Pharmacy Management</h2>
                <p className="text-xs text-slate-500">
                  Register, verify, and maintain pharmacy locations across all supported localities
                </p>
              </div>
              <button
                onClick={handleOpenAddPharmacy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Register Pharmacy</span>
              </button>
            </div>

            {/* Filter Search */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                placeholder="Search by pharmacy name, locality (Chrompet, Velachery, Madipakkam, etc.), or street..."
                value={pharmacyFilter}
                onChange={(e) => setPharmacyFilter(e.target.value)}
                className="w-full text-xs font-medium focus:outline-none bg-transparent"
              />
              {pharmacyFilter && (
                <button
                  onClick={() => setPharmacyFilter('')}
                  className="text-xs text-slate-400 hover:text-slate-600 mr-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Pharmacies Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                      <th className="p-3">ID</th>
                      <th className="p-3">Pharmacy Name</th>
                      <th className="p-3">Locality</th>
                      <th className="p-3">Address</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">GPS Coordinates</th>
                      <th className="p-3">Hours</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPharmacies.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono text-slate-400">PH-{p.id}</td>
                        <td className="p-3 font-bold text-slate-900">{p.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200">
                            {p.locality}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 max-w-[200px] truncate">{p.addressLine}</td>
                        <td className="p-3 text-slate-700 font-medium">{p.contactPhone}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">
                          {p.latitude}°N, {p.longitude}°E
                        </td>
                        <td className="p-3">
                          {p.is24Hours ? (
                            <span className="text-emerald-700 font-bold">24x7</span>
                          ) : (
                            <span className="text-slate-600">{p.openingTime} - {p.closingTime}</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditPharmacy(p)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                              title="Edit pharmacy details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'pharmacy',
                                  id: p.id,
                                  name: p.name
                                })
                              }
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="Deactivate pharmacy"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MENU 4: INVENTORY & STOCK MANAGEMENT */}
        {/* ============================================================ */}
        {activeMenu === 'inventory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Inventory &amp; Stock Management</h2>
                <p className="text-xs text-slate-500">
                  Track stock quantities, availability statuses, and batch timestamps per chemist
                </p>
              </div>
              <button
                onClick={handleOpenAddStock}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add / Update Stock</span>
              </button>
            </div>

            {/* Filter Search Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by medicine or pharmacy name..."
                  value={invSearchQuery}
                  onChange={(e) => setInvSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={invPharmacyFilter}
                  onChange={(e) => setInvPharmacyFilter(e.target.value)}
                  className="w-full py-1.5 px-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50"
                >
                  <option value="ALL">All Pharmacies ({pharmacies.length})</option>
                  {pharmacies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.locality})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={invStatusFilter}
                  onChange={(e) => setInvStatusFilter(e.target.value)}
                  className="w-full py-1.5 px-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="AVAILABLE">AVAILABLE (In Stock)</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                  <option value="STOCK_STATUS_UNKNOWN">STOCK_STATUS_UNKNOWN</option>
                </select>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                      <th className="p-3">Medicine</th>
                      <th className="p-3">Pharmacy &amp; Locality</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Availability Status</th>
                      <th className="p-3">Batch Code</th>
                      <th className="p-3">Last Verified</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{item.medicine.brandName}</div>
                          <div className="text-[11px] text-slate-500">
                            {item.medicine.genericName} ({item.medicine.strength})
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{item.pharmacy.name}</div>
                          <div className="text-[11px] text-teal-700 font-medium">
                            {item.pharmacy.locality}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          {item.quantity} units
                        </td>
                        <td className="p-3">
                          {item.availabilityStatus === 'AVAILABLE' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                              AVAILABLE
                            </span>
                          )}
                          {item.availabilityStatus === 'OUT_OF_STOCK' && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                              OUT_OF_STOCK
                            </span>
                          )}
                          {item.availabilityStatus === 'STOCK_STATUS_UNKNOWN' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                              UNKNOWN
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-700">
                          {item.batchNumber || 'BAT-2026'}
                        </td>
                        <td className="p-3 text-[11px] text-slate-500">
                          {item.lastUpdatedAt ? new Date(item.lastUpdatedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditStock(item)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                              title="Edit stock details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'inventory',
                                  id: item.id,
                                  name: `${item.medicine.brandName} at ${item.pharmacy.name}`
                                })
                              }
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="Delete stock entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: MEDICINE ADD / EDIT */}
      {/* ============================================================ */}
      {medicineModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {medicineModalMode === 'add' ? 'Add New Medicine' : 'Edit Medicine Details'}
              </h3>
              <button
                onClick={() => setMedicineModalMode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dolo 650"
                    value={medBrand}
                    onChange={(e) => setMedBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Generic Salt *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol"
                    value={medGeneric}
                    onChange={(e) => setMedGeneric(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Strength *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 650 mg"
                    value={medStrength}
                    onChange={(e) => setMedStrength(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Dosage Form
                  </label>
                  <select
                    value={medDosageForm}
                    onChange={(e) => setMedDosageForm(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Sachet">Sachet</option>
                    <option value="Injection">Injection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Therapeutic Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Analgesic & Antipyretic"
                    value={medCategory}
                    onChange={(e) => setMedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="med-rx-box"
                    checked={medPrescription}
                    onChange={(e) => setMedPrescription(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <label htmlFor="med-rx-box" className="text-xs font-bold text-slate-700">
                    Schedule H (Rx Required)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Description / Monograph
                </label>
                <textarea
                  rows={2}
                  placeholder="Clinical indications and dosage instructions..."
                  value={medDescription}
                  onChange={(e) => setMedDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMedicineModalMode(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: PHARMACY ADD / EDIT */}
      {/* ============================================================ */}
      {pharmacyModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {pharmacyModalMode === 'add' ? 'Register New Pharmacy' : 'Edit Pharmacy Details'}
              </h3>
              <button
                onClick={() => setPharmacyModalMode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePharmacy} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Pharmacy Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Pharmacy"
                  value={pharmName}
                  onChange={(e) => setPharmName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Drug License Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. TN-CHE-2026-A1092"
                  value={pharmLicense}
                  onChange={(e) => setPharmLicense(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Address Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No. 42, Velachery Main Road"
                  value={pharmAddress}
                  onChange={(e) => setPharmAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Locality *
                </label>
                <select
                  value={pharmLocality}
                  onChange={(e) => setPharmLocality(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50 mb-2"
                >
                  {SUPPORTED_LOCALITIES.map((loc) => (
                    <option key={loc.id} value={loc.locality}>
                      {loc.name}
                    </option>
                  ))}
                  <option value="OTHER">+ Other Locality...</option>
                </select>

                {pharmLocality === 'OTHER' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom locality name..."
                    value={pharmCustomLocality}
                    onChange={(e) => setPharmCustomLocality(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-teal-300 text-xs font-medium"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Latitude (°N) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={pharmLat}
                    onChange={(e) => setPharmLat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Longitude (°E) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={pharmLng}
                    onChange={(e) => setPharmLng(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 44 2200 0000"
                  value={pharmPhone}
                  onChange={(e) => setPharmPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pharm-24h-input"
                  checked={pharm24h}
                  onChange={(e) => setPharm24h(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="pharm-24h-input" className="text-xs font-bold text-slate-700">
                  Open 24x7 (Night Chemist)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPharmacyModalMode(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md"
                >
                  Save Pharmacy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: INVENTORY ADD / EDIT */}
      {/* ============================================================ */}
      {inventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingInventory ? 'Update Stock & Availability' : 'Add Inventory Stock'}
              </h3>
              <button
                onClick={() => setInventoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Select Pharmacy *
                </label>
                <select
                  disabled={Boolean(editingInventory)}
                  value={invPharmacyId}
                  onChange={(e) => setInvPharmacyId(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50 disabled:opacity-70"
                  required
                >
                  {pharmacies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.locality})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Select Medicine *
                </label>
                <select
                  disabled={Boolean(editingInventory)}
                  value={invMedicineId}
                  onChange={(e) => setInvMedicineId(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50 disabled:opacity-70"
                  required
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brandName} — {m.genericName} ({m.strength})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Availability Status *
                  </label>
                  <select
                    value={invStatus}
                    onChange={(e) => setInvStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50"
                  >
                    <option value="AVAILABLE">AVAILABLE (In Stock)</option>
                    <option value="OUT_OF_STOCK">OUT_OF_STOCK (0 Units)</option>
                    <option value="STOCK_STATUS_UNKNOWN">STOCK_STATUS_UNKNOWN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={invQty}
                    onChange={(e) => setInvQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Batch Code / Lot Number
                </label>
                <input
                  type="text"
                  value={invBatch}
                  onChange={(e) => setInvBatch(e.target.value)}
                  placeholder="e.g. BAT-2026-X1"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInventoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md"
                >
                  Save Stock Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ============================================================ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">
              Confirm Record Removal
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to remove &ldquo;{deleteConfirm.name}&rdquo;? Changes will be immediately saved to the persistent database.
            </p>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Yes, Remove Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
