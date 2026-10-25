// Coordinates for all 20 supported Chennai localities
const LOCALITY_COORDS = {
  chromepet: { name: "Chromepet GST Road", lat: 12.9516, lng: 80.1462 },
  pallavaram: { name: "Pallavaram GST Road", lat: 12.9678, lng: 80.1495 },
  radhanagar: { name: "Radha Nagar", lat: 12.9561, lng: 80.1492 },
  hastinapuram: { name: "Hasthinapuram Main Bus Stand", lat: 12.9589, lng: 80.1558 },
  sithalapakkam: { name: "Sithalapakkam Mambakkam Main Rd", lat: 12.8985, lng: 80.1872 },
  keelkattalai: { name: "Keelkattalai Bus Terminus", lat: 12.9645, lng: 80.1815 },
  madipakkam: { name: "Madipakkam Koot Road", lat: 12.9623, lng: 80.1986 },
  velachery: { name: "Velachery Bypass Road", lat: 12.9815, lng: 80.2180 },
  medavakkam: { name: "Medavakkam Junction", lat: 12.9185, lng: 80.1923 },
  tambaram: { name: "Tambaram West", lat: 12.9249, lng: 80.1278 },
  nanmangalam: { name: "Nanmangalam Velachery Main Rd", lat: 12.9352, lng: 80.1810 },
  kovilambakkam: { name: "Kovilambakkam 200 Feet Rd", lat: 12.9420, lng: 80.1915 },
  pallikaranai: { name: "Pallikaranai High Road", lat: 12.9376, lng: 80.2155 },
  selaiyur: { name: "Selaiyur Velachery Main Rd", lat: 12.9192, lng: 80.1450 },
  'east-tambaram': { name: "East Tambaram MCC", lat: 12.9230, lng: 80.1385 },
  'camp-road': { name: "Camp Road Junction", lat: 12.9150, lng: 80.1420 },
  'zamin-pallavaram': { name: "Zamin Pallavaram Dharga Rd", lat: 12.9730, lng: 80.1550 },
  sembakkam: { name: "Sembakkam Bus Stop", lat: 12.9255, lng: 80.1610 },
  perumbakkam: { name: "Perumbakkam Global Hospital", lat: 12.9015, lng: 80.2010 },
  sholinganallur: { name: "Sholinganallur OMR Signal", lat: 12.8990, lng: 80.2280 }
};


let currentCoordinates = { lat: 12.9516, lng: 80.1462 }; // Default: Chromepet Center

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkAuth();
});

function setupEventListeners() {
  const searchBtn = document.getElementById('search-btn');
  const medicineInput = document.getElementById('medicine-input');
  const localitySelect = document.getElementById('locality-select');
  const gpsBtn = document.getElementById('gps-btn');
  const radiusSelect = document.getElementById('radius-select');

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  if (medicineInput) {
    medicineInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  if (localitySelect) {
    localitySelect.addEventListener('change', (e) => {
      const loc = LOCALITY_COORDS[e.target.value];
      if (loc) {
        currentCoordinates = { lat: loc.lat, lng: loc.lng };
        updateLocationStatus(`Selected Location: ${loc.name}`);
      }
    });
  }

  if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
      gpsBtn.innerText = "Locating...";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          currentCoordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          gpsBtn.innerText = "GPS Active";
          updateLocationStatus(`GPS Coordinates: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        },
        (err) => {
          gpsBtn.innerText = "Use GPS";
          alert("Location access denied or unavailable. Falling back to Chromepet demonstration location.");
        }
      );
    });
  }
}

function updateLocationStatus(text) {
  const statusEl = document.getElementById('location-status');
  if (statusEl) statusEl.innerText = text;
}

async function performSearch() {
  const medicineInput = document.getElementById('medicine-input');
  const radiusSelect = document.getElementById('radius-select');
  const query = medicineInput ? medicineInput.value.trim() : '';

  if (!query) {
    alert("Please enter a medicine name to search (e.g., Dolo, Augmentin, Paracetamol, Glycomet).");
    return;
  }

  const radius = radiusSelect ? parseFloat(radiusSelect.value) : 10;
  const resultsContainer = document.getElementById('results-container');
  const emptyState = document.getElementById('empty-state');
  const loadingSpinner = document.getElementById('loading-spinner');

  if (loadingSpinner) loadingSpinner.style.display = 'block';
  if (resultsContainer) resultsContainer.innerHTML = '';
  if (emptyState) emptyState.style.display = 'none';

  try {
    const data = await MediFindAPI.search(query, currentCoordinates.lat, currentCoordinates.lng, radius);
    if (loadingSpinner) loadingSpinner.style.display = 'none';

    renderSearchResults(data, query);
  } catch (err) {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    alert(err.message || "Failed to search medicines.");
  }
}

function renderSearchResults(data, query) {
  const container = document.getElementById('results-container');
  if (!container) return;

  if (!data.primaryMedicine) {
    container.innerHTML = `
      <div class="search-card" style="text-align:center; padding: 3rem 1.5rem;">
        <h3 style="font-size:1.3rem; margin-bottom: 0.5rem; color:#dc2626;">Medicine "${escapeHtml(query)}" Not Found</h3>
        <p style="color:#64748b; max-width: 500px; margin: 0 auto 1.5rem;">
          No matching records in our verified medicine catalogue. Try searching for "Dolo", "Paracetamol", "Augmentin", or "Azithral".
        </p>
        <button class="btn btn-outline" onclick="document.getElementById('medicine-input').value='Dolo'; performSearch();">
          Try Searching "Dolo"
        </button>
      </div>
    `;
    return;
  }

  const med = data.primaryMedicine;
  let html = `
    <!-- Matched Medicine Overview -->
    <div class="search-card" style="border-left: 4px solid var(--primary); margin-bottom: 2rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <span class="badge" style="background:#e0f2fe; color:#0369a1; margin-bottom:0.5rem;">
            ${escapeHtml(med.category)}
          </span>
          <h2 style="font-size:1.6rem; font-weight:800; color:#0f172a;">
            ${escapeHtml(med.brandName)}
            <span style="font-size:1.05rem; font-weight:500; color:#64748b; margin-left:0.5rem;">
              (${escapeHtml(med.genericName)})
            </span>
          </h2>
          <p style="color:#475569; margin-top:0.4rem; font-size:0.95rem;">
            <strong>Dosage & Form:</strong> ${escapeHtml(med.strength)} — ${escapeHtml(med.dosageForm)}
          </p>
          <p style="color:#64748b; margin-top:0.3rem; font-size:0.88rem;">
            ${escapeHtml(med.description || '')}
          </p>
        </div>
        <div>
          ${med.prescriptionRequired 
            ? '<span class="badge badge-out-of-stock" style="font-size:0.8rem;">Rx Prescription Required</span>'
            : '<span class="badge badge-available" style="font-size:0.8rem;">Over-The-Counter (OTC)</span>'}
        </div>
      </div>
      <div style="margin-top:1rem; font-size:0.82rem; color:#64748b; border-top:1px solid #f1f5f9; padding-top:0.5rem;">
        Source Reference: ${escapeHtml(med.verificationSource || 'Verified Drug Formulary')}
      </div>
    </div>
  `;

  // SECTION 1: CONFIRMED AVAILABLE PHARMACIES
  html += `
    <div class="results-section">
      <h3 class="section-title">
        <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#16a34a;"></span>
        Confirmed In Stock Nearby (${data.confirmedAvailable.length})
      </h3>
  `;

  if (data.confirmedAvailable.length === 0) {
    html += `
      <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:1.5rem; text-align:center; color:#64748b; margin-bottom:1.5rem;">
        No pharmacies within ${data.radiusKm} km currently have verified stock of ${escapeHtml(med.brandName)}.
      </div>
    `;
  } else {
    html += `<div class="grid-cards">`;
    data.confirmedAvailable.forEach((p) => {
      html += renderPharmacyCard(p, 'AVAILABLE');
    });
    html += `</div>`;
  }
  html += `</div>`;

  // SECTION 2: OUT OF STOCK PHARMACIES
  if (data.outOfStock.length > 0) {
    html += `
      <div class="results-section">
        <h3 class="section-title" style="color:#dc2626;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#dc2626;"></span>
          Confirmed Out of Stock (${data.outOfStock.length})
        </h3>
        <div class="grid-cards">
    `;
    data.outOfStock.forEach((p) => {
      html += renderPharmacyCard(p, 'OUT_OF_STOCK');
    });
    html += `</div></div>`;
  }

  // SECTION 3: UNKNOWN STOCK STATUS (CALL AHEAD)
  if (data.unknownStock.length > 0) {
    html += `
      <div class="results-section">
        <h3 class="section-title" style="color:#d97706;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#d97706;"></span>
          Nearby Pharmacies with Unconfirmed Inventory (${data.unknownStock.length})
        </h3>
        <p style="font-size:0.88rem; color:#64748b; margin-bottom:1rem;">
          These licensed pharmacies are within your search radius, but do not have an active live stock feed for this specific medicine. You may call ahead to inquire.
        </p>
        <div class="grid-cards">
    `;
    data.unknownStock.forEach((p) => {
      html += renderPharmacyCard(p, 'STOCK_STATUS_UNKNOWN');
    });
    html += `</div></div>`;
  }

  container.innerHTML = html;
}

function renderPharmacyCard(p, status) {
  let badgeHtml = '';
  let stockInfo = '';

  if (status === 'AVAILABLE') {
    badgeHtml = `<span class="badge badge-available">In Stock (${p.inventory.quantity} units)</span>`;
    stockInfo = `
      <div class="info-row" style="font-size:0.8rem; color:#15803d;">
        <span>Last Verified: ${p.inventory.lastUpdatedAt ? new Date(p.inventory.lastUpdatedAt).toLocaleDateString() : 'Recent POS sync'}</span>
      </div>
    `;
  } else if (status === 'OUT_OF_STOCK') {
    badgeHtml = `<span class="badge badge-out-of-stock">Out of Stock (0 units)</span>`;
    stockInfo = `
      <div class="info-row" style="font-size:0.8rem; color:#b91c1c;">
        <span>Reported depleted by pharmacy</span>
      </div>
    `;
  } else {
    badgeHtml = `<span class="badge badge-unknown">Stock Unconfirmed</span>`;
    stockInfo = `
      <div class="info-row" style="font-size:0.8rem; color:#b45309;">
        <span>Call to verify availability</span>
      </div>
    `;
  }

  const distanceLabel = p.distanceKm != null 
    ? `<span style="font-weight:700; color:#0d9488;">${p.distanceKm.toFixed(2)} km away</span>`
    : '';

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;

  return `
    <div class="card">
      <div>
        <div class="card-header">
          <div>
            <h4 class="card-title">${escapeHtml(p.pharmacyName)}</h4>
            <div class="card-subtitle">${escapeHtml(p.locality)}, ${escapeHtml(p.city)}</div>
          </div>
          <div>${badgeHtml}</div>
        </div>

        <div class="info-row">
          <span>📍</span>
          <span>${escapeHtml(p.address)}</span>
        </div>

        <div class="info-row">
          <span>📞</span>
          <a href="tel:${escapeHtml(p.contactPhone)}" style="color:#0284c7; text-decoration:none; font-weight:600;">
            ${escapeHtml(p.contactPhone)}
          </a>
        </div>

        <div class="info-row">
          <span>🕒</span>
          <span>${p.is24Hours ? '<strong>24x7 Open</strong>' : `${escapeHtml(p.openingTime)} - ${escapeHtml(p.closingTime)}`}</span>
        </div>

        ${stockInfo}
      </div>

      <div class="card-footer">
        <div>
          <div>${distanceLabel}</div>
        </div>
        <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size:0.85rem; padding:0.4rem 0.8rem;">
          Get Directions ↗
        </a>
      </div>
    </div>
  `;
}


function checkAuth() {
  const token = localStorage.getItem('medifind_token');
  const user = JSON.parse(localStorage.getItem('medifind_user') || 'null');
  const userNav = document.getElementById('user-nav');
  if (userNav && user) {
    userNav.innerHTML = `
      <span style="font-size:0.9rem; font-weight:600; color:#0f172a;">${escapeHtml(user.name)} (${user.role})</span>
      ${user.role === 'ADMIN' ? '<a href="admin.html" class="btn btn-outline" style="font-size:0.85rem; padding:0.35rem 0.75rem;">Admin Panel</a>' : ''}
      <button onclick="logout()" class="btn btn-outline" style="font-size:0.85rem; padding:0.35rem 0.75rem;">Logout</button>
    `;
  }
}

function logout() {
  localStorage.removeItem('medifind_token');
  localStorage.removeItem('medifind_user');
  window.location.reload();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
