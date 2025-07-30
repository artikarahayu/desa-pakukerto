import { makeAuthenticatedRequest } from '@/lib/admin/auth-helpers';

// API base URL prefix
const API_PREFIX = '/api/admin/profil';

// Profile API client
export const profileApi = {
  // Visi Misi
  visiMisi: {
    get: async (): Promise<{ content: string }> => {
      return makeAuthenticatedRequest<{ content: string }>(`${API_PREFIX}/visi-misi`);
    },
    
    update: async (data: { content: string }): Promise<{ content: string }> => {
      return makeAuthenticatedRequest<{ content: string }>(`${API_PREFIX}/visi-misi`, 'POST', data);
    }
  },
  
  // Sejarah Desa
  sejarah: {
    get: async (): Promise<{ content: string }> => {
      return makeAuthenticatedRequest<{ content: string }>(`${API_PREFIX}/sejarah`);
    },
    
    update: async (data: { content: string }): Promise<{ content: string }> => {
      return makeAuthenticatedRequest<{ content: string }>(`${API_PREFIX}/sejarah`, 'POST', data);
    }
  },
  
  // Bagan Desa
  bagan: {
    get: async (): Promise<{ images: string[] }> => {
      return makeAuthenticatedRequest<{ images: string[] }>(`${API_PREFIX}/bagan`);
    },
    
    update: async (data: { images: string[] }): Promise<{ images: string[] }> => {
      return makeAuthenticatedRequest<{ images: string[] }>(`${API_PREFIX}/bagan`, 'POST', data);
    }
  }
};
