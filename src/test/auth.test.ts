import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../components/auth/AuthProvider';
import LoginForm from '../components/auth/LoginForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock the API client
vi.mock('../lib/api-client', () => ({
  apiClient: {
    login: vi.fn(),
    logout: vi.fn(),
    verifyToken: vi.fn(),
    getCurrentUser: vi.fn()
  }
}));

// Mock toast hook
vi.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('LoginForm', () => {
    it('should render login form correctly', () => {
      const mockOnLogin = vi.fn();
      
      render(
        <TestWrapper>
          <LoginForm onLogin={mockOnLogin} />
        </TestWrapper>
      );

      expect(screen.getByText('כניסה למערכת')).toBeInTheDocument();
      expect(screen.getByLabelText(/קוד משתמש/)).toBeInTheDocument();
      expect(screen.getByLabelText(/סיסמה/)).toBeInTheDocument();
    });

    it('should validate employee ID format', async () => {
      const mockOnLogin = vi.fn();
      
      render(
        <TestWrapper>
          <LoginForm onLogin={mockOnLogin} />
        </TestWrapper>
      );

      const employeeIdInput = screen.getByLabelText(/קוד משתמש/);
      const passwordInput = screen.getByLabelText(/סיסמה/);
      const submitButton = screen.getByRole('button', { name: /כניסה למערכת/ });

      fireEvent.change(employeeIdInput, { target: { value: '123' } }); // Too short
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/קוד משתמש חייב להיות בן 4 ספרות/)).toBeInTheDocument();
      });

      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    it('should validate password format', async () => {
      const mockOnLogin = vi.fn();
      
      render(
        <TestWrapper>
          <LoginForm onLogin={mockOnLogin} />
        </TestWrapper>
      );

      const employeeIdInput = screen.getByLabelText(/קוד משתמש/);
      const passwordInput = screen.getByLabelText(/סיסמה/);
      const submitButton = screen.getByRole('button', { name: /כניסה למערכת/ });

      fireEvent.change(employeeIdInput, { target: { value: '1001' } });
      fireEvent.change(passwordInput, { target: { value: '123' } }); // Too short
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/סיסמה חייבת להיות בת 6 תווים/)).toBeInTheDocument();
      });

      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    it('should call onLogin with correct credentials', async () => {
      const mockOnLogin = vi.fn().mockResolvedValue(undefined);
      
      render(
        <TestWrapper>
          <LoginForm onLogin={mockOnLogin} />
        </TestWrapper>
      );

      const employeeIdInput = screen.getByLabelText(/קוד משתמש/);
      const passwordInput = screen.getByLabelText(/סיסמה/);
      const submitButton = screen.getByRole('button', { name: /כניסה למערכת/ });

      fireEvent.change(employeeIdInput, { target: { value: '1001' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledWith({
          employeeId: '1001',
          password: '123456'
        });
      });
    });
  });

  describe('AuthProvider', () => {
    it('should provide authentication context', () => {
      const TestComponent = () => {
        const { isAuthenticated, user } = useAuth();
        return (
          <div>
            <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</span>
            <span data-testid="user-name">{user?.fullName || 'no-user'}</span>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('user-name')).toHaveTextContent('no-user');
    });
  });
});