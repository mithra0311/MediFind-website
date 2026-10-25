import React, { useEffect, useState } from 'react';
import { X, Building2, MapPin, Phone, Clock, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Pharmacy } from '../types.ts';
import { api } from '../services/api.ts';

interface PharmacyModalProps {
  pharmacyId: number | null;
  onClose: () => void;
  onSelectMedicineName: (name: string) => void;
}

export const PharmacyModal: React.FC<PharmacyModalProps> = ({
  pharmacyId,
  onClose,
  onSelectMedicineName
}) => {
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pharmacyId) {
      setIsLoading(true);
      api
        .getPharmacyById(pharmacyId)
        .then((res) => {
          setPharmacy(res.pharmacy);
          setInventory(res.inventory || []);
        })
        .catch(() => {
          setPharmacy(null);
          setInventory([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [pharmacyId]);

  if (!pharmacyId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{pharmacy?.verificationStatus || 'DEMONSTRATION_RECORD'}</span>
                </span>
                {pharmacy?.is24Hours && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    24x7 Open
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {pharmacy ? pharmacy.name : 'Loading...'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Drug License: {pharmacy?.licenseNumber}
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
        {pharmacy && (
          <div className="p-6 space-y-6">
            {/* Quick Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-xs uppercase">Address & Locality</div>
                  <div>{pharmacy.addressLine}</div>
                  <div className="text-xs text-slate-500 font-semibold">{pharmacy.locality}, {pharmacy.city} - {pharmacy.pinCode}</div>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-xs uppercase">Contact & Calling</div>
                  <a href={`tel:${pharmacy.contactPhone}`} className="text-teal-700 font-bold hover:underline">
                    {pharmacy.contactPhone}
                  </a>
                  {pharmacy.alternatePhone && (
                    <div className="text-xs text-slate-500">Alt: {pharmacy.alternatePhone}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-xs uppercase">Operating Hours</div>
                  <div>{pharmacy.is24Hours ? 'Open 24 Hours / 7 Days' : `${pharmacy.openingTime} - ${pharmacy.closingTime}`}</div>
                  <div className="text-xs text-emerald-600 font-semibold">Service Active</div>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-xs uppercase">GPS Coordinates</div>
                  <div className="font-mono text-xs text-slate-700">{pharmacy.latitude}° N, {pharmacy.longitude}° E</div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-teal-700 font-bold mt-1 hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Inventory List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Tracked Medicines Stocked at this Pharmacy ({inventory.length})
                </h4>
                <span className="text-xs text-slate-400">Live POS Linked</span>
              </div>

              {isLoading ? (
                <div className="text-center py-4 text-sm text-slate-400">Loading catalogued inventory...</div>
              ) : inventory.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  No stock records entered for this pharmacy yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {inventory.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {inv.medicine?.brandName}
                          <span className="text-xs font-normal text-slate-500 ml-1.5">
                            ({inv.medicine?.genericName})
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {inv.medicine?.strength} • {inv.medicine?.dosageForm}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-800">
                            {inv.quantity > 0 ? (
                              <span className="text-emerald-700 font-extrabold">{inv.quantity} in stock</span>
                            ) : (
                              <span className="text-rose-600 font-bold">Out of stock</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {inv.batchNumber || 'Batch Active'}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectMedicineName(inv.medicine?.brandName || '');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 rounded-lg text-slate-700 transition-colors"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
