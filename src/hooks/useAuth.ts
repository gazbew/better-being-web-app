import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  twoFactorEnabled?: boolean;
  profileImageUrl?: string;
  createdAt: string;
  lastLogin?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      
      if (storedUser && accessToken) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          clearAuth();
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    initAuth();
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        return true;
      } else {
        clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
      return false;
    }
  }, [clearAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });

        toast({
          title: "Welcome back!",
          description: data.message || "You have been successfully logged in.",
        });

        if (data.requiresEmailVerification) {
          toast({
            title: "Verify Your Email",
            description: "Please verify your email address for full access.",
          });
        }

        return { success: true, data };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }, [toast]);

  const register = useCallback(async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    marketingConsent?: boolean;
  }) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });

        toast({
          title: "Welcome!",
          description: data.message || "Your account has been created successfully!",
        });

        if (!data.user.emailVerified) {
          toast({
            title: "Verify Your Email",
            description: "Please check your email to verify your account.",
          });
        }

        return { success: true, data };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { 
          success: false, 
          error: data.message || 'Registration failed',
          errors: data.errors 
        };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }, [toast]);

  const logout = useCallback(async (logoutAll = false) => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      if (refreshToken) {
        const endpoint = logoutAll ? '/api/auth/logout-all' : '/api/auth/logout';
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (logoutAll) {
          const accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
          }
        }

        await fetch(endpoint, {
          method: 'POST',
          headers,
          body: logoutAll ? undefined : JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      clearAuth();
      toast({
        title: "Logged out",
        description: logoutAll ? "You have been logged out from all devices." : "You have been successfully logged out.",
      });
      navigate('/');
    }
  }, [clearAuth, navigate, toast]);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;
      
      const newUser = { ...prev.user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return {
        ...prev,
        user: newUser,
      };
    });
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        updateUser({ emailVerified: true });
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified!",
        });
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Verification failed' };
      }
    } catch (error) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }, [updateUser, toast]);

  return {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    verifyEmail,
    clearAuth,
  };
}