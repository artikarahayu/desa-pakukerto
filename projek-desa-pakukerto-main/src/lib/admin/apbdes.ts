import { CreateApbdesInput } from "@/schemas/apbdes.schema";
import { makeAuthenticatedRequest } from "@/lib/admin/auth-helpers";

// Base API URL
const API_URL = "/api/admin/apbdes";

// Service API for APBDes
export const apbdesApi = {
  // Get all APBDes data
  getAll: async () => {
    return makeAuthenticatedRequest(API_URL);
  },

  // Get APBDes by ID
  getById: async (id: string) => {
    return makeAuthenticatedRequest(`${API_URL}/${id}`);
  },

  // Create new APBDes
  create: async (data: CreateApbdesInput) => {
    return makeAuthenticatedRequest(API_URL, "POST", data);
  },

  // Update APBDes
  update: async (id: string, data: CreateApbdesInput) => {
    return makeAuthenticatedRequest(`${API_URL}/${id}`, "PUT", data);
  },

  // Delete APBDes
  delete: async (id: string) => {
    return makeAuthenticatedRequest(`${API_URL}/${id}`, "DELETE");
  },
};
