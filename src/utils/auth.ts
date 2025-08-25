import type { User, AuthResponse, LoginCredentials, RegisterData } from '@/types';
import { AppErrorClass, ErrorCodes, ValidationHelpers, ValidationRules, validateForm } from './errorHandling';

/**
 * Authentication utilities and helpers
 */

// Token storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

/**
 * Token management utilities
 */
export const TokenManager = {
  /**
   * Store authentication tokens
   */
  setTokens: (authResponse: AuthResponse): void => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(authResponse.user));
    } catch (error) {
      console.warn('Failed to store auth tokens:', error);
    }
  },

  /**
   * Get current auth token
   */
  getToken: (): string | null => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Get current refresh token
   */
  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Get stored user data
   */
  getStoredUser: (): User | null => {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear all authentication data
   */
  clearTokens: (): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.warn('Failed to clear auth tokens:', error);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = TokenManager.getToken();
    const user = TokenManager.getStoredUser();
    return !!(token && user);
  },

  /**
   * Check if token is expired (basic check)
   */
  isTokenExpired: (token?: string): boolean => {
    const authToken = token || TokenManager.getToken();
    if (!authToken) return true;

    try {
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // If we can't decode, assume expired
    }
  },
};

/**
 * Authentication validation helpers
 */
export const AuthValidation = {
  /**
   * Validate login credentials
   */
  validateLogin: (credentials: LoginCredentials) => {
    return validateForm(credentials, {
      email: [
        ValidationRules.required('Email is required'),
        ValidationRules.email(),
      ],
      password: [
        ValidationRules.required('Password is required'),
        ValidationRules.minLength(6, 'Password must be at least 6 characters'),
      ],
    });
  },

  /**
   * Validate registration data
   */
  validateRegistration: (data: RegisterData) => {
    return validateForm(data, {
      firstName: [
        ValidationRules.required('First name is required'),
        ValidationRules.minLength(2, 'First name must be at least 2 characters'),
        ValidationRules.maxLength(50, 'First name must be less than 50 characters'),
      ],
      lastName: [
        ValidationRules.required('Last name is required'),
        ValidationRules.minLength(2, 'Last name must be at least 2 characters'),
        ValidationRules.maxLength(50, 'Last name must be less than 50 characters'),
      ],
      email: [
        ValidationRules.required('Email is required'),
        ValidationRules.email(),
      ],
      password: [
        ValidationRules.required('Password is required'),
        ValidationRules.strongPassword(),
      ],
      confirmPassword: [
        ValidationRules.required('Please confirm your password'),
        (value: unknown) => {
          if (value !== data.password) {
            return 'Passwords do not match';
          }
          return null;
        },
      ],
      agreeToTerms: [
        (value: unknown) => {
          if (!value) {
            return 'You must agree to the terms and conditions';
          }
          return null;
        },
      ],
    });
  },

  /**
   * Validate password reset request
   */
  validatePasswordReset: (email: string) => {
    return validateForm({ email }, {
      email: [
        ValidationRules.required('Email is required'),
        ValidationRules.email(),
      ],
    });
  },

  /**
   * Validate new password
   */
  validateNewPassword: (password: string, confirmPassword: string) => {
    return validateForm({ password, confirmPassword }, {
      password: [
        ValidationRules.required('Password is required'),
        ValidationRules.strongPassword(),
      ],
      confirmPassword: [
        ValidationRules.required('Please confirm your password'),
        (value: unknown) => {
          if (value !== password) {
            return 'Passwords do not match';
          }
          return null;
        },
      ],
    });
  },
};

/**
 * Session management utilities
 */
export const SessionManager = {
  /**
   * Start a new session
   */
  startSession: (authResponse: AuthResponse): void => {
    TokenManager.setTokens(authResponse);
    
    // Set session timestamp
    try {
      localStorage.setItem('session_start', new Date().toISOString());
    } catch (error) {
      console.warn('Failed to set session timestamp:', error);
    }
  },

  /**
   * End current session
   */
  endSession: (): void => {
    TokenManager.clearTokens();
    
    // Clear session data
    try {
      localStorage.removeItem('session_start');
      localStorage.removeItem('last_activity');
    } catch (error) {
      console.warn('Failed to clear session data:', error);
    }
  },

  /**
   * Update last activity timestamp
   */
  updateActivity: (): void => {
    try {
      localStorage.setItem('last_activity', new Date().toISOString());
    } catch (error) {
      console.warn('Failed to update activity timestamp:', error);
    }
  },

  /**
   * Check if session is active (not idle for too long)
   */
  isSessionActive: (maxIdleMinutes: number = 30): boolean => {
    try {
      const lastActivity = localStorage.getItem('last_activity');
      if (!lastActivity) return true; // No activity recorded, assume active

      const lastActivityTime = new Date(lastActivity).getTime();
      const now = new Date().getTime();
      const idleTime = (now - lastActivityTime) / (1000 * 60); // minutes

      return idleTime <= maxIdleMinutes;
    } catch {
      return true; // If we can't check, assume active
    }
  },

  /**
   * Get session duration
   */
  getSessionDuration: (): number => {
    try {
      const sessionStart = localStorage.getItem('session_start');
      if (!sessionStart) return 0;

      const startTime = new Date(sessionStart).getTime();
      const now = new Date().getTime();
      return (now - startTime) / (1000 * 60); // minutes
    } catch {
      return 0;
    }
  },
};

/**
 * Authorization helpers
 */
export const AuthorizationHelpers = {
  /**
   * Check if user has required role
   */
  hasRole: (user: User | null, requiredRole: string): boolean => {
    if (!user) return false;
    // Implement role checking based on your user model
    // This is a placeholder implementation
    return true;
  },

  /**
   * Check if user has required permission
   */
  hasPermission: (user: User | null, permission: string): boolean => {
    if (!user) return false;
    // Implement permission checking based on your user model
    // This is a placeholder implementation
    return true;
  },

  /**
   * Check if user can access resource
   */
  canAccess: (user: User | null, resourceId: string, action: string): boolean => {
    if (!user) return false;
    // Implement resource-level access control
    // This is a placeholder implementation
    return true;
  },
};

/**
 * Authentication state helpers
 */
export const AuthStateHelpers = {
  /**
   * Get initial auth state from stored data
   */
  getInitialAuthState: () => {
    const token = TokenManager.getToken();
    const user = TokenManager.getStoredUser();
    const isAuthenticated = TokenManager.isAuthenticated();

    return {
      user,
      token,
      isAuthenticated,
      isLoading: false,
      error: null,
    };
  },

  /**
   * Handle authentication success
   */
  handleAuthSuccess: (authResponse: AuthResponse) => {
    SessionManager.startSession(authResponse);
    return {
      user: authResponse.user,
      token: authResponse.token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  },

  /**
   * Handle authentication failure
   */
  handleAuthFailure: (error: string | AppErrorClass) => {
    SessionManager.endSession();
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: error instanceof AppErrorClass ? error.message : error,
    };
  },

  /**
   * Handle logout
   */
  handleLogout: () => {
    SessionManager.endSession();
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  },
};

/**
 * Security utilities
 */
export const SecurityHelpers = {
  /**
   * Generate a secure random string
   */
  generateSecureRandom: (length: number = 32): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Hash password (client-side for additional security)
   */
  hashPassword: async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Validate password strength
   */
  getPasswordStrength: (password: string): {
    score: number;
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;
    else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security');

    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    // Common patterns
    if (!/(.)\1{2,}/.test(password)) score += 1;
    else feedback.push('Avoid repeating characters');

    if (!/123|abc|qwe/i.test(password)) score += 1;
    else feedback.push('Avoid common sequences');

    return { score, feedback };
  },

  /**
   * Check for suspicious activity
   */
  checkSuspiciousActivity: (): {
    isSuspicious: boolean;
    reasons: string[];
  } => {
    const reasons: string[] = [];
    
    // Check for too many failed login attempts
    const failedAttempts = Number(sessionStorage.getItem('failed_login_attempts') || '0');
    if (failedAttempts >= 5) {
      reasons.push('Too many failed login attempts');
    }

    // Check for unusual session patterns
    const sessionDuration = SessionManager.getSessionDuration();
    if (sessionDuration > 8 * 60) { // 8 hours
      reasons.push('Unusually long session');
    }

    return {
      isSuspicious: reasons.length > 0,
      reasons,
    };
  },
};

/**
 * Activity tracking
 */
export const ActivityTracker = {
  /**
   * Track login attempt
   */
  trackLoginAttempt: (success: boolean, email?: string): void => {
    const attempts = JSON.parse(sessionStorage.getItem('login_attempts') || '[]');
    attempts.push({
      timestamp: new Date().toISOString(),
      success,
      email: email ? email.substring(0, 3) + '***' : undefined, // Partial email for privacy
    });
    
    // Keep only last 10 attempts
    const recentAttempts = attempts.slice(-10);
    sessionStorage.setItem('login_attempts', JSON.stringify(recentAttempts));

    // Track failed attempts separately
    if (!success) {
      const failedCount = Number(sessionStorage.getItem('failed_login_attempts') || '0');
      sessionStorage.setItem('failed_login_attempts', String(failedCount + 1));
    } else {
      sessionStorage.removeItem('failed_login_attempts');
    }
  },

  /**
   * Track page view
   */
  trackPageView: (path: string): void => {
    SessionManager.updateActivity();
    
    // Store page view for analytics
    const pageViews = JSON.parse(sessionStorage.getItem('page_views') || '[]');
    pageViews.push({
      path,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 50 page views
    const recentViews = pageViews.slice(-50);
    sessionStorage.setItem('page_views', JSON.stringify(recentViews));
  },

  /**
   * Track user action
   */
  trackAction: (action: string, details?: Record<string, unknown>): void => {
    SessionManager.updateActivity();
    
    const actions = JSON.parse(sessionStorage.getItem('user_actions') || '[]');
    actions.push({
      action,
      details,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 100 actions
    const recentActions = actions.slice(-100);
    sessionStorage.setItem('user_actions', JSON.stringify(recentActions));
  },
};

/**
 * Auto-logout functionality
 */
export const AutoLogout = {
  setup: (onLogout: () => void, idleTimeMinutes: number = 30): (() => void) => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!SessionManager.isSessionActive(idleTimeMinutes)) {
          onLogout();
        }
      }, idleTimeMinutes * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => {
      SessionManager.updateActivity();
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Initial timer setup
    resetTimer();

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
    };
  },
};