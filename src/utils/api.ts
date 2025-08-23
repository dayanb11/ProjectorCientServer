// API utility functions for making authenticated requests
// COMMENTED OUT - Using mock data instead

const API_BASE_URL = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

import { authService } from '../services/authService';

// Real API implementation using Supabase
export const makeAuthenticatedRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // For now, we'll handle API calls through the dataService
  // This is a placeholder for future REST API integration
  return new Response(JSON.stringify({ success: true, data: [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const apiRequest = {
  get: (endpoint: string) => makeAuthenticatedRequest(endpoint, { method: 'GET' }),
  post: (endpoint: string, data: any) => 
    makeAuthenticatedRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint: string, data: any) => 
    makeAuthenticatedRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) => makeAuthenticatedRequest(endpoint, { method: 'DELETE' }),
};

// Check if user is authenticated by checking mock token
export const verifyToken = async (): Promise<boolean> => {
  return await authService.verifyToken();
};