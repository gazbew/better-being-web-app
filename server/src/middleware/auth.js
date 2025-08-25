import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // SECURITY: Ensure JWT_SECRET is properly configured
  if (!process.env.JWT_SECRET) {
    console.error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists in database
    const userQuery = 'SELECT id, email, first_name, last_name FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [decoded.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }
    
    req.user = userResult.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  // SECURITY: Ensure JWT_SECRET is properly configured
  if (!process.env.JWT_SECRET) {
    console.error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable not set');
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userQuery = 'SELECT id, email, first_name, last_name FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [decoded.id]);
    
    if (userResult.rows.length > 0) {
      req.user = userResult.rows[0];
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }
  
  next();
};

// Alias for compatibility with existing routes
export const authenticate = authenticateToken;
