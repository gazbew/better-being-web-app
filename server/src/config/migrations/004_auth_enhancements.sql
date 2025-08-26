-- Authentication Enhancements Migration
-- Adds missing authentication fields to users table and creates user_sessions table

-- Add missing authentication fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP,
ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255),
ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS date_of_birth TIMESTAMP,
ADD COLUMN IF NOT EXISTS gender VARCHAR(20);

-- Rename first_name and last_name to match schema.js camelCase convention
-- Note: These columns already exist but we need to ensure they match the schema
-- ALTER TABLE users RENAME COLUMN first_name TO firstName;  -- This would break existing data
-- ALTER TABLE users RENAME COLUMN last_name TO lastName;   -- This would break existing data

-- Create user_sessions table for proper session management
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  refresh_token VARCHAR(255) NOT NULL UNIQUE,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_users_locked_until ON users(locked_until);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token ON user_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);

-- Add comments for documentation
COMMENT ON COLUMN users.email_verified IS 'Whether the user has verified their email address';
COMMENT ON COLUMN users.email_verification_token IS 'Token for email verification process';
COMMENT ON COLUMN users.password_reset_token IS 'Token for password reset process';
COMMENT ON COLUMN users.password_reset_expires IS 'Expiration time for password reset token';
COMMENT ON COLUMN users.login_attempts IS 'Number of failed login attempts';
COMMENT ON COLUMN users.locked_until IS 'Time until account is locked due to failed attempts';
COMMENT ON COLUMN users.two_factor_enabled IS 'Whether 2FA is enabled for this user';
COMMENT ON COLUMN users.two_factor_secret IS 'Secret key for 2FA';
COMMENT ON COLUMN user_sessions.session_token IS 'JWT session token';
COMMENT ON COLUMN user_sessions.refresh_token IS 'JWT refresh token';
COMMENT ON COLUMN user_sessions.device_info IS 'Information about the device/browser used';
COMMENT ON COLUMN user_sessions.is_active IS 'Whether this session is still active';