/**
 * MediFind API Client
 * Connects to Java Spring Boot REST API (default http://localhost:8080/api)
 * or local host if served together.
 */
const API_BASE = window.location.origin.includes(':3000') 
  ? '/api' 
  : 'http://localhost:8080/api';

const MediFindAPI = {
  // Search
  search: async (query, lat, lng, radius = 10) => {
    let url = `${API_BASE}/search?query=${encodeURIComponent(query)}&radius=${radius}`;
    if (lat != null && lng != null) {
      url += `&lat=${lat}&lng=${lng}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error((await res.json()).error || 'Search failed');
    return res.json();
  },

  // Medicines
  getMedicines: async (query, category) => {
    let url = `${API_BASE}/medicines?`;
    if (query) url += `query=${encodeURIComponent(query)}&`;
    if (category) url += `category=${encodeURIComponent(category)}`;
    const res = await fetch(url);
    return res.json();
  },

  getMedicineById: async (id) => {
    const res = await fetch(`${API_BASE}/medicines/${id}`);
    return res.json();
  },

  createMedicine: async (data) => {
    const res = await fetch(`${API_BASE}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Pharmacies
  getPharmacies: async (lat, lng, radius) => {
    let url = `${API_BASE}/pharmacies?`;
    if (lat != null && lng != null) url += `lat=${lat}&lng=${lng}&radius=${radius || 10}`;
    const res = await fetch(url);
    return res.json();
  },

  createPharmacy: async (data) => {
    const res = await fetch(`${API_BASE}/pharmacies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Inventory
  upsertInventory: async (data) => {
    const res = await fetch(`${API_BASE}/inventory/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    return data;
  },

  register: async (name, email, password, phone) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  }
};
