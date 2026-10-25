import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Info,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { SearchResponse, PharmacyStockResult, Medicine } from '../types.ts';

interface ResultsViewProps {
  results: SearchResponse | null;
  searchedTerm: string;
  onSelectMedicine: (medicine: Medicine) => void;
  onSelectPharmacy: (pharmacyId: number) => void;
  onSwitchMedicine: (medName: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  searchedTerm,
  onSelectMedicine,
  onSelectPharmacy,
  onSwitchMedicine
}) => {
  if (!results) {
    return null;
  }

  // If no medicines found
  if (!results.primaryMedicine || results.matchedMedicines.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <XCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          No Medicine Found for &ldquo;{searchedTerm}&rdquo;
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          We searched our verified pharmaceutical catalogue, but found no matching brand or generic salt name. Please verify the spelling or search by therapeutic category.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Dolo 650', 'Augmentin', 'Azithral', 'Paracetamol', 'Glycomet'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSwitchMedicine(suggestion)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 transition-colors"
            >
              Try &ldquo;{suggestion}&rdquo;
            </button>
          ))}
        </div>
      </div>
    );
  }

  const primaryMed = results.primaryMedicine;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Primary Medicine Feature Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-teal-200 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                {primaryMed.category}
              </span>
              {primaryMed.prescriptionRequired ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Rx Prescription Required (Schedule H)</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Over-The-Counter (OTC)
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {primaryMed.brandName}
              <span className="text-base sm:text-lg font-normal text-slate-500 ml-2">
                ({primaryMed.genericName})
              </span>
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">Dosage Form:</span>{' '}
                {primaryMed.dosageForm}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Strength:</span>{' '}
                {primaryMed.strength}
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {primaryMed.description}
            </p>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end justify-between gap-2 shrink-0">
            <button
              onClick={() => onSelectMedicine(primaryMed)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>Drug Monograph</span>
            </button>
            <div className="text-[11px] text-slate-400">
              Source: {primaryMed.verificationSource}
            </div>
          </div>
        </div>

        {/* Alternative matches in catalogue */}
        {results.matchedMedicines.length > 1 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Other Formulations Matching &ldquo;{searchedTerm}&rdquo; ({results.matchedMedicines.length - 1}):
            </div>
            <div className="flex flex-wrap gap-2">
              {results.matchedMedicines
                .filter((m) => m.id !== primaryMed.id)
                .map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => onSwitchMedicine(alt.brandName)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-700 transition-colors"
                  >
                    {alt.brandName} ({alt.strength} {alt.dosageForm})
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* TIER 1: CONFIRMED IN STOCK */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Confirmed In Stock ({results.confirmedAvailable.length})
              </h3>
              <p className="text-xs text-slate-500">
                Verified inventory logs matching {primaryMed.brandName} within {results.radiusKm} km radius
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Stock Confirmed
          </span>
        </div>

        {results.confirmedAvailable.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="font-bold text-slate-700 mb-1">
              No Confirmed Stock Within {results.radiusKm} km
            </div>
            <p className="text-xs max-w-md mx-auto">
              None of the registered pharmacies within {results.radiusKm} km currently report confirmed stock of {primaryMed.brandName}. Try expanding your search radius to 10 km or call the unconfirmed pharmacies below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.confirmedAvailable.map((item) => (
              <PharmacyCard
                key={item.pharmacyId}
                item={item}
                status="AVAILABLE"
                onViewDetails={() => onSelectPharmacy(item.pharmacyId)}
              />
            ))}
          </div>
        )}
      </section>

      {/* TIER 2: CONFIRMED OUT OF STOCK */}
      {results.outOfStock.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Confirmed Out of Stock ({results.outOfStock.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Tracked inventory reported depleted by pharmacist
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              0 Units Left
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.outOfStock.map((item) => (
              <PharmacyCard
                key={item.pharmacyId}
                item={item}
                status="OUT_OF_STOCK"
                onViewDetails={() => onSelectPharmacy(item.pharmacyId)}
              />
            ))}
          </div>
        </section>
      )}

      {/* TIER 3: STOCK STATUS UNKNOWN (CALL AHEAD) */}
      {results.unknownStock.length > 0 && (
        <section className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Stock Status Unconfirmed — Call Ahead ({results.unknownStock.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Pharmacies located nearby without an automated live stock feed for {primaryMed.brandName}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
              Inquire by Phone
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.unknownStock.map((item) => (
              <PharmacyCard
                key={item.pharmacyId}
                item={item}
                status="STOCK_STATUS_UNKNOWN"
                onViewDetails={() => onSelectPharmacy(item.pharmacyId)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

interface PharmacyCardProps {
  item: PharmacyStockResult;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'STOCK_STATUS_UNKNOWN';
  onViewDetails: () => void;
}

const PharmacyCard: React.FC<PharmacyCardProps> = ({ item, status, onViewDetails }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
              {item.pharmacyName}
            </h4>
            <div className="text-xs text-slate-500">{item.locality}</div>
          </div>
          <div>
            {status === 'AVAILABLE' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>{item.inventory.quantity} in stock</span>
              </span>
            )}
            {status === 'OUT_OF_STOCK' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                <XCircle className="w-3 h-3" />
                <span>Out of stock</span>
              </span>
            )}
            {status === 'STOCK_STATUS_UNKNOWN' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3 h-3" />
                <span>Unconfirmed</span>
              </span>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{item.address}</span>
        </div>

        {/* Contact Phone */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <a
            href={`tel:${item.contactPhone}`}
            className="text-teal-700 font-semibold hover:underline"
          >
            {item.contactPhone}
          </a>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {item.is24Hours ? (
              <strong className="text-emerald-700">Open 24x7</strong>
            ) : (
              `${item.openingTime} – ${item.closingTime}`
            )}
          </span>
        </div>

        {/* Stock details footnote */}
        {status === 'AVAILABLE' && item.inventory.lastUpdatedAt && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Updated: {new Date(item.inventory.lastUpdatedAt).toLocaleDateString()} via {item.inventory.sourceVerification}</span>
          </div>
        )}
      </div>

      {/* Footer Distance & Actions (Prices strictly omitted) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          {item.distanceKm != null && (
            <div className="text-xs font-bold text-teal-600 flex items-center gap-0.5">
              <span>{item.distanceKm.toFixed(2)} km away</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onViewDetails}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
            title="View Pharmacy Info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <span>Directions</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
