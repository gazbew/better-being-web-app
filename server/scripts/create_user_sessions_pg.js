import 'dotenv/config';
import pool from '../src/config/database.js';

async function main() {
  try {
    console.log('🔧 Creating user_sessions table via pg...');

    await pool.query(`
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

    const indexStatements = [
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);',
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token ON user_sessions(refresh_token);',
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);',
      'CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);'
    ];

    for (const stmt of indexStatements) {
      await pool.query(stmt);
    }

    console.log('✅ user_sessions table and indexes ensured.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create user_sessions:', err.message);
    process.exit(1);
  }
}

main();

