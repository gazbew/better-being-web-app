import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../config/db.js';
import { AppError } from '../middleware/error-handler.js';
import { users, userSessions } from '../config/schema.js';
import { eq, and, gt, lt, desc } from 'drizzle-orm';

class AuthService {

  // Create user session
  async createSession(userId, deviceInfo = {}) {
    const sessionToken = this.generateSessionToken();
    const refreshToken = this.generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await db
      .insert(userSessions)
      .values({
        userId,
        sessionToken,
        refreshToken,
        deviceInfo,
        ipAddress: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        expiresAt,
        lastActivity: new Date()
      })
      .returning({
        id: userSessions.id,
        sessionToken: userSessions.sessionToken,
        refreshToken: userSessions.refreshToken,
        expiresAt: userSessions.expiresAt
      });

    return session[0];
  }

  // Generate secure session token
  generateSessionToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  // Generate secure refresh token
  generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  // Generate secure JWT tokens
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  // Generate email verification token
  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate password reset token
  generatePasswordResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash password with bcrypt
  async hashPassword(password) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return bcrypt.hash(password, rounds);
  }

  // Compare password with hash
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Register new user
  async registerUser(userData, deviceInfo = {}) {
    const { email, password, firstName, lastName, marketingConsent = false } = userData;

    // Input validation
    if (!email || !password || !firstName || !lastName) {
      throw new AppError('All fields are required', 400, 'MISSING_FIELDS');
    }

    if (!this.validateEmail(email)) {
      throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new AppError('Password does not meet requirements', 400, 'WEAK_PASSWORD', {
        errors: passwordValidation.errors
      });
    }

    try {
      // Check if user already exists
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);

      if (existingUser.length > 0) {
        throw new AppError('User already exists with this email', 409, 'USER_EXISTS');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Generate email verification token
      const emailVerificationToken = this.generateVerificationToken();

      // Insert new user
      const newUser = await db
        .insert(users)
        .values({
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emailVerificationToken,
          marketingConsent,
        })
        .returning({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          createdAt: users.createdAt,
          emailVerified: users.emailVerified
        });

      const user = newUser[0];

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user.id);

      // Create user session
      const session = await this.createSession(user.id, deviceInfo);

      // Return user data (excluding sensitive information)
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt
        },
        tokens: {
          accessToken,
          refreshToken,
          sessionToken: session.sessionToken
        },
        emailVerificationToken // This should be sent via email in production
      };

    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Login user
  async loginUser(email, password, deviceInfo = {}) {
    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'MISSING_CREDENTIALS');
    }

    if (!this.validateEmail(email)) {
      throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    try {
      // Get user with login attempt tracking
      const userResult = await db
        .select({
          id: users.id,
          email: users.email,
          password: users.password,
          firstName: users.firstName,
          lastName: users.lastName,
          emailVerified: users.emailVerified,
          loginAttempts: users.loginAttempts,
          lockedUntil: users.lockedUntil,
          twoFactorEnabled: users.twoFactorEnabled,
          twoFactorSecret: users.twoFactorSecret
        })
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);

      if (userResult.length === 0) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      const user = userResult[0];

      // Check if account is locked
      if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
        const lockTime = Math.ceil((new Date(user.lockedUntil) - new Date()) / (1000 * 60));
        throw new AppError(
          `Account is locked. Try again in ${lockTime} minutes`,
          423,
          'ACCOUNT_LOCKED',
          { unlockTime: user.lockedUntil }
        );
      }

      // Verify password
      const isValidPassword = await this.comparePassword(password, user.password);

      if (!isValidPassword) {
        // Increment failed login attempts
        const newAttempts = (user.loginAttempts || 0) + 1;
        const lockUntil = newAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // 30 min lock

        await db
          .update(users)
          .set({
            loginAttempts: newAttempts,
            lockedUntil: lockUntil
          })
          .where(eq(users.id, user.id));

        if (lockUntil) {
          throw new AppError(
            'Too many failed attempts. Account locked for 30 minutes',
            423,
            'ACCOUNT_LOCKED'
          );
        }

        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      // Reset login attempts on successful login
      await db
        .update(users)
        .set({
          loginAttempts: 0,
          lockedUntil: null,
          lastLogin: new Date()
        })
        .where(eq(users.id, user.id));

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user.id);

      // Create user session
      const session = await this.createSession(user.id, deviceInfo);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled
        },
        tokens: {
          accessToken,
          refreshToken,
          sessionToken: session.sessionToken
        },
        requiresEmailVerification: !user.emailVerified
      };

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Verify email address
  async verifyEmail(token) {
    const userResult = await db
      .update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        updatedAt: new Date()
      })
      .where(eq(users.emailVerificationToken, token))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        emailVerified: users.emailVerified
      });

    if (userResult.length === 0) {
      throw new AppError('Invalid or expired verification token', 400, 'INVALID_TOKEN');
    }

    return {
      user: {
        id: userResult[0].id,
        email: userResult[0].email,
        firstName: userResult[0].firstName,
        lastName: userResult[0].lastName,
        emailVerified: userResult[0].emailVerified
      }
    };
  }

  // Request password reset
  async requestPasswordReset(email) {
    if (!this.validateEmail(email)) {
      throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    const resetToken = this.generatePasswordResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const result = await db
      .update(users)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
        updatedAt: new Date()
      })
      .where(eq(users.email, email.toLowerCase()))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName
      });

    if (result.length === 0) {
      // Don't reveal if email exists for security
      return { message: 'If this email exists, a reset link has been sent' };
    }

    return {
      user: result[0],
      resetToken, // This should be sent via email in production
      message: 'Password reset link sent to your email'
    };
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    const passwordValidation = this.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new AppError('Password does not meet requirements', 400, 'WEAK_PASSWORD', {
        errors: passwordValidation.errors
      });
    }

    const hashedPassword = await this.hashPassword(newPassword);

    const result = await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        loginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(users.passwordResetToken, token),
          gt(users.passwordResetExpires, new Date())
        )
      )
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName
      });

    if (result.length === 0) {
      throw new AppError('Invalid or expired reset token', 400, 'INVALID_TOKEN');
    }

    // Invalidate all user sessions for security
    await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.userId, result[0].id));

    return {
      user: result[0],
      message: 'Password has been reset successfully. Please login again on all devices.'
    };
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      // Verify JWT refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find active session with this refresh token
      const sessionResult = await db
        .select({
          id: userSessions.id,
          userId: userSessions.userId,
          isActive: userSessions.isActive,
          expiresAt: userSessions.expiresAt
        })
        .from(userSessions)
        .where(
          and(
            eq(userSessions.refreshToken, refreshToken),
            eq(userSessions.isActive, true)
          )
        )
        .limit(1);

      if (sessionResult.length === 0) {
        throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
      }

      const session = sessionResult[0];

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        // Deactivate expired session
        await db
          .update(userSessions)
          .set({ isActive: false })
          .where(eq(userSessions.id, session.id));

        throw new AppError('Session expired', 401, 'SESSION_EXPIRED');
      }

      // Verify user still exists
      const userResult = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName
        })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);

      if (userResult.length === 0) {
        throw new AppError('User not found', 401, 'USER_NOT_FOUND');
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(userResult[0].id);

      // Update session with new refresh token and activity
      await db
        .update(userSessions)
        .set({
          refreshToken: newRefreshToken,
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Extend by 7 days
        })
        .where(eq(userSessions.id, session.id));

      return {
        user: userResult[0],
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }
  }

  // Logout user (invalidate refresh token)
  async logout(refreshToken) {
    try {
      // Find and deactivate the session
      const result = await db
        .update(userSessions)
        .set({
          isActive: false,
          lastActivity: new Date()
        })
        .where(eq(userSessions.refreshToken, refreshToken))
        .returning({ id: userSessions.id });

      if (result.length === 0) {
        // Token might already be invalid, but we'll still return success
        console.log('Refresh token not found or already invalidated');
      }

      return { message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      // Still return success to avoid revealing information
      return { message: 'Logged out successfully' };
    }
  }

  // Logout from all devices
  async logoutAll(userId) {
    try {
      // Deactivate all active sessions for this user
      await db
        .update(userSessions)
        .set({
          isActive: false,
          lastActivity: new Date()
        })
        .where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.isActive, true)
          )
        );

      return { message: 'Logged out from all devices successfully' };
    } catch (error) {
      console.error('Logout all error:', error);
      throw new AppError('Failed to logout from all devices', 500, 'LOGOUT_ALL_FAILED');
    }
  }

  // Validate user session
  async validateSession(sessionToken) {
    try {
      const sessionResult = await db
        .select({
          id: userSessions.id,
          userId: userSessions.userId,
          isActive: userSessions.isActive,
          expiresAt: userSessions.expiresAt,
          user: {
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            emailVerified: users.emailVerified,
            twoFactorEnabled: users.twoFactorEnabled
          }
        })
        .from(userSessions)
        .innerJoin(users, eq(userSessions.userId, users.id))
        .where(
          and(
            eq(userSessions.sessionToken, sessionToken),
            eq(userSessions.isActive, true)
          )
        )
        .limit(1);

      if (sessionResult.length === 0) {
        return null;
      }

      const session = sessionResult[0];

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        // Deactivate expired session
        await db
          .update(userSessions)
          .set({ isActive: false })
          .where(eq(userSessions.id, session.id));

        return null;
      }

      // Update last activity
      await db
        .update(userSessions)
        .set({ lastActivity: new Date() })
        .where(eq(userSessions.id, session.id));

      return {
        session: {
          id: session.id,
          userId: session.userId,
          expiresAt: session.expiresAt
        },
        user: session.user
      };

    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  // Get active sessions for user
  async getActiveSessions(userId) {
    try {
      const sessions = await db
        .select({
          id: userSessions.id,
          deviceInfo: userSessions.deviceInfo,
          ipAddress: userSessions.ipAddress,
          userAgent: userSessions.userAgent,
          createdAt: userSessions.createdAt,
          lastActivity: userSessions.lastActivity,
          expiresAt: userSessions.expiresAt
        })
        .from(userSessions)
        .where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.isActive, true)
          )
        )
        .orderBy(desc(userSessions.lastActivity));

      return sessions;
    } catch (error) {
      console.error('Get active sessions error:', error);
      throw new AppError('Failed to get active sessions', 500, 'GET_SESSIONS_FAILED');
    }
  }

  // Clean up expired sessions
  async cleanupExpiredSessions() {
    try {
      const result = await db
        .update(userSessions)
        .set({ isActive: false })
        .where(
          and(
            eq(userSessions.isActive, true),
            lt(userSessions.expiresAt, new Date())
          )
        )
        .returning({ id: userSessions.id });

      return result.length;
    } catch (error) {
      console.error('Cleanup expired sessions error:', error);
      return 0;
    }
  }
}

export default new AuthService();