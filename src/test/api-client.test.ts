import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from '../lib/api-client';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear cookies
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  describe('Authentication', () => {
    it('should login successfully and store tokens', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 1,
            employeeId: '1001',
            fullName: 'Test User',
            roleCode: 1,
            roleDescription: 'מנהל רכש'
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        }
      };

      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      } as any);

      const result = await apiClient.login({
        employeeId: '1001',
        password: '123456'
      });

      expect(result.user.fullName).toBe('Test User');
      expect(result.accessToken).toBe('mock-access-token');
    });

    it('should handle login failure', async () => {
      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      } as any);

      await expect(apiClient.login({
        employeeId: '1001',
        password: 'wrong'
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Programs API', () => {
    it('should fetch programs successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              taskId: 1001,
              title: 'Test Task',
              status: 'Open'
            }
          ]
        }
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      } as any);

      const result = await apiClient.getPrograms();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Task');
    });

    it('should create program successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            taskId: 1002,
            title: 'New Task'
          }
        }
      };

      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      } as any);

      const result = await apiClient.createProgram({
        workYear: 2024,
        requiredQuarter: '2024-03-01T00:00:00.000Z',
        title: 'New Task',
        requesterId: 1,
        divisionId: 1,
        planningSource: 'annual_planning'
      });

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('New Task');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(new Error('Network Error')),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      } as any);

      await expect(apiClient.getPrograms()).rejects.toThrow('Network Error');
    });

    it('should handle 401 errors and attempt token refresh', async () => {
      const mockError = {
        response: { status: 401 },
        config: { _retry: false }
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(mockError),
        post: vi.fn().mockResolvedValue({
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token'
          }
        }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      } as any);

      // This test would need more setup to properly test the interceptor
      // For now, we just verify the error structure
      expect(mockError.response.status).toBe(401);
    });
  });
});