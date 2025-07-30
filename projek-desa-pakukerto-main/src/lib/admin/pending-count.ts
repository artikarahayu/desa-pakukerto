import { makeAuthenticatedRequest } from "@/lib/admin/auth-helpers";

// API base URL
const API_URL = "/api/admin/layanan/pending-count";

// Surat Kelahiran API client
export const pendingCountApi = {
  // Get pending count
  getPendingCount: async (): Promise<{
    total: number;
    types: {
      "surat-keterangan": number;
      "surat-keterangan-kelahiran": number;
      "surat-izin-keramaian": number;
      "surat-pengantar-skck": number;
      "surat-keterangan-kematian": number;
    };
  }> => {
    return makeAuthenticatedRequest<{
      total: number;
      types: {
        "surat-keterangan": number;
        "surat-keterangan-kelahiran": number;
        "surat-izin-keramaian": number;
        "surat-pengantar-skck": number;
        "surat-keterangan-kematian": number;
      };
    }>(API_URL);
  },
};
