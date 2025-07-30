import { makeAuthenticatedRequest } from '@/lib/admin/auth-helpers';

// Dashboard statistics types
export interface LatestSuratItem {
  id: string;
  jenisSurat: string;
  jenisSuratLabel: string;
  namaLengkap: string;
  timestamp: number;
  status: string;
}

export interface DashboardStatistics {
  berita: {
    total: number;
  };
  umkm: {
    total: number;
  };
  galeri: {
    total: number;
  };
  layananPublik: {
    pending: number;
    latestPending: LatestSuratItem[];
  };
}

// API base URL
const API_URL = '/api/admin/dashboard';

// Dashboard API client
export const dashboardApi = {
  // Get dashboard statistics
  getStatistics: async (): Promise<DashboardStatistics> => {
    return makeAuthenticatedRequest<DashboardStatistics>(`${API_URL}/statistics`);
  }
};
