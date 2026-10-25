import React, { useState, useEffect } from 'react';
import { Search, Pill, ShieldAlert, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { Medicine } from '../types.ts';
import { api } from '../services/api.ts';

interface CatalogueViewProps {
  onSelectMedicineForSearch: (brandName: string) => void;
  onOpenMedicineDetails: (med: Medicine) => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  onSelectMedicineForSearch,
  onOpenMedicineDetails
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api
      .getMedicines(filterQuery, selectedCategory === 'ALL' ? undefined : selectedCategory)
      .then((res) => {
        setMedicines(res.medicines || []);
      })
      .catch(() => setMedicines([]))
      .finally(() => setIsLoading(false));
  }, [filterQuery, selectedCategory]);

  const categories = [
    'ALL',
    'Analgesic & Antipyretic',
    'Antibacterial / Penicillin',
    'Macrolide Antibiotic',
    'Antidiabetic / Biguanide',
    'Antihypertensive / ARB',
    'Proton Pump Inhibitor (PPI)',
    'Antiallergic & Antiasthmatic',
    'Bronchodilator (Beta-2 Agonist)',
    'Lipid Lowering / Statin',
    'Electrolytes & Rehydration'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Verified Pharmaceutical Formulary</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          Medicine Catalogue & Drug Formulary
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Standard formulations, dosages, and active generic compositions mapped to local pharmacy inventories
        </p>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by brand name, generic salt, or strength..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50/50 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50/50 focus:bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Medicines */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 font-medium">
          Loading pharmaceutical catalogue...
        </div>
      ) : medicines.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
          No medicines match your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-teal-200 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {med.category}
                  </span>
                  {med.prescriptionRequired ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Rx Required</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      OTC
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                  {med.brandName}
                </h4>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  {med.genericName}
                </div>

                <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-700">Dosage:</span> {med.strength} • {med.dosageForm}
                </div>

                <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {med.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenMedicineDetails(med)}
                  className="text-xs font-bold text-slate-600 hover:text-teal-700"
                >
                  View Monograph
                </button>

                <button
                  onClick={() => onSelectMedicineForSearch(med.brandName)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>Search Stock</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
