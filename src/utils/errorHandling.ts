import type { AppError, APIResponse } from '@/types';

/**
 * Enhanced error handling utilities for Better Being application
 */

export class AppErrorClass extends Error {
  code: string;
  details?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  path?: string;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppErrorClass);
    }
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      userId: this.userId,
      path: this.path,
    };
  }
}

/**
 * Standard error codes for the application
 */
export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Product & Inventory
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  INSUFFICIENT_INVENTORY: 'INSUFFICIENT_INVENTORY',
  
  // Cart & Orders
  CART_EMPTY: 'CART_EMPTY',
  CART_ITEM_NOT_FOUND: 'CART_ITEM_NOT_FOUND',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_CANNOT_BE_CANCELLED: 'ORDER_CANNOT_BE_CANCELLED',
  
  // Payment
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_DECLINED: 'PAYMENT_DECLINED',
  INVALID_PAYMENT_METHOD: 'INVALID_PAYMENT_METHOD',
  
  // Network & System
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Error handler for API responses
 */
export const handleApiError = (error: unknown, context?: string): AppErrorClass => {
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error);

  if (error instanceof AppErrorClass) {
    return error;
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch')) {
      return new AppErrorClass(
        'Network connection failed. Please check your internet connection.',
        ErrorCodes.NETWORK_ERROR,
        { originalError: error.message, context }
      );
    }

    // Parse API error responses
    try {
      const errorData = JSON.parse(error.message);
      return new AppErrorClass(
        errorData.message || 'An error occurred',
        errorData.code || ErrorCodes.UNKNOWN_ERROR,
        { ...errorData, context }
      );
    } catch {
      return new AppErrorClass(
        error.message,
        ErrorCodes.UNKNOWN_ERROR,
        { context }
      );
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return new AppErrorClass(error, ErrorCodes.UNKNOWN_ERROR, { context });
  }

  // Fallback for unknown error types
  return new AppErrorClass(
    'An unexpected error occurred',
    ErrorCodes.UNKNOWN_ERROR,
    { originalError: error, context }
  );
};

/**
 * Wrapper for async operations with error handling
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: string,
  fallbackValue?: T
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    const appError = handleApiError(error, context);
    
    // Log error for monitoring
    logError(appError);
    
    // Return fallback value if provided
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    
    // Re-throw as AppError for consistent handling
    throw appError;
  }
};

/**
 * Retry logic for failed operations
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  context?: string
): Promise<T> => {
  let lastError: AppErrorClass;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = handleApiError(error, `${context} (attempt ${attempt})`);
      
      // Don't retry for certain error types
      if (
        lastError.code === ErrorCodes.UNAUTHORIZED ||
        lastError.code === ErrorCodes.FORBIDDEN ||
        lastError.code === ErrorCodes.VALIDATION_ERROR ||
        lastError.code === ErrorCodes.NOT_FOUND
      ) {
        throw lastError;
      }

      // Wait before retrying (except on last attempt)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError!;
};

/**
 * Validation helper functions
 */
export const ValidationHelpers = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  isStrongPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongPasswordRegex.test(password);
  },

  isValidZipCode: (zipCode: string, country: string = 'US'): boolean => {
    const zipRegexes = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/,
    };
    
    const regex = zipRegexes[country as keyof typeof zipRegexes];
    return regex ? regex.test(zipCode) : true; // Default to valid for unknown countries
  },
};

/**
 * Error logging function (can be extended to send to monitoring services)
 */
export const logError = (error: AppErrorClass | Error): void => {
  // In development, log to console
  if (import.meta.env.DEV) {
    console.group('🚨 Application Error');
    console.error('Error:', error);
    if (error instanceof AppErrorClass) {
      console.table(error.toJSON());
    }
    console.groupEnd();
  }

  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    // TODO: Integrate with monitoring service like Sentry, LogRocket, etc.
    // Example: Sentry.captureException(error);
  }

  // Store in local storage for debugging (limit to last 50 errors)
  try {
    const storedErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    storedErrors.unshift(error instanceof AppErrorClass ? error.toJSON() : {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 50 errors
    const limitedErrors = storedErrors.slice(0, 50);
    localStorage.setItem('app_errors', JSON.stringify(limitedErrors));
  } catch {
    // Ignore localStorage errors
  }
};

/**
 * Form validation helper
 */
export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, Array<(value: unknown) => string | null>>
): { isValid: boolean; errors: Record<keyof T, string> } => {
  const errors = {} as Record<keyof T, string>;
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field as keyof T];
    const value = data[field as keyof T];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field as keyof T] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: (message: string = 'This field is required') => 
    (value: unknown): string | null => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return message;
      }
      return null;
    },

  email: (message: string = 'Please enter a valid email address') =>
    (value: unknown): string | null => {
      if (typeof value === 'string' && value && !ValidationHelpers.isEmail(value)) {
        return message;
      }
      return null;
    },

  minLength: (min: number, message?: string) =>
    (value: unknown): string | null => {
      if (typeof value === 'string' && value.length < min) {
        return message || `Must be at least ${min} characters long`;
      }
      return null;
    },

  maxLength: (max: number, message?: string) =>
    (value: unknown): string | null => {
      if (typeof value === 'string' && value.length > max) {
        return message || `Must be no more than ${max} characters long`;
      }
      return null;
    },

  strongPassword: (message: string = 'Password must be at least 8 characters with uppercase, lowercase, and number') =>
    (value: unknown): string | null => {
      if (typeof value === 'string' && value && !ValidationHelpers.isStrongPassword(value)) {
        return message;
      }
      return null;
    },

  phoneNumber: (message: string = 'Please enter a valid phone number') =>
    (value: unknown): string | null => {
      if (typeof value === 'string' && value && !ValidationHelpers.isPhoneNumber(value)) {
        return message;
      }
      return null;
    },

  min: (min: number, message?: string) =>
    (value: unknown): string | null => {
      const num = Number(value);
      if (!isNaN(num) && num < min) {
        return message || `Must be at least ${min}`;
      }
      return null;
    },

  max: (max: number, message?: string) =>
    (value: unknown): string | null => {
      const num = Number(value);
      if (!isNaN(num) && num > max) {
        return message || `Must be no more than ${max}`;
      }
      return null;
    },
};

/**
 * User-friendly error messages
 */
export const getErrorMessage = (code: string, fallback?: string): string => {
  const messages: Record<string, string> = {
    [ErrorCodes.UNAUTHORIZED]: 'Please log in to continue',
    [ErrorCodes.FORBIDDEN]: 'You don\'t have permission to perform this action',
    [ErrorCodes.TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
    [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid email or password',
    [ErrorCodes.VALIDATION_ERROR]: 'Please check your input and try again',
    [ErrorCodes.PRODUCT_NOT_FOUND]: 'Product not found',
    [ErrorCodes.OUT_OF_STOCK]: 'This product is currently out of stock',
    [ErrorCodes.INSUFFICIENT_INVENTORY]: 'Not enough items in stock',
    [ErrorCodes.CART_EMPTY]: 'Your cart is empty',
    [ErrorCodes.ORDER_NOT_FOUND]: 'Order not found',
    [ErrorCodes.PAYMENT_FAILED]: 'Payment failed. Please try again',
    [ErrorCodes.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection',
    [ErrorCodes.SERVER_ERROR]: 'Server error. Please try again later',
    [ErrorCodes.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
    [ErrorCodes.RATE_LIMITED]: 'Too many requests. Please wait a moment and try again',
  };
  
  return messages[code] || fallback || 'An unexpected error occurred';
};

/**
 * API response helper
 */
export const isApiError = <T>(response: APIResponse<T>): response is APIResponse<T> & { success: false } => {
  return !response.success;
};

export const unwrapApiResponse = <T>(response: APIResponse<T>): T => {
  if (isApiError(response)) {
    throw new AppErrorClass(
      response.error || 'API request failed',
      response.error || ErrorCodes.UNKNOWN_ERROR,
      { response }
    );
  }
  
  if (!response.data) {
    throw new AppErrorClass(
      'No data received from API',
      ErrorCodes.UNKNOWN_ERROR,
      { response }
    );
  }
  
  return response.data;
};