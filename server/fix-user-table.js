import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function fixUserTable() {
  try {
    console.log('🔍 Checking users table structure...');

    const sql = neon(process.env.DATABASE_URL);

    // Check current columns
    const columns = await sql.unsafe(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log('Current columns:', columns.map ? columns.map(col => col.column_name) : columns);

    // Define the columns we need to add
    const columnsToAdd = [
      { name: 'email_verified', type: 'BOOLEAN DEFAULT false', comment: 'Whether the user has verified their email address' },
      { name: 'email_verification_token', type: 'VARCHAR(255)', comment: 'Token for email verification process' },
      { name: 'password_reset_token', type: 'VARCHAR(255)', comment: 'Token for password reset process' },
      { name: 'password_reset_expires', type: 'TIMESTAMP', comment: 'Expiration time for password reset token' },
      { name: 'login_attempts', type: 'INTEGER DEFAULT 0', comment: 'Number of failed login attempts' },
      { name: 'locked_until', type: 'TIMESTAMP', comment: 'Time until account is locked due to failed attempts' },
      { name: 'last_login', type: 'TIMESTAMP', comment: 'Last login timestamp' },
      { name: 'two_factor_enabled', type: 'BOOLEAN DEFAULT false', comment: 'Whether 2FA is enabled for this user' },
      { name: 'two_factor_secret', type: 'VARCHAR(255)', comment: 'Secret key for 2FA' },
      { name: 'profile_image_url', type: 'VARCHAR(500)', comment: 'URL to user profile image' },
      { name: 'marketing_consent', type: 'BOOLEAN DEFAULT false', comment: 'Whether user has consented to marketing' },
      { name: 'date_of_birth', type: 'TIMESTAMP', comment: 'User date of birth' },
      { name: 'gender', type: 'VARCHAR(20)', comment: 'User gender' },
    ];

    const existingColumns = Array.isArray(columns) ? columns.map(col => col.column_name) : [columns].map(col => col.column_name);

    // Add missing columns
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        console.log(`Adding column: ${column.name}`);
        await sql.unsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};`);
        if (column.comment) {
          await sql.unsafe(`COMMENT ON COLUMN users.${column.name} IS '${column.comment}';`);
        }
      } else {
        console.log(`Column ${column.name} already exists`);
      }
    }

    // Create user_sessions table if it doesn't exist
    console.log('Creating user_sessions table...');
    await sql.unsafe(`
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
    `);

    // Add indexes
    console.log('Adding indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
      'CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);',
      'CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);',
      'CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);',
      'CREATE INDEX IF NOT EXISTS idx_users_locked_until ON users(locked_until);',
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);',
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token ON user_sessions(refresh_token);',
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);',
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);'
    ];

    for (const index of indexes) {
      await sql.unsafe(index);
    }

    console.log('✅ User table fix completed successfully!');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  }
}

fixUserTable();