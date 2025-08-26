import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...');

    const sql = neon(process.env.DATABASE_URL);

    // Check if user_sessions table exists
    const result = await sql.unsafe(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('Tables in database:', Array.isArray(result) ? result.map(row => row.table_name) : result);

    // Check user_sessions table specifically
    const tables = Array.isArray(result) ? result : [result];
    const userSessionsExists = tables.some(row => row.table_name === 'user_sessions');
    console.log('user_sessions table exists:', userSessionsExists);

    if (userSessionsExists) {
      console.log('✅ user_sessions table is ready for authentication');
    } else {
      console.log('❌ user_sessions table is missing - need to create it');
    }

  } catch (error) {
    console.error('❌ Check failed:', error.message);
    process.exit(1);
  }
}

checkTables();