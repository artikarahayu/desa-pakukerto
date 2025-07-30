import {
  CreateGaleriInput,
  UpdateGaleriInput,
  Galeri,
} from "@/schemas/galeri.schema";
import { makeAuthenticatedRequest } from "@/lib/admin/auth-helpers";

// API base URL
const API_URL = "/api/admin/galeri";

// Galeri API client
export const galeriApi = {
  // Get all gallery items
  getAll: async (): Promise<Galeri[]> => {
    return makeAuthenticatedRequest<Galeri[]>(API_URL);
  },

  // Get gallery item by ID
  getById: async (id: string): Promise<Galeri> => {
    return makeAuthenticatedRequest<Galeri>(`${API_URL}/${id}`);
  },

  // Create new gallery item
  create: async (data: CreateGaleriInput): Promise<Galeri> => {
    return makeAuthenticatedRequest<Galeri>(API_URL, "POST", data);
  },

  // Update gallery item
  update: async (id: string, data: UpdateGaleriInput): Promise<Galeri> => {
    return makeAuthenticatedRequest<Galeri>(`${API_URL}/${id}`, "PUT", data);
  },

  // Delete gallery item
  delete: async (id: string): Promise<void> => {
    await makeAuthenticatedRequest(`${API_URL}/${id}`, "DELETE");
  },
};
