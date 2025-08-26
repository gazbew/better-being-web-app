import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function createUserSessionsTable() {
  try {
    console.log('🔧 Creating user_sessions table...');

    const sql = neon(process.env.DATABASE_URL);

    // Create user_sessions table
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
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token ON user_sessions(refresh_token);`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);`);

    console.log('✅ user_sessions table created successfully!');

  } catch (error) {
    console.error('❌ Failed to create table:', error.message);
    process.exit(1);
  }
}

createUserSessionsTable();