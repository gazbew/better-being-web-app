import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../config/db.js';
import { AppError } from '../middleware/error-handler.js';
import { users } from '../config/schema.js';
import { eq } from 'drizzle-orm';

class AuthService {
  
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
  async registerUser(userData) {
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
          // Note: marketingConsent field may not exist in schema yet
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

      // TODO: Handle user sessions table when schema is updated
      // For now, we'll skip the session storage and return tokens

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
          refreshToken
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

      // TODO: Handle user sessions table when schema is updated
      // For now, we'll skip the session storage and return tokens

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
          refreshToken
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
    const user = await pool.query(`
      UPDATE users 
      SET email_verified = TRUE, 
          email_verification_token = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE email_verification_token = $1 
      RETURNING id, email, first_name, last_name, email_verified
    `, [token]);

    if (user.rows.length === 0) {
      throw new AppError('Invalid or expired verification token', 400, 'INVALID_TOKEN');
    }

    return {
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        firstName: user.rows[0].first_name,
        lastName: user.rows[0].last_name,
        emailVerified: user.rows[0].email_verified
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

    const result = await pool.query(`
      UPDATE users 
      SET password_reset_token = $1, 
          password_reset_expires = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = $3 
      RETURNING id, email, first_name
    `, [resetToken, resetExpires, email.toLowerCase()]);

    if (result.rows.length === 0) {
      // Don't reveal if email exists for security
      return { message: 'If this email exists, a reset link has been sent' };
    }

    return {
      user: result.rows[0],
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

    const result = await pool.query(`
      UPDATE users 
      SET password = $1, 
          password_reset_token = NULL, 
          password_reset_expires = NULL,
          login_attempts = 0,
          locked_until = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE password_reset_token = $2 
        AND password_reset_expires > CURRENT_TIMESTAMP
      RETURNING id, email, first_name, last_name
    `, [hashedPassword, token]);

    if (result.rows.length === 0) {
      throw new AppError('Invalid or expired reset token', 400, 'INVALID_TOKEN');
    }

    // Invalidate all user sessions for security
    await pool.query(`
      UPDATE user_sessions 
      SET is_active = FALSE 
      WHERE user_id = $1
    `, [result.rows[0].id]);

    return {
      user: result.rows[0],
      message: 'Password has been reset successfully'
    };
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    const session = await pool.query(`
      SELECT us.*, u.id as user_id, u.email, u.first_name, u.last_name 
      FROM user_sessions us 
      JOIN users u ON us.user_id = u.id 
      WHERE us.refresh_token = $1 
        AND us.is_active = true 
        AND us.expires_at > CURRENT_TIMESTAMP
    `, [refreshToken]);

    if (session.rows.length === 0) {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(session.rows[0].user_id);

    // Update refresh token and last used time
    await pool.query(`
      UPDATE user_sessions 
      SET refresh_token = $1, 
          last_used_at = CURRENT_TIMESTAMP,
          expires_at = $2
      WHERE id = $3
    `, [
      newRefreshToken,
      new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
      session.rows[0].id
    ]);

    return {
      user: {
        id: session.rows[0].user_id,
        email: session.rows[0].email,
        firstName: session.rows[0].first_name,
        lastName: session.rows[0].last_name
      },
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    };
  }

  // Logout user (invalidate refresh token)
  async logout(refreshToken) {
    await pool.query(`
      UPDATE user_sessions 
      SET is_active = FALSE 
      WHERE refresh_token = $1
    `, [refreshToken]);

    return { message: 'Logged out successfully' };
  }

  // Logout from all devices
  async logoutAll(userId) {
    await pool.query(`
      UPDATE user_sessions 
      SET is_active = FALSE 
      WHERE user_id = $1
    `, [userId]);

    return { message: 'Logged out from all devices successfully' };
  }
}

export default new AuthService();