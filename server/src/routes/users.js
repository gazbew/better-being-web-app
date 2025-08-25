import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { setAuthCookie, clearAuthCookie } from '../middleware/cookie-auth.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfile,
  handleValidationErrors,
  authRateLimit,
  xssProtection
} from '../middleware/comprehensive-security.js';

const router = express.Router();

// User registration with security validation
router.post('/register', 
  authRateLimit,
  xssProtection,
  validateUserRegistration,
  handleValidationErrors,
  async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide all required fields',
        errors: [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is required' },
          { field: 'firstName', message: 'First name is required' },
          { field: 'lastName', message: 'Last name is required' }
        ]
      });
    }
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'User already exists with this email address' 
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, created_at',
      [email, hashedPassword, firstName, lastName]
    );
    // SECURITY: Ensure JWT_SECRET is properly configured
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable not set');
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error' 
      });
    }

    // Generate token
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Set secure HTTP-only cookie
    setAuthCookie(res, token);
    
    res.status(201).json({
      success: true,
      user: newUser.rows[0],
      tokens: {
        accessToken: token, // Still provide for API clients
        refreshToken: token // For now, using same token
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to register user',
      message: error.message 
    });
  }
});

// User login with security validation
router.post('/login',
  authRateLimit,
  xssProtection,
  validateUserLogin,
  handleValidationErrors,
  async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // SECURITY: Ensure JWT_SECRET is properly configured
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable not set');
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error' 
      });
    }

    // Generate token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Set secure HTTP-only cookie
    setAuthCookie(res, token);
    
    res.json({
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        first_name: user.rows[0].first_name,
        last_name: user.rows[0].last_name
      },
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userQuery = `
      SELECT id, email, first_name, last_name, phone, created_at
      FROM users 
      WHERE id = $1
    `;
    const result = await pool.query(userQuery, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Secure logout route
router.post('/logout', (req, res) => {
  try {
    // Clear the secure HTTP-only cookie
    clearAuthCookie(res);
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to logout' 
    });
  }
});

// Token verification route for cookie-based auth
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // If we reach here, the token is valid (checked by middleware)
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to verify token' 
    });
  }
});

// Update user profile with security validation
router.put('/profile', 
  authenticateToken,
  xssProtection,
  validateUserProfile,
  handleValidationErrors,
  async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;
    
    const updateQuery = `
      UPDATE users 
      SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, email, first_name, last_name, phone
    `;
    
    const result = await pool.query(updateQuery, [firstName, lastName, phone, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Remove duplicate - already defined above

export default router;
