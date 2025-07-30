import { UpdateSuratKeteranganKematianInput, SuratKeteranganKematian } from '@/schemas/surat-keterangan-kematian.schema';
import { makeAuthenticatedRequest } from '@/lib/admin/auth-helpers';
import axios from 'axios';

// API base URL
const API_URL = '/api/admin/layanan/surat-keterangan-kematian';

// Surat Keterangan Kematian API client
export const suratKeteranganKematianApi = {
  // Get all surat keterangan kematian
  getAll: async (status?: 'pending' | 'finish'): Promise<SuratKeteranganKematian[]> => {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    return makeAuthenticatedRequest<SuratKeteranganKematian[]>(url);
  },
  
  // Update surat keterangan kematian (nomor surat, status)
  update: async (id: string, data: UpdateSuratKeteranganKematianInput): Promise<SuratKeteranganKematian> => {
    return makeAuthenticatedRequest<SuratKeteranganKematian>(`${API_URL}?id=${id}`, 'PUT', data);
  },

  // Delete surat keterangan kematian
  delete: async (id: string): Promise<void> => {
    return makeAuthenticatedRequest<void>(`${API_URL}?id=${id}`, 'DELETE');
  },
};
