import {
  UpdateSuratKeteranganInput,
  SuratKeterangan,
} from "@/schemas/surat-keterangan.schema";
import { makeAuthenticatedRequest } from "@/lib/admin/auth-helpers";

// API base URL
const API_URL = "/api/admin/layanan/surat-keterangan";

// Surat Keterangan API client
export const suratKeteranganApi = {
  // Get all surat keterangan
  getAll: async (status?: "pending" | "finish"): Promise<SuratKeterangan[]> => {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    return makeAuthenticatedRequest<SuratKeterangan[]>(url);
  },

  // Update surat keterangan (nomor surat, status)
  update: async (
    id: string,
    data: UpdateSuratKeteranganInput
  ): Promise<SuratKeterangan> => {
    return makeAuthenticatedRequest<SuratKeterangan>(
      `${API_URL}?id=${id}`,
      "PUT",
      data
    );
  },

  // Delete surat keterangan
  delete: async (id: string): Promise<void> => {
    return makeAuthenticatedRequest<void>(`${API_URL}?id=${id}`, "DELETE");
  },
};
