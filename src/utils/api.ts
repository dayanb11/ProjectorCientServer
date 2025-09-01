// Legacy API utility - replaced by new api-client.ts
// This file is kept for backward compatibility but should not be used for new code

export const apiRequest = {
  get: async (endpoint: string) => {
    console.warn('Using legacy apiRequest.get - please migrate to apiClient');
    return { ok: false, json: async () => ({ data: [] }) };
  },
  post: async (endpoint: string, data: any) => {
    console.warn('Using legacy apiRequest.post - please migrate to apiClient');
    return { ok: false, json: async () => ({ data: null }) };
  },
  put: async (endpoint: string, data: any) => {
    console.warn('Using legacy apiRequest.put - please migrate to apiClient');
    return { ok: false, json: async () => ({ data: null }) };
  },
  delete: async (endpoint: string) => {
    console.warn('Using legacy apiRequest.delete - please migrate to apiClient');
    return { ok: false, json: async () => ({ data: null }) };
  }
};

export const getAuthToken = (): string | null => {
  console.warn('Using legacy getAuthToken - please use apiClient');
  return null;
};

export const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  console.warn('Using legacy makeAuthenticatedRequest - please use apiClient');
  return new Response(JSON.stringify({ success: false }), { status: 500 });
};

export const verifyToken = async (): Promise<boolean> => {
  console.warn('Using legacy verifyToken - please use apiClient');
  return false;
};