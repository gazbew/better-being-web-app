import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';

async function applyAuthMigration() {
  try {
    console.log('🚀 Applying authentication migration...');

    const sql = neon(process.env.DATABASE_URL);

    // Read the migration file
    const migrationSQL = fs.readFileSync('./src/config/migrations/004_auth_enhancements.sql', 'utf8');

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        await sql.unsafe(statement);
      }
    }

    console.log('✅ Authentication migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyAuthMigration();