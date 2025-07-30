import { UpdateSuratPengantarSKCKInput, SuratPengantarSKCK } from '@/schemas/surat-pengantar-skck.schema';
import { makeAuthenticatedRequest } from '@/lib/admin/auth-helpers';

// API base URL
const API_URL = '/api/admin/layanan/surat-pengantar-skck';

// Surat Pengantar SKCK API client
export const suratPengantarSKCKApi = {
  // Get all surat pengantar SKCK
  getAll: async (status?: 'pending' | 'finish'): Promise<SuratPengantarSKCK[]> => {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    return makeAuthenticatedRequest<SuratPengantarSKCK[]>(url);
  },
  
  // Update surat pengantar SKCK (nomor surat, status)
  update: async (id: string, data: UpdateSuratPengantarSKCKInput): Promise<SuratPengantarSKCK> => {
    return makeAuthenticatedRequest<SuratPengantarSKCK>(`${API_URL}?id=${id}`, 'PUT', data);
  },

  // Delete surat pengantar SKCK
  delete: async (id: string): Promise<void> => {
    return makeAuthenticatedRequest<void>(`${API_URL}?id=${id}`, 'DELETE');
  },
};
