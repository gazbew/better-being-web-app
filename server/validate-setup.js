#!/usr/bin/env node

import pool from './src/config/database.js';

console.log('🔍 Validating Better Being Development Environment...\n');

async function validateEnvironment() {
  let allChecks = true;

  // Database Connection Test
  try {
    console.log('📊 Testing database connection...');
    const result = await pool.query('SELECT NOW(), version()');
    console.log('✅ Database connected successfully');
    console.log(`   📅 Server time: ${result.rows[0].now}`);
    console.log(`   🗂️  PostgreSQL: ${result.rows[0].version.split(' ')[0]}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    allChecks = false;
  }

  // Check critical tables
  const criticalTables = [
    'users', 'categories', 'products', 'cart', 'orders',
    'user_sessions', 'user_addresses', 'payment_methods', 'payment_transactions'
  ];

  console.log('\n📋 Checking database tables...');
  for (const table of criticalTables) {
    try {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        )
      `, [table]);

      if (result.rows[0].exists) {
        console.log(`✅ Table '${table}' exists`);
      } else {
        console.log(`❌ Table '${table}' missing`);
        allChecks = false;
      }
    } catch (error) {
      console.error(`❌ Error checking table '${table}':`, error.message);
      allChecks = false;
    }
  }

  // Check environment variables
  console.log('\n🔐 Checking environment variables...');
  const requiredEnvVars = [
    'DATABASE_URL', 'JWT_SECRET', 'NODE_ENV', 'PORT'
  ];

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} is set`);
    } else {
      console.log(`❌ ${envVar} is missing`);
      allChecks = false;
    }
  }

  // Check data seeding
  console.log('\n🌱 Checking data...');
  try {
    const categoryCount = await pool.query('SELECT COUNT(*) FROM categories');
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    
    console.log(`✅ Categories: ${categoryCount.rows[0].count}`);
    console.log(`✅ Products: ${productCount.rows[0].count}`);
  } catch (error) {
    console.error('❌ Error checking data:', error.message);
    allChecks = false;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allChecks) {
    console.log('🎉 Environment validation PASSED!');
    console.log('✅ Ready for development');
  } else {
    console.log('⚠️  Environment validation FAILED!');
    console.log('❌ Please fix the issues above');
  }
  console.log('='.repeat(50));

  await pool.end();
  process.exit(allChecks ? 0 : 1);
}

validateEnvironment().catch(error => {
  console.error('❌ Validation error:', error);
  process.exit(1);
});