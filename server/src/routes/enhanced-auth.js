import express from 'express';
import pool from '../config/database.js';
import AuthService from '../services/auth.service.js';
import { authenticateToken, optionalAuth, rateLimitByUser } from '../middleware/enhanced-auth.js';
import { authLimiter } from '../middleware/security.js';
import { asyncHandler } from '../middleware/error-handler.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateEmailVerification,
  validateRefreshToken,
  validateProfileUpdate,
  validatePasswordChange,
  sanitizeInput
} from '../middleware/validation.js';

const router = express.Router();

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Helper function to extract device info
const getDeviceInfo = (req) => ({
  userAgent: req.get('User-Agent') || 'Unknown',
  ip: req.ip || req.connection.remoteAddress || '127.0.0.1'
});

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', 
  authLimiter,
  validateUserRegistration,
  asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, marketingConsent } = req.body;
    
    const result = await AuthService.registerUser({
      email,
      password,
      firstName,
      lastName,
      marketingConsent
    });

    // In production, send verification email instead of returning token
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: result.user,
      tokens: result.tokens,
      // Remove in production - this should be sent via email
      emailVerificationToken: result.emailVerificationToken
    });
  })
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login',
  authLimiter,
  validateUserLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const deviceInfo = getDeviceInfo(req);
    
    const result = await AuthService.loginUser(email, password, deviceInfo);

    res.json({
      success: true,
      message: 'Login successful',
      user: result.user,
      tokens: result.tokens,
      ...(result.requiresEmailVerification && {
        requiresEmailVerification: true,
        message: 'Login successful. Please verify your email address for full access.'
      })
    });
  })
);

/**
 * @route POST /api/auth/verify-email
 * @desc Verify user email address
 * @access Public
 */
router.post('/verify-email',
  validateEmailVerification,
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    
    const result = await AuthService.verifyEmail(token);

    res.json({
      success: true,
      message: 'Email verified successfully',
      user: result.user
    });
  })
);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post('/forgot-password',
  authLimiter,
  validatePasswordResetRequest,
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    const result = await AuthService.requestPasswordReset(email);

    res.json({
      success: true,
      message: result.message,
      // Remove in production - this should be sent via email
      ...(result.resetToken && { resetToken: result.resetToken })
    });
  })
);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password',
  authLimiter,
  validatePasswordReset,
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    
    const result = await AuthService.resetPassword(token, password);

    res.json({
      success: true,
      message: result.message,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.first_name,
        lastName: result.user.last_name
      }
    });
  })
);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh',
  rateLimitByUser(10, 60000), // 10 requests per minute
  validateRefreshToken,
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    const result = await AuthService.refreshToken(refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      user: result.user,
      tokens: result.tokens
    });
  })
);

/**
 * @route POST /api/auth/logout
 * @desc Logout user (invalidate refresh token)
 * @access Private
 */
router.post('/logout',
  validateRefreshToken,
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    await AuthService.logout(refreshToken);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  })
);

/**
 * @route POST /api/auth/logout-all
 * @desc Logout from all devices
 * @access Private
 */
router.post('/logout-all',
  authenticateToken,
  asyncHandler(async (req, res) => {
    await AuthService.logoutAll(req.user.id);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  })
);

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    // User info is already attached by authenticateToken middleware
    const userQuery = `
      SELECT 
        id, email, first_name, last_name, phone, 
        date_of_birth, gender, marketing_consent,
        email_verified, two_factor_enabled, created_at,
        last_login, profile_image_url
      FROM users 
      WHERE id = $1
    `;
    
    const result = await pool.query(userQuery, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        marketingConsent: user.marketing_consent,
        emailVerified: user.email_verified,
        twoFactorEnabled: user.two_factor_enabled,
        profileImageUrl: user.profile_image_url,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });
  })
);

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile',
  authenticateToken,
  validateProfileUpdate,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, phone, dateOfBirth, gender, marketingConsent } = req.body;
    
    const updateFields = [];
    const values = [userId];
    let paramCount = 2;

    if (firstName !== undefined) {
      updateFields.push(`first_name = $${paramCount}`);
      values.push(firstName);
      paramCount++;
    }
    
    if (lastName !== undefined) {
      updateFields.push(`last_name = $${paramCount}`);
      values.push(lastName);
      paramCount++;
    }
    
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }
    
    if (dateOfBirth !== undefined) {
      updateFields.push(`date_of_birth = $${paramCount}`);
      values.push(dateOfBirth);
      paramCount++;
    }
    
    if (gender !== undefined) {
      updateFields.push(`gender = $${paramCount}`);
      values.push(gender);
      paramCount++;
    }
    
    if (marketingConsent !== undefined) {
      updateFields.push(`marketing_consent = $${paramCount}`);
      values.push(marketingConsent);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $1 
      RETURNING id, email, first_name, last_name, phone, 
                date_of_birth, gender, marketing_consent, 
                updated_at
    `;

    const result = await pool.query(updateQuery, values);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        phone: result.rows[0].phone,
        dateOfBirth: result.rows[0].date_of_birth,
        gender: result.rows[0].gender,
        marketingConsent: result.rows[0].marketing_consent,
        updatedAt: result.rows[0].updated_at
      }
    });
  })
);

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password',
  authenticateToken,
  authLimiter,
  validatePasswordChange,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await AuthService.comparePassword(
      currentPassword, 
      userResult.rows[0].password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await AuthService.hashPassword(newPassword);

    // Update password and invalidate all sessions except current
    await pool.query(`
      UPDATE users 
      SET password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [hashedPassword, userId]);

    // Invalidate all other sessions for security
    await pool.query(`
      UPDATE user_sessions 
      SET is_active = FALSE 
      WHERE user_id = $1
    `, [userId]);

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again on other devices.'
    });
  })
);

export default router;