#!/usr/bin/env node

import pool from './src/config/database.js';

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Database connected successfully!');
    console.log('📅 Current time:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL version:', result.rows[0].postgres_version.split(' ')[0]);
    
    // Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📊 Existing tables:');
    if (tablesResult.rows.length === 0) {
      console.log('   No tables found. You may need to run the schema first.');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    // Check if products table exists and has data
    try {
      const productCount = await pool.query('SELECT COUNT(*) FROM products');
      console.log(`\n🛍️ Current products in database: ${productCount.rows[0].count}`);
    } catch (error) {
      console.log('\n⚠️ Products table not found or empty');
    }
    
    await pool.end();
    console.log('\n🎉 Connection test completed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();