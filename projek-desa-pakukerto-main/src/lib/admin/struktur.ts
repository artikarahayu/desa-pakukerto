import { CreateStrukturInput, UpdateStrukturInput, Struktur } from '@/schemas/struktur.schema';
import { makeAuthenticatedRequest } from '@/lib/admin/auth-helpers';

// API base URL
const API_URL = '/api/admin/struktur';

// Struktur API client
export const strukturApi = {
  // Get all struktur
  getAll: async (): Promise<Struktur[]> => {
    return makeAuthenticatedRequest<Struktur[]>(API_URL);
  },
  
  // Get struktur by ID
  getById: async (id: string): Promise<Struktur> => {
    return makeAuthenticatedRequest<Struktur>(`${API_URL}/${id}`);
  },
  
  // Create new struktur
  create: async (data: CreateStrukturInput): Promise<Struktur> => {
    return makeAuthenticatedRequest<Struktur>(API_URL, 'POST', data);
  },
  
  // Update struktur
  update: async (id: string, data: UpdateStrukturInput): Promise<Struktur> => {
    return makeAuthenticatedRequest<Struktur>(`${API_URL}/${id}`, 'PUT', data);
  },
  
  // Delete struktur
  delete: async (id: string): Promise<void> => {
    await makeAuthenticatedRequest(`${API_URL}/${id}`, 'DELETE');
  }
};
