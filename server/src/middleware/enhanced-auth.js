import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { authenticateHybrid, optionalHybrid } from './stack-auth.js';

// Enhanced JWT authentication middleware with refresh token support
// Prefer hybrid auth (local JWT or Stack Auth JWKS). Fallback to legacy if hybrid fails to import.
export const authenticateToken = async (req, res, next) => {
  if (authenticateHybrid) return authenticateHybrid(req, res, next);
  try {
    // Prefer secure HTTP-only cookie; fall back to Authorization header
    let token = req.cookies?.auth_token;
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        code: 'MISSING_TOKEN'
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const userResult = await pool.query(
      'SELECT id, email, first_name, last_name, email_verified, locked_until FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({ 
        message: 'Account temporarily locked',
        code: 'ACCOUNT_LOCKED'
      });
    }

    // Check if email is verified for sensitive operations
    // Require email verification for sensitive operations
    if (!user.email_verified && (req.path.includes('/profile') || req.path.includes('/orders'))) {
      return res.status(403).json({ 
        message: 'Email verification required',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      emailVerified: user.email_verified
    };

    // Update last activity
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({ 
      message: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Optional authentication - user info if token present, but doesn't require it
export const optionalAuth = async (req, res, next) => {
  if (optionalHybrid) return optionalHybrid(req, res, next);
  try {
    let token = req.cookies?.auth_token;
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userResult = await pool.query(
        'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
        [decoded.id]
      );

      if (userResult.rows.length > 0) {
        req.user = {
          id: userResult.rows[0].id,
          email: userResult.rows[0].email,
          firstName: userResult.rows[0].first_name,
          lastName: userResult.rows[0].last_name
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    next();
  }
};

// Refresh token validation
export const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        message: 'Refresh token required',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Check if refresh token exists and is active
    const sessionResult = await pool.query(
      `SELECT us.*, u.id as user_id, u.email, u.first_name, u.last_name 
       FROM user_sessions us 
       JOIN users u ON us.user_id = u.id 
       WHERE us.refresh_token = $1 AND us.is_active = true AND us.expires_at > CURRENT_TIMESTAMP`,
      [refreshToken]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    const session = sessionResult.rows[0];
    req.user = {
      id: session.user_id,
      email: session.email,
      firstName: session.first_name,
      lastName: session.last_name
    };
    req.session = session;

    next();
  } catch (error) {
    console.error('Refresh token validation error:', error);
    return res.status(500).json({ 
      message: 'Token validation failed',
      code: 'TOKEN_VALIDATION_ERROR'
    });
  }
};

// Admin role check
export const requireAdmin = async (req, res, next) => {
  try {
    // Check if user has admin role (you can customize this logic)
    const adminEmails = ['admin@betterbeing.co.za', 'gareth@betterbeing.co.za'];
    
    if (!adminEmails.includes(req.user.email)) {
      return res.status(403).json({ 
        message: 'Admin access required',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ 
      message: 'Authorization check failed',
      code: 'AUTH_CHECK_ERROR'
    });
  }
};

// Rate limiting middleware
export const rateLimitByUser = (maxRequests = 60, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    const identifier = req.user ? `user_${req.user.id}` : req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old requests
    if (requests.has(identifier)) {
      const userRequests = requests.get(identifier).filter(time => time > windowStart);
      requests.set(identifier, userRequests);
    } else {
      requests.set(identifier, []);
    }

    const userRequests = requests.get(identifier);

    if (userRequests.length >= maxRequests) {
      return res.status(429).json({ 
        message: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    userRequests.push(now);
    requests.set(identifier, userRequests);

    next();
  };
};
