import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Database Migration Script
 * 
 * This script handles database schema migrations for production deployments.
 * It checks for existing tables and only applies necessary migrations.
 */

const MIGRATIONS = [
  {
    version: '001',
    name: 'initial_schema',
    description: 'Create initial database schema',
    sql: 'schema.sql'
  },
  {
    version: '002',
    name: 'performance_indexes',
    description: 'Add performance optimization indexes',
    sql: 'migrations/001_performance_indexes.sql'
  },
  {
    version: '003',
    name: 'full_text_search',
    description: 'Add full-text search capabilities',
    sql: 'migrations/002_full_text_search.sql'
  }
];

/**
 * Create migrations tracking table
 */
async function createMigrationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      version VARCHAR(10) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await pool.query(query);
  console.log('✅ Migrations tracking table ready');
}

/**
 * Check if a migration has been applied
 */
async function isMigrationApplied(version) {
  try {
    const result = await pool.query(
      'SELECT version FROM migrations WHERE version = $1',
      [version]
    );
    return result.rows.length > 0;
  } catch (error) {
    // If migrations table doesn't exist, assume no migrations applied
    return false;
  }
}

/**
 * Record a migration as applied
 */
async function recordMigration(migration) {
  await pool.query(
    'INSERT INTO migrations (version, name, description) VALUES ($1, $2, $3)',
    [migration.version, migration.name, migration.description]
  );
}

/**
 * Apply a single migration
 */
async function applyMigration(migration) {
  try {
    console.log(`🔄 Applying migration ${migration.version}: ${migration.name}`);
    
    // Check if already applied
    if (await isMigrationApplied(migration.version)) {
      console.log(`⏭️ Migration ${migration.version} already applied, skipping`);
      return;
    }
    
    // Read SQL file (tolerant to missing files in local/dev environments)
    const sqlPath = join(__dirname, '..', '..', migration.sql);
    let sql;
    try {
      sql = readFileSync(sqlPath, 'utf8');
    } catch (err) {
      // If SQL file is missing, log a warning and skip this migration.
      console.warn(`⚠️ Migration SQL file not found for ${migration.version} (${sqlPath}). Skipping migration.`);
      return;
    }
    
    // Execute migration in a transaction
    await pool.query('BEGIN');
    
    try {
      // Apply the migration
      await pool.query(sql);
      
      // Record successful migration
      await recordMigration(migration);
      
      await pool.query('COMMIT');
      console.log(`✅ Migration ${migration.version} applied successfully`);
      
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error(`❌ Failed to apply migration ${migration.version}:`, error.message);
    throw error;
  }
}

/**
 * Run all pending migrations
 */
async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...\n');
    
    // Ensure migrations table exists
    await createMigrationsTable();
    
    // Apply each migration in order
    for (const migration of MIGRATIONS) {
      await applyMigration(migration);
    }
    
    console.log('\n✅ All migrations completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

/**
 * Check database connection and basic health
 */
async function checkDatabaseHealth() {
  try {
    // Test basic connection
    await pool.query('SELECT NOW() as current_time');
    
    // Check for critical tables
    const criticalTables = ['users', 'products', 'categories'];
    
    for (const table of criticalTables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [table]);
      
      if (!result.rows[0].exists) {
        throw new Error(`Critical table '${table}' is missing`);
      }
    }
    
    console.log('✅ Database health check passed');
    return true;
    
  } catch (error) {
    console.error('❌ Database health check failed:', error.message);
    return false;
  }
}

/**
 * Main migration function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'migrate';
  
  try {
    switch (command) {
      case 'migrate':
        await runMigrations();
        break;
        
      case 'health':
        const isHealthy = await checkDatabaseHealth();
        process.exit(isHealthy ? 0 : 1);
        break;
        
      case 'status':
        await createMigrationsTable();
        const result = await pool.query(
          'SELECT version, name, applied_at FROM migrations ORDER BY applied_at'
        );
        
        console.log('\n📊 Migration Status:');
        if (result.rows.length === 0) {
          console.log('No migrations applied yet');
        } else {
          result.rows.forEach(row => {
            console.log(`✅ ${row.version}: ${row.name} (applied: ${row.applied_at})`);
          });
        }
        break;
        
      default:
        console.log(`
Usage: node migrate.js [command]

Commands:
  migrate  - Run all pending migrations (default)
  health   - Check database health
  status   - Show migration status
        `);
        break;
    }
    
  } catch (error) {
    console.error('Migration script error:', error);
    process.exit(1);
    
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runMigrations, checkDatabaseHealth };
