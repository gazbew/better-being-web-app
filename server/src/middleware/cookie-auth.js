import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Secure cookie-based authentication middleware
export const authenticateTokenFromCookie = async (req, res, next) => {
  try {
    // Try to get token from HTTP-only cookie first, then fallback to Authorization header
    let token = req.cookies?.auth_token;
    
    // Fallback to Authorization header for API requests
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Access token required' 
      });
    }

    // SECURITY: Ensure JWT_SECRET is properly configured
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable not set');
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error' 
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists in database and is active
    const userQuery = `
      SELECT id, email, first_name, last_name, email_verified, locked_until 
      FROM users 
      WHERE id = $1
    `;
    const userResult = await pool.query(userQuery, [decoded.id]);
    
    if (userResult.rows.length === 0) {
      // Clear invalid cookie
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token - user not found' 
      });
    }

    const user = userResult.rows[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({ 
        success: false,
        error: 'Account temporarily locked' 
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

    // Update last activity timestamp
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    next();
  } catch (error) {
    // Clear potentially invalid cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    } else {
      console.error('Cookie auth middleware error:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Authentication failed' 
      });
    }
  }
};

// Optional authentication - user info if token present, but doesn't require it
export const optionalCookieAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.auth_token;
    
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1];
    }

    if (!token || !process.env.JWT_SECRET) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userQuery = 'SELECT id, email, first_name, last_name FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [decoded.id]);
    
    if (userResult.rows.length > 0) {
      req.user = {
        id: userResult.rows[0].id,
        email: userResult.rows[0].email,
        firstName: userResult.rows[0].first_name,
        lastName: userResult.rows[0].last_name
      };
    } else {
      req.user = null;
    }
  } catch (error) {
    // For optional auth, we don't fail on token errors
    req.user = null;
  }
  
  next();
};

// Helper function to set secure authentication cookie
export const setAuthCookie = (res, token) => {
  const forceCrossSite = process.env.ALLOW_CROSS_SITE_COOKIES === 'true';
  const isProd = process.env.NODE_ENV === 'production' || forceCrossSite;
  const cookieOptions = {
    httpOnly: true,
    secure: isProd, // must be true for SameSite=None
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  };
  res.cookie('auth_token', token, cookieOptions);
};

// Helper function to clear authentication cookie
export const clearAuthCookie = (res) => {
  const forceCrossSite = process.env.ALLOW_CROSS_SITE_COOKIES === 'true';
  const isProd = process.env.NODE_ENV === 'production' || forceCrossSite;
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
};

// Alias for compatibility
export const authenticateToken = authenticateTokenFromCookie;
export const optionalAuth = optionalCookieAuth;
