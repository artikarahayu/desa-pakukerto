import {
  CreateDemografiInput,
  UpdateDemografiInput,
} from "@/schemas/demografi.schema";
import { makeAuthenticatedRequest } from "@/lib/admin/auth-helpers";

// Base API URL
const API_URL = "/api/admin/demografi";

// Service API for demografi
export const demografiApi = {
  // Get all demografi data
  getAll: async () => {
    return makeAuthenticatedRequest(API_URL);
  },

  // Get demografi by ID
  getById: async (id: string) => {
    return makeAuthenticatedRequest(`${API_URL}/${id}`);
  },

  // Create new demografi
  create: async (data: CreateDemografiInput) => {
    return makeAuthenticatedRequest(API_URL, 'POST', data);
  },

  // Update demografi
  update: async (id: string, data: UpdateDemografiInput) => {
    return makeAuthenticatedRequest(`${API_URL}/${id}`, 'PUT', data);
  },

  // Delete demografi
  delete: async (id: string) => {
    return makeAuthenticatedRequest(`${API_URL}/${id}`, 'DELETE');
  },
};
