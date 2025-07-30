import { auth } from '@/lib/firebase';
import axios from 'axios';

/**
 * Get the authentication token for the current user
 * @returns Promise resolving to the authentication token
 * @throws Error if user is not authenticated
 */
export const getAuthToken = async (): Promise<string> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  return currentUser.getIdToken();
};

/**
 * Create an axios instance with authentication headers
 * @param baseURL - The base URL for the axios instance
 * @returns Promise resolving to an axios instance with auth headers
 */
export const createAuthenticatedApi = async (baseURL: string) => {
  const token = await getAuthToken();
  
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

/**
 * Helper to make authenticated API requests
 * @param url - The API URL
 * @param method - The HTTP method
 * @param data - The request data (for POST, PUT)
 * @returns Promise resolving to the API response
 */
export const makeAuthenticatedRequest = async <T = any>(
  url: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> => {
  const token = await getAuthToken();
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  switch (method) {
    case 'GET':
      return (await axios.get<T>(url, config)).data;
    case 'POST':
      return (await axios.post<T>(url, data, config)).data;
    case 'PUT':
      return (await axios.put<T>(url, data, config)).data;
    case 'DELETE':
      return (await axios.delete<T>(url, config)).data;
  }
};
