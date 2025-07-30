import {
  UpdateSuratKelahiranInput,
  SuratKelahiran,
} from "@/schemas/surat-kelahiran.schema";
import { makeAuthenticatedRequest } from "@/lib/admin/auth-helpers";

// API base URL
const API_URL = "/api/admin/layanan/surat-kelahiran";

// Surat Kelahiran API client
export const suratKelahiranApi = {
  // Get all surat kelahiran
  getAll: async (status?: "pending" | "finish"): Promise<SuratKelahiran[]> => {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    return makeAuthenticatedRequest<SuratKelahiran[]>(url);
  },

  // Update surat kelahiran (nomor surat, status)
  update: async (
    id: string,
    data: UpdateSuratKelahiranInput
  ): Promise<SuratKelahiran> => {
    return makeAuthenticatedRequest<SuratKelahiran>(
      `${API_URL}?id=${id}`,
      "PUT",
      data
    );
  },

  // Delete surat kelahiran
  delete: async (id: string): Promise<void> => {
    return makeAuthenticatedRequest<void>(`${API_URL}?id=${id}`, "DELETE");
  },
};
