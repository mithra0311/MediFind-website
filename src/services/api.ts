import { SearchResponse, Medicine, Pharmacy, User, AdminStats, InventoryItem } from '../types.ts';

const BASE_URL = '/api';

function getAuthHeaders(includeJson = true): Record<string, string> {
  const headers: Record<string, string> = {};
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('medifind_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  async search(query: string, lat?: number, lng?: number, radius = 5): Promise<SearchResponse> {
    const params = new URLSearchParams({ query, radius: String(radius) });
    if (lat != null && lng != null) {
      params.append('lat', String(lat));
      params.append('lng', String(lng));
    }
    const res = await fetch(`${BASE_URL}/search?${params.toString()}`, {
      headers: getAuthHeaders(false)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Search failed');
    }
    return res.json();
  },

  async getUserSearchHistory(): Promise<{ count: number; history: any[] }> {
    const res = await fetch(`${BASE_URL}/user/search-history`, {
      headers: getAuthHeaders(false)
    });
    if (!res.ok) return { count: 0, history: [] };
    return res.json();
  },

  async clearUserSearchHistory(): Promise<void> {
    await fetch(`${BASE_URL}/user/search-history`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    });
  },

  async getMedicines(query?: string, category?: string, all = false): Promise<{ count: number; medicines: Medicine[] }> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    if (all) params.append('all', 'true');
    const res = await fetch(`${BASE_URL}/medicines?${params.toString()}`);
    return res.json();
  },

  async getMedicineById(id: number): Promise<{ medicine: Medicine; pharmacyStock: any[] }> {
    const res = await fetch(`${BASE_URL}/medicines/${id}`);
    if (!res.ok) throw new Error('Medicine not found');
    return res.json();
  },

  async createMedicine(data: Partial<Medicine>): Promise<{ message: string; medicine: Medicine }> {
    const res = await fetch(`${BASE_URL}/medicines`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add medicine');
    }
    return res.json();
  },

  async updateMedicine(id: number, data: Partial<Medicine>): Promise<{ message: string; medicine: Medicine }> {
    const res = await fetch(`${BASE_URL}/medicines/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update medicine');
    }
    return res.json();
  },

  async deleteMedicine(id: number): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/medicines/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete medicine');
    }
    return res.json();
  },

  async getPharmacies(lat?: number, lng?: number, radius?: number, all = false): Promise<{ count: number; pharmacies: Pharmacy[] }> {
    const params = new URLSearchParams();
    if (lat != null && lng != null) {
      params.append('lat', String(lat));
      params.append('lng', String(lng));
      if (radius) params.append('radius', String(radius));
    }
    if (all) params.append('all', 'true');
    const res = await fetch(`${BASE_URL}/pharmacies?${params.toString()}`);
    return res.json();
  },

  async getPharmacyById(id: number): Promise<{ pharmacy: Pharmacy; inventory: any[] }> {
    const res = await fetch(`${BASE_URL}/pharmacies/${id}`);
    if (!res.ok) throw new Error('Pharmacy not found');
    return res.json();
  },

  async createPharmacy(data: Partial<Pharmacy>): Promise<{ message: string; pharmacy: Pharmacy }> {
    const res = await fetch(`${BASE_URL}/pharmacies`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register pharmacy');
    }
    return res.json();
  },

  async upsertInventory(data: {
    pharmacyId: number;
    medicineId: number;
    quantity: number;
    availabilityStatus: string;
    unitPrice: number;
    batchNumber?: string;
    expiryDate?: string;
    sourceVerification?: string;
  }): Promise<{ message: string; inventory: any }> {
    const res = await fetch(`${BASE_URL}/inventory/upsert`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update stock');
    }
    return res.json();
  },

  async getAllInventory(
    pharmacyId?: number,
    medicineId?: number,
    status?: string,
    query?: string
  ): Promise<{ count: number; inventory: InventoryItem[] }> {
    const params = new URLSearchParams();
    if (pharmacyId) params.append('pharmacyId', String(pharmacyId));
    if (medicineId) params.append('medicineId', String(medicineId));
    if (status) params.append('status', status);
    if (query) params.append('query', query);
    const res = await fetch(`${BASE_URL}/inventory?${params.toString()}`);
    return res.json();
  },

  async deleteInventory(id: number): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete inventory record');
    }
    return res.json();
  },

  async updatePharmacy(id: number, data: Partial<Pharmacy>): Promise<{ message: string; pharmacy: Pharmacy }> {
    const res = await fetch(`${BASE_URL}/pharmacies/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update pharmacy');
    }
    return res.json();
  },

  async deletePharmacy(id: number): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/pharmacies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete pharmacy');
    }
    return res.json();
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    return res.json();
  },

  async getRecentSearches(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/admin/recent-searches`);
    return res.json();
  },

  async importMedicinesCsv(csvData: string): Promise<{ imported: number; errors: string[] }> {
    const res = await fetch(`${BASE_URL}/admin/import-medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvData })
    });
    return res.json();
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid credentials');
    }
    return res.json();
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async demoLogin(role: 'ADMIN' | 'USER'): Promise<{ token: string; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  }
};
