import { UpdateSuratIzinKeramaianInput, SuratIzinKeramaian } from '@/schemas/surat-izin-keramaian.schema';
import { makeAuthenticatedRequest } from '@/lib/admin/auth-helpers';

// API base URL
const API_URL = '/api/admin/layanan/surat-izin-keramaian';

// Surat Izin Keramaian API client
export const suratIzinKeramaianApi = {
  // Get all surat izin keramaian
  getAll: async (status?: 'pending' | 'finish'): Promise<SuratIzinKeramaian[]> => {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    return makeAuthenticatedRequest<SuratIzinKeramaian[]>(url);
  },
  
  // Update surat izin keramaian (nomor surat, status)
  update: async (id: string, data: UpdateSuratIzinKeramaianInput): Promise<SuratIzinKeramaian> => {
    return makeAuthenticatedRequest<SuratIzinKeramaian>(`${API_URL}?id=${id}`, 'PUT', data);
  },

  // Delete surat izin keramaian
  delete: async (id: string): Promise<void> => {
    return makeAuthenticatedRequest<void>(`${API_URL}?id=${id}`, 'DELETE');
  },
};
