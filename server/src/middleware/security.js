import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000', 'http://localhost:5173'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

// Rate limiting configurations
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  }
});

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Payment endpoint rate limiting
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 payment requests per minute
  message: {
    error: 'Too many payment attempts, please try again later',
    code: 'PAYMENT_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      scriptSrc: [
        "'self'",
        "https://js.stripe.com",
        "https://checkout.payfast.co.za"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "https://res.cloudinary.com"
      ],
      connectSrc: [
        "'self'",
        "https://api.stripe.com",
        "https://api.payfast.co.za"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: [
        "'self'",
        "https://js.stripe.com",
        "https://checkout.payfast.co.za"
      ]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Basic XSS prevention - remove script tags and javascript: URLs
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    return value;
  };

  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      } else {
        obj[key] = sanitizeValue(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  if (process.env.ENABLE_CORS_LOGGING === 'true') {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      };
      
      if (req.user) {
        logData.userId = req.user.id;
      }
      
      console.log('Request:', JSON.stringify(logData));
    });
  }
  
  next();
};

// Security audit middleware
export const securityAudit = (req, res, next) => {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /union\s+select/i,
    /1=1/,
    /<script>/i,
    /javascript:/i,
    /eval\(/i,
    /document\.cookie/i
  ];

  const requestString = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params
  });

  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    pattern.test(requestString)
  );

  if (hasSuspiciousContent) {
    console.warn('Suspicious request detected:', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      content: requestString
    });
    
    // You might want to block the request or log to security system
    return res.status(400).json({
      error: 'Request rejected due to security policy',
      code: 'SECURITY_VIOLATION'
    });
  }

  next();
};