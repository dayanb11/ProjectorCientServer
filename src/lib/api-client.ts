import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  employeeId: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    employeeId: string;
    fullName: string;
    roleCode: number;
    roleDescription: string;
    procurementTeam?: string;
    email?: string;
    divisionId?: number;
    departmentId?: number;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Program/Task types for API
export interface CreateProgramRequest {
  workYear: number;
  requiredQuarter: string; // ISO date string
  title: string;
  description?: string;
  requesterId: number;
  divisionId: number;
  departmentId?: number;
  domainId?: number;
  estimatedAmount?: number;
  currency?: string;
  supplierList?: string;
  justification?: string;
  planningSource: string;
  complexity?: number;
  startDate?: string; // ISO date string
}

export interface UpdateProgramRequest extends Partial<CreateProgramRequest> {
  assignedOfficerId?: number;
  teamId?: number;
  planningNotes?: string;
  officerNotes?: string;
  status?: string;
  engagementTypeId?: number;
}

// Station assignment types
export interface UpdateStationRequest {
  activityId?: number;
  completionDate?: string; // ISO date string
  reference?: string;
  notes?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    return Cookies.get('accessToken') || null;
  }

  private getRefreshToken(): string | null {
    return Cookies.get('refreshToken') || null;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    // Set secure cookies with appropriate expiration
    Cookies.set('accessToken', accessToken, { 
      expires: 1/24, // 1 hour
      secure: import.meta.env.PROD,
      sameSite: 'strict'
    });
    Cookies.set('refreshToken', refreshToken, { 
      expires: 7, // 7 days
      secure: import.meta.env.PROD,
      sameSite: 'strict'
    });
  }

  private clearTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post<RefreshTokenResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      this.setTokens(accessToken, newRefreshToken);
      
      this.refreshPromise = null;
      return accessToken;
    })();

    return this.refreshPromise;
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', credentials);
    const { accessToken, refreshToken } = response.data;
    this.setTokens(accessToken, refreshToken);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      await this.client.get('/auth/me');
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Programs/Tasks endpoints
  async getPrograms(filters?: Record<string, any>): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/programs', { params: filters });
    return response.data;
  }

  async getProgram(taskId: number): Promise<ApiResponse<any>> {
    const response = await this.client.get(`/programs/${taskId}`);
    return response.data;
  }

  async createProgram(data: CreateProgramRequest): Promise<ApiResponse<any>> {
    const response = await this.client.post('/programs', data);
    return response.data;
  }

  async updateProgram(taskId: number, data: UpdateProgramRequest): Promise<ApiResponse<any>> {
    const response = await this.client.put(`/programs/${taskId}`, data);
    return response.data;
  }

  async deleteProgram(taskId: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/programs/${taskId}`);
    return response.data;
  }

  // Station assignment endpoints
  async updateStation(taskId: number, stationId: number, data: UpdateStationRequest): Promise<ApiResponse<any>> {
    const response = await this.client.put(`/programs/${taskId}/stations/${stationId}`, data);
    return response.data;
  }

  async deleteStation(taskId: number, stationId: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/programs/${taskId}/stations/${stationId}`);
    return response.data;
  }

  // System data endpoints
  async getActivityPool(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/system/activity-pool');
    return response.data;
  }

  async getDomains(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/system/domains');
    return response.data;
  }

  async getWorkers(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/system/workers');
    return response.data;
  }

  async getDivisions(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/system/divisions');
    return response.data;
  }

  async getDepartments(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/system/departments');
    return response.data;
  }

  async getProcurementTeams(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/system/procurement-teams');
    return response.data;
  }

  async getEngagementTypes(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/system/engagement-types');
    return response.data;
  }

  async getOrganizationalRoles(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/infrastructure/organizational-roles');
    return response.data;
  }

  // CRUD operations for system tables
  async createRecord(endpoint: string, data: any): Promise<ApiResponse<any>> {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }

  async updateRecord(endpoint: string, id: number, data: any): Promise<ApiResponse<any>> {
    const response = await this.client.put(`${endpoint}/${id}`, data);
    return response.data;
  }

  async deleteRecord(endpoint: string, id: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`${endpoint}/${id}`);
    return response.data;
  }

  // Planning helpers endpoints
  async getComplexityEstimates(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/planning/complexity-estimates');
    return response.data;
  }

  async updateComplexityEstimates(data: any): Promise<ApiResponse<any>> {
    const response = await this.client.put('/planning/complexity-estimates', data);
    return response.data;
  }

  async getAcceptanceOptions(): Promise<ApiResponse<any[]>> {
    const response = await this.client.get('/planning/acceptance-options');
    return response.data;
  }

  async createAcceptanceOption(data: any): Promise<ApiResponse<any>> {
    const response = await this.client.post('/planning/acceptance-options', data);
    return response.data;
  }

  async updateAcceptanceOption(id: number, data: any): Promise<ApiResponse<any>> {
    const response = await this.client.put(`/planning/acceptance-options/${id}`, data);
    return response.data;
  }

  async deleteAcceptanceOption(id: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/planning/acceptance-options/${id}`);
    return response.data;
  }

  // File upload endpoint
  async uploadFile(file: File, path?: string): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    if (path) formData.append('path', path);

    const response = await this.client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Generic request method for custom endpoints
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request(config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;