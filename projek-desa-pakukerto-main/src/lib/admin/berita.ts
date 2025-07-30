import { CreateBeritaInput, UpdateBeritaInput, Berita } from '@/schemas/berita.schema';
import { getAuthToken, makeAuthenticatedRequest } from '@/lib/admin/auth-helpers';

// API base URL
const API_URL = '/api/admin/berita';

// Berita API client
export const beritaApi = {
  // Get all berita
  getAll: async (): Promise<Berita[]> => {
    return makeAuthenticatedRequest<Berita[]>(API_URL);
  },
  
  // Get berita by ID
  getById: async (id: string): Promise<Berita> => {
    return makeAuthenticatedRequest<Berita>(`${API_URL}/${id}`);
  },
  
  // Create new berita
  create: async (data: CreateBeritaInput): Promise<Berita> => {
    return makeAuthenticatedRequest<Berita>(API_URL, 'POST', data);
  },
  
  // Update berita
  update: async (id: string, data: UpdateBeritaInput): Promise<Berita> => {
    return makeAuthenticatedRequest<Berita>(`${API_URL}/${id}`, 'PUT', data);
  },
  
  // Delete berita
  delete: async (id: string): Promise<void> => {
    await makeAuthenticatedRequest(`${API_URL}/${id}`, 'DELETE');
  }
};
