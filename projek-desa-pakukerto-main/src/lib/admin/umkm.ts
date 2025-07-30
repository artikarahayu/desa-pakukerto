import { CreateUmkmInput, UpdateUmkmInput, Umkm } from '@/schemas/umkm.schema';
import { makeAuthenticatedRequest } from '@/lib/admin/auth-helpers';

// API base URL
const API_URL = '/api/admin/umkm';

// UMKM API client
export const umkmApi = {
  // Get all UMKM products
  getAll: async (): Promise<Umkm[]> => {
    return makeAuthenticatedRequest<Umkm[]>(API_URL);
  },
  
  // Get UMKM product by ID
  getById: async (id: string): Promise<Umkm> => {
    return makeAuthenticatedRequest<Umkm>(`${API_URL}/${id}`);
  },
  
  // Create new UMKM product
  create: async (data: CreateUmkmInput): Promise<Umkm> => {
    return makeAuthenticatedRequest<Umkm>(API_URL, 'POST', data);
  },
  
  // Update UMKM product
  update: async (id: string, data: UpdateUmkmInput): Promise<Umkm> => {
    return makeAuthenticatedRequest<Umkm>(`${API_URL}/${id}`, 'PUT', data);
  },
  
  // Delete UMKM product
  delete: async (id: string): Promise<void> => {
    await makeAuthenticatedRequest(`${API_URL}/${id}`, 'DELETE');
  }
};
