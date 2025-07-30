import { CreateDusunInput, UpdateDusunInput, Dusun } from '@/schemas/dusun.schema';
import { makeAuthenticatedRequest } from '@/lib/admin/auth-helpers';

// API base URL
const API_URL = '/api/admin/dusun';

// Dusun API client
export const dusunApi = {
  // Get all dusun profiles
  getAll: async (): Promise<Dusun[]> => {
    return makeAuthenticatedRequest<Dusun[]>(API_URL);
  },
  
  // Get dusun profile by ID
  getById: async (id: string): Promise<Dusun> => {
    return makeAuthenticatedRequest<Dusun>(`${API_URL}/${id}`);
  },
  
  // Create new dusun profile
  create: async (data: CreateDusunInput): Promise<Dusun> => {
    return makeAuthenticatedRequest<Dusun>(API_URL, 'POST', data);
  },
  
  // Update dusun profile
  update: async (id: string, data: UpdateDusunInput): Promise<Dusun> => {
    return makeAuthenticatedRequest<Dusun>(`${API_URL}/${id}`, 'PUT', data);
  },
  
  // Delete dusun profile
  delete: async (id: string): Promise<void> => {
    await makeAuthenticatedRequest(`${API_URL}/${id}`, 'DELETE');
  }
};
