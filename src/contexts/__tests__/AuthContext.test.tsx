import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/services/api', () => ({
  api: {
    request: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  },
}));

// Test component to access AuthContext
const TestComponent = () => {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    login, 
    register, 
    logout, 
    refreshUser 
  } = useAuth();

  return (
    <div>
      <div data-testid="user-id">{user?.id || 'null'}</div>
      <div data-testid="user-email">{user?.email || 'null'}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
      <button 
        data-testid="login-btn" 
        onClick={() => login('test@example.com', 'password123')}
      >
        Login
      </button>
      <button 
        data-testid="register-btn" 
        onClick={() => register({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        })}
      >
        Register
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
      <button data-testid="refresh-btn" onClick={refreshUser}>
        Refresh
      </button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should initialize with default state when no token exists', async () => {
      renderWithAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('user-id')).toHaveTextContent('null');
        expect(screen.getByTestId('user-email')).toHaveTextContent('null');
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });
    });

    it('should verify existing token on mount', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: '2023-01-01'
      };

      localStorage.setItem('auth_token', 'valid-token');
      
      const { api } = await import('@/services/api');
      vi.mocked(api.request).mockResolvedValueOnce({
        success: true,
        data: { user: mockUser }
      });

      renderWithAuthProvider();

      await waitFor(() => {
        expect(screen.getByTestId('user-id')).toHaveTextContent('1');
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });
    });

    it('should remove invalid token on mount', async () => {
      localStorage.setItem('auth_token', 'invalid-token');
      
      const { api } = await import('@/services/api');
      vi.mocked(api.request).mockRejectedValueOnce(new Error('Invalid token'));

      renderWithAuthProvider();

      await waitFor(() => {
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('Login Functionality', () => {
    it('should successfully login user', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: '2023-01-01'
      };

      const { api } = await import('@/services/api');
      vi.mocked(api.login).mockResolvedValueOnce({
        success: true,
        data: {
          user: mockUser,
          token: 'auth-token-123'
        }
      });

      renderWithAuthProvider();

      await user.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(localStorage.getItem('auth_token')).toBe('auth-token-123');
        expect(screen.getByTestId('user-id')).toHaveTextContent('1');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
        expect(toast.success).toHaveBeenCalledWith('Welcome back!');
      });
    });

    it('should handle login failure', async () => {
      const user = userEvent.setup();
      
      const { api } = await import('@/services/api');
      vi.mocked(api.login).mockResolvedValueOnce({
        success: false,
        error: 'Invalid credentials'
      });

      renderWithAuthProvider();

      await user.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
      });
    });

    it('should handle login network error', async () => {
      const user = userEvent.setup();
      
      const { api } = await import('@/services/api');
      vi.mocked(api.login).mockRejectedValueOnce(new Error('Network error'));

      renderWithAuthProvider();

      await user.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Login failed. Please try again.');
      });
    });
  });

  describe('Registration Functionality', () => {
    it('should successfully register user', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: 2,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: '2023-01-01'
      };

      const { api } = await import('@/services/api');
      vi.mocked(api.register).mockResolvedValueOnce({
        success: true,
        data: {
          user: mockUser,
          tokens: {
            accessToken: 'access-token-123'
          }
        }
      });

      renderWithAuthProvider();

      await user.click(screen.getByTestId('register-btn'));

      await waitFor(() => {
        expect(localStorage.getItem('auth_token')).toBe('access-token-123');
        expect(screen.getByTestId('user-id')).toHaveTextContent('2');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
        expect(toast.success).toHaveBeenCalledWith('Account created successfully!');
      });
    });

    it('should handle registration failure', async () => {
      const user = userEvent.setup();
      
      const { api } = await import('@/services/api');
      vi.mocked(api.register).mockResolvedValueOnce({
        success: false,
        error: 'Email already exists'
      });

      renderWithAuthProvider();

      await user.click(screen.getByTestId('register-btn'));

      await waitFor(() => {
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        expect(toast.error).toHaveBeenCalledWith('Email already exists');
      });
    });

    it('should handle registration network error', async () => {
      const user = userEvent.setup();
      
      const { api } = await import('@/services/api');
      vi.mocked(api.register).mockRejectedValueOnce(new Error('Network error'));

      renderWithAuthProvider();

      await user.click(screen.getByTestId('register-btn'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Registration failed. Please try again.');
      });
    });
  });

  describe('Logout Functionality', () => {
    it('should successfully logout user', async () => {
      const user = userEvent.setup();
      
      // Set up authenticated state
      localStorage.setItem('auth_token', 'token');
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: '2023-01-01'
      };

      const { api } = await import('@/services/api');
      vi.mocked(api.request).mockResolvedValueOnce({
        success: true,
        data: { user: mockUser }
      });

      renderWithAuthProvider();

      // Wait for auth initialization
      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      // Perform logout
      await user.click(screen.getByTestId('logout-btn'));

      await waitFor(() => {
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(screen.getByTestId('user-id')).toHaveTextContent('null');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
      });
    });
  });

  describe('User Refresh Functionality', () => {
    it('should successfully refresh user data', async () => {
      const user = userEvent.setup();
      
      // Set up authenticated state
      localStorage.setItem('auth_token', 'token');
      const initialUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: '2023-01-01'
      };

      const updatedUser = {
        ...initialUser,
        first_name: 'Updated',
        last_name: 'Name'
      };

      const { api } = await import('@/services/api');
      
      // Mock initial verification
      vi.mocked(api.request).mockResolvedValueOnce({
        success: true,
        data: { user: initialUser }
      });

      renderWithAuthProvider();

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      // Mock refresh call
      vi.mocked(api.request).mockResolvedValueOnce({
        success: true,
        data: { user: updatedUser }
      });

      await user.click(screen.getByTestId('refresh-btn'));

      await waitFor(() => {
        expect(api.request).toHaveBeenCalledWith('/users/profile');
      });
    });

    it('should handle refresh failure gracefully', async () => {
      const user = userEvent.setup();
      
      // Set up authenticated state
      localStorage.setItem('auth_token', 'token');
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: '2023-01-01'
      };

      const { api } = await import('@/services/api');
      
      // Mock initial verification
      vi.mocked(api.request).mockResolvedValueOnce({
        success: true,
        data: { user: mockUser }
      });

      renderWithAuthProvider();

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      // Mock refresh failure
      vi.mocked(api.request).mockRejectedValueOnce(new Error('Refresh failed'));

      await user.click(screen.getByTestId('refresh-btn'));

      // Should not break the app, user should remain logged in
      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during login', async () => {
      const user = userEvent.setup();
      
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      const { api } = await import('@/services/api');
      vi.mocked(api.login).mockReturnValueOnce(loginPromise as any);

      renderWithAuthProvider();

      await user.click(screen.getByTestId('login-btn'));

      // Should show loading state
      expect(screen.getByTestId('is-loading')).toHaveTextContent('true');

      // Resolve the promise
      act(() => {
        resolveLogin!({
          success: true,
          data: {
            user: { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User', created_at: '2023-01-01' },
            token: 'token'
          }
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });
    });

    it('should show loading state during registration', async () => {
      const user = userEvent.setup();
      
      let resolveRegister: (value: any) => void;
      const registerPromise = new Promise((resolve) => {
        resolveRegister = resolve;
      });

      const { api } = await import('@/services/api');
      vi.mocked(api.register).mockReturnValueOnce(registerPromise as any);

      renderWithAuthProvider();

      await user.click(screen.getByTestId('register-btn'));

      // Should show loading state
      expect(screen.getByTestId('is-loading')).toHaveTextContent('true');

      // Resolve the promise
      act(() => {
        resolveRegister!({
          success: true,
          data: {
            user: { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User', created_at: '2023-01-01' },
            tokens: { accessToken: 'token' }
          }
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });
    });
  });

  describe('Error Handling', () => {
    it('should throw error when useAuth is used outside AuthProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      console.error = originalError;
    });
  });
});