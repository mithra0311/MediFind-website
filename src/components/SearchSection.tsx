import React, { useState } from 'react';
import { Search, MapPin, Navigation, AlertCircle, Sliders } from 'lucide-react';

export interface LocationPreset {
  id: string;
  name: string;
  locality: string;
  landmark: string;
  lat: number;
  lng: number;
}

export const SUPPORTED_LOCALITIES: LocationPreset[] = [
  {
    id: 'chrompet',
    name: 'Chrompet',
    locality: 'Chrompet',
    landmark: 'GST Road / MIT Junction',
    lat: 12.9516,
    lng: 80.1462
  },
  {
    id: 'pallavaram',
    name: 'Pallavaram',
    locality: 'Pallavaram',
    landmark: 'Pallavaram GST Road Junction',
    lat: 12.9678,
    lng: 80.1495
  },
  {
    id: 'radhanagar',
    name: 'Radha Nagar',
    locality: 'Radha Nagar',
    landmark: 'Radha Nagar Main Road',
    lat: 12.9561,
    lng: 80.1492
  },
  {
    id: 'hasthinapuram',
    name: 'Hasthinapuram',
    locality: 'Hasthinapuram',
    landmark: 'Hasthinapuram Main Bus Stand',
    lat: 12.9589,
    lng: 80.1558
  },
  {
    id: 'sithalapakkam',
    name: 'Sithalapakkam',
    locality: 'Sithalapakkam',
    landmark: 'Mambakkam Main Road Junction',
    lat: 12.8985,
    lng: 80.1872
  },
  {
    id: 'keelkattalai',
    name: 'Keelkattalai',
    locality: 'Keelkattalai',
    landmark: 'Medavakkam Main Road / Bus Terminus',
    lat: 12.9645,
    lng: 80.1815
  },
  {
    id: 'madipakkam',
    name: 'Madipakkam',
    locality: 'Madipakkam',
    landmark: 'Madipakkam Koot Road / Bazaar',
    lat: 12.9623,
    lng: 80.1986
  },
  {
    id: 'velachery',
    name: 'Velachery',
    locality: 'Velachery',
    landmark: 'Velachery Bypass Road / Grand Mall',
    lat: 12.9815,
    lng: 80.2180
  },
  {
    id: 'medavakkam',
    name: 'Medavakkam',
    locality: 'Medavakkam',
    landmark: 'Tambaram-Velachery Main Road Junction',
    lat: 12.9185,
    lng: 80.1923
  },
  {
    id: 'tambaram',
    name: 'Tambaram',
    locality: 'Tambaram',
    landmark: 'Tambaram West / Mudichur Road Junction',
    lat: 12.9249,
    lng: 80.1278
  },
  {
    id: 'nanmangalam',
    name: 'Nanmangalam',
    locality: 'Nanmangalam',
    landmark: 'Velachery Main Road / Nanmangalam',
    lat: 12.9352,
    lng: 80.1810
  },
  {
    id: 'kovilambakkam',
    name: 'Kovilambakkam',
    locality: 'Kovilambakkam',
    landmark: '200 Feet Radial Road Junction',
    lat: 12.9420,
    lng: 80.1915
  },
  {
    id: 'pallikaranai',
    name: 'Pallikaranai',
    locality: 'Pallikaranai',
    landmark: 'Pallikaranai High Road / Marshland Area',
    lat: 12.9376,
    lng: 80.2155
  },
  {
    id: 'selaiyur',
    name: 'Selaiyur',
    locality: 'Selaiyur',
    landmark: 'Camp Road / Selaiyur Bharat University',
    lat: 12.9192,
    lng: 80.1450
  },
  {
    id: 'east-tambaram',
    name: 'East Tambaram',
    locality: 'East Tambaram',
    landmark: 'East Tambaram Station Road / MCC College',
    lat: 12.9230,
    lng: 80.1385
  },
  {
    id: 'camp-road',
    name: 'Camp Road',
    locality: 'Camp Road',
    landmark: 'Camp Road Junction / Selaiyur Post Office',
    lat: 12.9150,
    lng: 80.1420
  },
  {
    id: 'zamin-pallavaram',
    name: 'Zamin Pallavaram',
    locality: 'Zamin Pallavaram',
    landmark: 'Old Trunk Road / Dharga Road',
    lat: 12.9730,
    lng: 80.1550
  },
  {
    id: 'sembakkam',
    name: 'Sembakkam',
    locality: 'Sembakkam',
    landmark: 'Velachery Main Road / Sembakkam Bus Stop',
    lat: 12.9255,
    lng: 80.1610
  },
  {
    id: 'perumbakkam',
    name: 'Perumbakkam',
    locality: 'Perumbakkam',
    landmark: 'Perumbakkam Main Road / Global Hospital',
    lat: 12.9015,
    lng: 80.2010
  },
  {
    id: 'sholinganallur',
    name: 'Sholinganallur',
    locality: 'Sholinganallur',
    landmark: 'OMR - Sholinganallur Signal Junction',
    lat: 12.8990,
    lng: 80.2280
  }
];


export const CHROMEPET_LOCALITIES = SUPPORTED_LOCALITIES;

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLocalityId: string;
  setSelectedLocalityId: (id: string) => void;
  currentCoords: { lat: number; lng: number };
  setCurrentCoords: (coords: { lat: number; lng: number }) => void;
  radiusKm: number;
  setRadiusKm: (r: number) => void;
  onSearch: (overrideQuery?: string, overrideCoords?: { lat: number; lng: number }) => void;
  isLoading: boolean;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLocalityId,
  setSelectedLocalityId,
  currentCoords,
  setCurrentCoords,
  radiusKm,
  setRadiusKm,
  onSearch,
  isLoading
}) => {
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [manualInputMode, setManualInputMode] = useState(false);
  const [customLat, setCustomLat] = useState(currentCoords.lat.toString());
  const [customLng, setCustomLng] = useState(currentCoords.lng.toString());

  const handleLocalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locId = e.target.value;
    if (locId === 'custom') {
      setManualInputMode(true);
      return;
    }
    setManualInputMode(false);
    setSelectedLocalityId(locId);
    setIsGpsActive(false);
    setGpsError(null);
    const preset = SUPPORTED_LOCALITIES.find((l) => l.id === locId);
    if (preset) {
      const newCoords = { lat: preset.lat, lng: preset.lng };
      setCurrentCoords(newCoords);
      setCustomLat(preset.lat.toString());
      setCustomLng(preset.lng.toString());
      // Immediately refresh search for the new locality
      onSearch(searchQuery, newCoords);
    }
  };

  const handleApplyCustomCoords = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (isNaN(lat) || isNaN(lng)) {
      setGpsError('Please enter valid numeric latitude and longitude coordinates.');
      return;
    }
    setGpsError(null);
    const newCoords = { lat, lng };
    setCurrentCoords(newCoords);
    setSelectedLocalityId('custom');
    setIsGpsActive(false);
    onSearch(searchQuery, newCoords);
  };

  const handleRequestGps = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setCurrentCoords(newCoords);
        setCustomLat(pos.coords.latitude.toFixed(4));
        setCustomLng(pos.coords.longitude.toFixed(4));
        setIsGpsActive(true);
        setSelectedLocalityId('gps');
        setManualInputMode(false);
        // Immediately search with live GPS coordinates
        onSearch(searchQuery, newCoords);
      },
      (err) => {
        setIsGpsActive(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('GPS permission was denied. You can select any supported locality from the list.');
        } else {
          setGpsError('Unable to retrieve GPS coordinates. Please select a supported locality.');
        }
      },
      { timeout: 8000 }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const currentLocalityName = isGpsActive
    ? `Live GPS (${currentCoords.lat.toFixed(4)}°N, ${currentCoords.lng.toFixed(4)}°E)`
    : selectedLocalityId === 'custom'
    ? `Custom Location (${currentCoords.lat.toFixed(4)}°N, ${currentCoords.lng.toFixed(4)}°E)`
    : SUPPORTED_LOCALITIES.find((l) => l.id === selectedLocalityId)?.name || 'Selected Location';

  return (
    <div className="w-full mb-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-900 text-white p-6 sm:p-10 shadow-xl border border-teal-800/40">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
            Find Your Medicine. Find a Nearby Pharmacy.
          </h1>

          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed mb-6">
            Search for medicines, check stock availability, and discover nearby pharmacies before you travel.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-teal-200">
            <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full border border-teal-500/20">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Location: {currentLocalityName}</span>
            </span>
          </div>
        </div>

        {/* Subtle decorative background blur */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Search Filter Box */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 mt-[-1.5rem] relative z-20 mx-2 sm:mx-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
          {/* Medicine Search Input */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Medicine Name or Generic Composition
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Dolo, Augmentin, Paracetamol, Glycomet..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Dynamic Locality Selector */}
          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Select Locality or Enter Location
              </label>
              <button
                type="button"
                onClick={() => setManualInputMode(!manualInputMode)}
                className="text-[11px] font-semibold text-teal-700 hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>{manualInputMode ? 'Preset List' : 'Custom Lat/Lng'}</span>
              </button>
            </div>

            {manualInputMode ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  className="w-1/2 px-2.5 py-3 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={customLng}
                  onChange={(e) => setCustomLng(e.target.value)}
                  className="w-1/2 px-2.5 py-3 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomCoords}
                  className="px-3 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={isGpsActive ? 'gps' : selectedLocalityId}
                  onChange={handleLocalityChange}
                  className="w-full pl-9 pr-8 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all appearance-none"
                >
                  {isGpsActive && <option value="gps">📍 Current GPS Location (Active)</option>}
                  {selectedLocalityId === 'custom' && (
                    <option value="custom">📍 Custom Coordinates ({customLat}, {customLng})</option>
                  )}
                  {SUPPORTED_LOCALITIES.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} — {loc.landmark}
                    </option>
                  ))}
                  <option value="custom">+ Enter Custom Coordinates...</option>
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                <div className="absolute right-3 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500" />
              </div>
            )}
          </div>

          {/* Search Radius */}
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Radius
            </label>
            <select
              value={radiusKm}
              onChange={(e) => {
                const newRadius = Number(e.target.value);
                setRadiusKm(newRadius);
                onSearch(searchQuery, currentCoords);
              }}
              className="w-full py-3 px-2 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
            >
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
            </select>
          </div>

          {/* Action Buttons: GPS & Search */}
          <div className="md:col-span-2 flex gap-2">
            <button
              type="button"
              onClick={handleRequestGps}
              className={`p-3 rounded-xl border font-semibold flex items-center justify-center transition-all ${
                isGpsActive
                  ? 'bg-teal-50 border-teal-300 text-teal-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              title="Use current GPS location"
            >
              <Navigation className={`w-4 h-4 ${isGpsActive ? 'text-teal-600 animate-pulse' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => onSearch()}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* GPS Error or Notification */}
        {gpsError && (
          <div className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{gpsError}</span>
          </div>
        )}
      </div>
    </div>
  );
};
