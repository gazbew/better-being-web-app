import express from 'express';
import { db } from '../config/db.js';
import { users } from '../config/schema.js';
import { eq } from 'drizzle-orm';
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
    const deviceInfo = getDeviceInfo(req);

    const result = await AuthService.registerUser({
      email,
      password,
      firstName,
      lastName,
      marketingConsent
    }, deviceInfo);

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
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        dateOfBirth: users.dateOfBirth,
        gender: users.gender,
        marketingConsent: users.marketingConsent,
        emailVerified: users.emailVerified,
        twoFactorEnabled: users.twoFactorEnabled,
        profileImageUrl: users.profileImageUrl,
        createdAt: users.createdAt,
        lastLogin: users.lastLogin
      })
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        marketingConsent: user.marketingConsent,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
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

    // Build update data dynamically
    const updateData = {
      updatedAt: new Date()
    };

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (marketingConsent !== undefined) updateData.marketingConsent = marketingConsent;

    if (Object.keys(updateData).length === 1) { // Only updatedAt
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        dateOfBirth: users.dateOfBirth,
        gender: users.gender,
        marketingConsent: users.marketingConsent,
        updatedAt: users.updatedAt
      });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: result[0].id,
        email: result[0].email,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        phone: result[0].phone,
        dateOfBirth: result[0].dateOfBirth,
        gender: result[0].gender,
        marketingConsent: result[0].marketingConsent,
        updatedAt: result[0].updatedAt
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
    const userResult = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await AuthService.comparePassword(
      currentPassword,
      userResult[0].password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await AuthService.hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // TODO: Invalidate all other sessions for security when user_sessions table is added
    // await db.update(userSessions).set({ isActive: false }).where(eq(userSessions.userId, userId));

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again on other devices.'
    });
  })
);

export default router;