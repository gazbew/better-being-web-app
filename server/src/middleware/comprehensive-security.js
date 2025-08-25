import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult, param, query } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import crypto from 'crypto';

// CSRF Protection Middleware
export const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET requests and safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip for API token authentication (already secure)
  if (req.headers['authorization']) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token mismatch',
      code: 'CSRF_TOKEN_MISMATCH'
    });
  }

  next();
};

// Generate CSRF token endpoint
export const generateCSRFToken = (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  req.session.csrfToken = token;
  res.json({ csrfToken: token });
};

// XSS Protection Middleware
export const xssProtection = (req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// Recursive object sanitization
function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return DOMPurify.sanitize(obj, { 
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: []  // No attributes allowed
    }).trim();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

// SQL Injection Prevention - Input Validation Rules
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be 8-128 characters with uppercase, lowercase, number, and special character'),
  body('firstName')
    .isLength({ min: 1, max: 50 })
    .isAlpha('en-US', { ignore: ' \'-' })
    .withMessage('First name must be 1-50 characters, letters only'),
  body('lastName')
    .isLength({ min: 1, max: 50 })
    .isAlpha('en-US', { ignore: ' \'-' })
    .withMessage('Last name must be 1-50 characters, letters only'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number required')
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 1, max: 128 })
    .withMessage('Password is required')
];

export const validateUserProfile = [
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .isAlpha('en-US', { ignore: ' \'-' })
    .withMessage('First name must be 1-50 characters, letters only'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .isAlpha('en-US', { ignore: ' \'-' })
    .withMessage('Last name must be 1-50 characters, letters only'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number required')
];

export const validateProductQueries = [
  query('category')
    .optional()
    .isAlphanumeric('en-US', { ignore: '-_' })
    .isLength({ max: 50 })
    .withMessage('Category must be alphanumeric'),
  query('search')
    .optional()
    .isLength({ max: 100 })
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Search term contains invalid characters'),
  query('sort')
    .optional()
    .isIn(['name', 'price', 'rating', 'created_at'])
    .withMessage('Invalid sort parameter'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be non-negative')
];

export const validateOrderCreation = [
  body('items')
    .isArray({ min: 1, max: 20 })
    .withMessage('Order must have 1-20 items'),
  body('items.*.productId')
    .isInt({ min: 1 })
    .withMessage('Valid product ID required'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
  body('shippingAddress.street')
    .isLength({ min: 5, max: 200 })
    .matches(/^[a-zA-Z0-9\s\-.,#]+$/)
    .withMessage('Valid street address required'),
  body('shippingAddress.city')
    .isLength({ min: 2, max: 50 })
    .isAlpha('en-US', { ignore: ' \'-' })
    .withMessage('Valid city name required'),
  body('shippingAddress.postalCode')
    .matches(/^[0-9]{4}$/)
    .withMessage('Valid 4-digit postal code required'),
  body('shippingAddress.country')
    .isIn(['ZA', 'SA'])
    .withMessage('Only South Africa supported')
];

export const validateProductReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .matches(/^[a-zA-Z0-9\s\-.,!?'"]+$/)
    .withMessage('Comment contains invalid characters'),
  param('productId')
    .isInt({ min: 1 })
    .withMessage('Valid product ID required')
];

// Validation Error Handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach(error => {
      formattedErrors[error.path] = error.msg;
    });
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

// Advanced Rate Limiting
export const createAdvancedRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    },
  // Use default keyGenerator (IP-aware) to avoid validation issues with IPv6 during dev.
  });
};

// Strict authentication rate limiting
export const authRateLimit = createAdvancedRateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

// API rate limiting
export const apiRateLimit = createAdvancedRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Enhanced Helmet Configuration
export const enhancedHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: { policy: "require-corp" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
});

// File Upload Security
export const secureFileUpload = (req, res, next) => {
  // Validate file types if files are present
  if (req.files) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (const file of Object.values(req.files)) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, and WebP allowed.'
        });
      }
      
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 5MB.'
        });
      }
    }
  }
  
  next();
};

// Database Connection Security
export const sanitizeQuery = (query, params = []) => {
  // Ensure all parameters are properly escaped
  // This is handled by pg's parameterized queries, but we add extra validation
  const sanitizedParams = params.map(param => {
    if (typeof param === 'string') {
      // Remove any potential SQL injection attempts
      return param.replace(/[';\\]/g, '');
    }
    return param;
  });
  
  return { query, params: sanitizedParams };
};

// Security Headers Middleware
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent information disclosure
  res.removeHeader('X-Powered-By');
  
  // Strict transport security (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
};

// Request Size Limits
export const requestSizeLimits = {
  json: { limit: '1mb' },
  urlencoded: { limit: '1mb', extended: true },
  text: { limit: '500kb' }
};

export default {
  csrfProtection,
  generateCSRFToken,
  xssProtection,
  validateUserRegistration,
  validateUserLogin,
  validateUserProfile,
  validateProductQueries,
  validateOrderCreation,
  validateProductReview,
  handleValidationErrors,
  authRateLimit,
  apiRateLimit,
  enhancedHelmet,
  secureFileUpload,
  sanitizeQuery,
  securityHeaders,
  requestSizeLimits
};