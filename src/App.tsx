import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { SearchSection, SUPPORTED_LOCALITIES } from './components/SearchSection.tsx';
import { ResultsView } from './components/ResultsView.tsx';
import { MedicineModal } from './components/MedicineModal.tsx';
import { PharmacyModal } from './components/PharmacyModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { CatalogueView } from './components/CatalogueView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CollegeDocsModal } from './components/CollegeDocsModal.tsx';
import { UserHistoryModal } from './components/UserHistoryModal.tsx';
import { SearchResponse, Medicine, User } from './types.ts';
import { api } from './services/api.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'admin' | 'catalogue'>('search');
  const [searchQuery, setSearchQuery] = useState('Dolo');
  const [lastSearchedTerm, setLastSearchedTerm] = useState('Dolo');
  const [selectedLocalityId, setSelectedLocalityId] = useState('chromepet-gst');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 12.9516,
    lng: 80.1462
  });
  const [radiusKm, setRadiusKm] = useState(5);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modals & User state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Check saved session
  useEffect(() => {
    const savedUser = localStorage.getItem('medifind_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('medifind_user');
      }
    }
  }, []);

  // Perform search
  const handleSearch = async (overrideQuery?: string, overrideCoords?: { lat: number; lng: number }) => {
    const queryToUse = (overrideQuery ?? searchQuery).trim();
    if (!queryToUse) return;

    const coordsToUse = overrideCoords ?? currentCoords;

    setIsLoading(true);
    setLastSearchedTerm(queryToUse);
    try {
      const data = await api.search(
        queryToUse,
        coordsToUse.lat,
        coordsToUse.lng,
        radiusKm
      );
      setSearchResults(data);
      if (activeTab !== 'search') {
        setActiveTab('search');
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial search on mount for demonstration
  useEffect(() => {
    handleSearch('Dolo');
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('medifind_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('medifind_user');
    localStorage.removeItem('medifind_token');
    if (activeTab === 'admin') {
      setActiveTab('search');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <div>
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLocalityId={selectedLocalityId}
              setSelectedLocalityId={setSelectedLocalityId}
              currentCoords={currentCoords}
              setCurrentCoords={setCurrentCoords}
              radiusKm={radiusKm}
              setRadiusKm={setRadiusKm}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            <ResultsView
              results={searchResults}
              searchedTerm={lastSearchedTerm}
              onSelectMedicine={(med) => setSelectedMedicine(med)}
              onSelectPharmacy={(id) => setSelectedPharmacyId(id)}
              onSwitchMedicine={(name) => {
                setSearchQuery(name);
                handleSearch(name);
              }}
            />
          </div>
        )}

        {activeTab === 'catalogue' && (
          <CatalogueView
            onSelectMedicineForSearch={(name) => {
              setSearchQuery(name);
              handleSearch(name);
            }}
            onOpenMedicineDetails={(med) => setSelectedMedicine(med)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onNavigateHome={() => setActiveTab('search')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-700">MediFind</span> — Location-Based Medicine Availability &amp; Nearby Pharmacy Finder.
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Verified Pharmacy Network</span>
            <span>•</span>
            <span>Proximity-Based Availability</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MedicineModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onSelectPharmacy={(id) => setSelectedPharmacyId(id)}
      />

      <PharmacyModal
        pharmacyId={selectedPharmacyId}
        onClose={() => setSelectedPharmacyId(null)}
        onSelectMedicineName={(name) => {
          setSelectedPharmacyId(null);
          setSearchQuery(name);
          handleSearch(name);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CollegeDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      <UserHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        currentUser={currentUser}
        onSelectQuery={(term) => {
          setSearchQuery(term);
          handleSearch(term);
        }}
      />
    </div>
  );
}
