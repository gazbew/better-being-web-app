import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database migration...');
    
    // Read and execute the original schema
    const originalSchemaPath = path.join(__dirname, 'schema.sql');
    const originalSchema = fs.readFileSync(originalSchemaPath, 'utf8');
    
    console.log('📊 Applying original schema...');
    await client.query(originalSchema);
    
    // Read and execute the enhanced schema
    const enhancedSchemaPath = path.join(__dirname, 'enhanced-schema.sql');
    const enhancedSchema = fs.readFileSync(enhancedSchemaPath, 'utf8');
    
    console.log('🚀 Applying enhanced schema...');
    await client.query(enhancedSchema);
    
    // Verify critical tables exist
    const verifyTables = [
      'users', 'user_sessions', 'user_addresses',
      'products', 'categories', 'cart', 'orders',
      'payment_methods', 'payment_transactions',
      'error_logs', 'audit_logs', 'email_queue'
    ];
    
    console.log('✅ Verifying table creation...');
    for (const tableName of verifyTables) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [tableName]);
      
      if (result.rows[0].exists) {
        console.log(`  ✅ Table '${tableName}' exists`);
      } else {
        console.error(`  ❌ Table '${tableName}' missing!`);
      }
    }
    
    // Check if we have any categories
    const categoryCount = await client.query('SELECT COUNT(*) FROM categories');
    console.log(`📦 Categories in database: ${categoryCount.rows[0].count}`);
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export default runMigrations;