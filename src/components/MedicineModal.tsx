import React, { useEffect, useState } from 'react';
import { X, Pill, ShieldAlert, CheckCircle2, MapPin, Building2 } from 'lucide-react';
import { Medicine } from '../types.ts';
import { api } from '../services/api.ts';

interface MedicineModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onSelectPharmacy: (pharmacyId: number) => void;
}

export const MedicineModal: React.FC<MedicineModalProps> = ({
  medicine,
  onClose,
  onSelectPharmacy
}) => {
  const [stockList, setStockList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (medicine) {
      setIsLoading(true);
      api
        .getMedicineById(medicine.id)
        .then((res) => {
          setStockList(res.pharmacyStock || []);
        })
        .catch(() => setStockList([]))
        .finally(() => setIsLoading(false));
    }
  }, [medicine]);

  if (!medicine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {medicine.category}
                </span>
                {medicine.prescriptionRequired && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Rx Only</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {medicine.brandName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Generic: {medicine.genericName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Strength</span>
              <div className="text-sm font-extrabold text-slate-800">{medicine.strength}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Dosage Form</span>
              <div className="text-sm font-extrabold text-slate-800">{medicine.dosageForm}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Status</span>
              <div className="text-sm font-extrabold text-emerald-600">Active Catalogue</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Catalogue ID</span>
              <div className="text-sm font-extrabold text-slate-800">MED-{medicine.id}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Therapeutic Description & Indications
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              {medicine.description || 'No detailed clinical monograph provided.'}
            </p>
          </div>

          {/* Verification Source */}
          <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>Verified Source: <strong>{medicine.verificationSource}</strong></span>
            <span>Regulated under CDSCO (India)</span>
          </div>

          {/* Associated Stock Records */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>Current Stock Records Across Pharmacies ({stockList.length})</span>
            </h4>

            {isLoading ? (
              <div className="text-center py-4 text-sm text-slate-400">Loading pharmacy stock...</div>
            ) : stockList.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                No active inventory logs recorded for this medicine yet.
              </div>
            ) : (
              <div className="space-y-2">
                {stockList.map((inv: any) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {inv.pharmacy.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{inv.pharmacy.locality}, {inv.pharmacy.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {inv.quantity > 0 ? `${inv.quantity} units` : '0 units'}
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          inv.availabilityStatus === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {inv.availabilityStatus === 'AVAILABLE' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectPharmacy(inv.pharmacy.id);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors"
                      >
                        View Pharmacy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
