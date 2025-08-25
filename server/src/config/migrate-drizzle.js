import 'dotenv/config';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './db.js';

/**
 * Drizzle ORM Migration Script
 *
 * This script handles database migrations using Drizzle ORM.
 * It uses the schema defined in schema.ts and applies migrations from the migrations folder.
 */

async function runMigrations() {
  try {
    console.log('🚀 Starting Drizzle ORM migrations...');

    // Run migrations
    await migrate(db, { migrationsFolder: './src/config/migrations' });

    console.log('✅ All Drizzle migrations completed successfully!');

  } catch (error) {
    console.error('❌ Drizzle migration failed:', error.message);
    process.exit(1);
  }
}

/**
 * Check database connection health
 */
async function checkDatabaseHealth() {
  try {
    // Test basic connection by querying the database
    await db.execute('SELECT NOW() as current_time');

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

      default:
        console.log(`
Usage: node migrate-drizzle.js [command]

Commands:
  migrate  - Run all pending migrations (default)
  health   - Check database health
        `);
        break;
    }

  } catch (error) {
    console.error('Migration script error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runMigrations, checkDatabaseHealth };