import pool from './database.js';

async function runSafeMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting safe database migration...');
    
    // Helper function to check if table exists
    async function tableExists(tableName) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [tableName]);
      return result.rows[0].exists;
    }
    
    // Helper function to check if column exists
    async function columnExists(tableName, columnName) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = $1 
          AND column_name = $2
        );
      `, [tableName, columnName]);
      return result.rows[0].exists;
    }
    
    // Enhance users table with authentication features
    console.log('👤 Enhancing users table...');
    
    const userColumns = [
      { name: 'email_verified', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'email_verification_token', type: 'VARCHAR(255)' },
      { name: 'password_reset_token', type: 'VARCHAR(255)' },
      { name: 'password_reset_expires', type: 'TIMESTAMP' },
      { name: 'two_factor_enabled', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'two_factor_secret', type: 'VARCHAR(255)' },
      { name: 'backup_codes', type: 'TEXT[]' },
      { name: 'last_login', type: 'TIMESTAMP' },
      { name: 'login_attempts', type: 'INTEGER DEFAULT 0' },
      { name: 'locked_until', type: 'TIMESTAMP' },
      { name: 'profile_image_url', type: 'VARCHAR(500)' },
      { name: 'date_of_birth', type: 'DATE' },
      { name: 'gender', type: 'VARCHAR(20)' },
      { name: 'marketing_consent', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'preferences', type: 'JSONB DEFAULT \'{}\''}
    ];
    
    for (const column of userColumns) {
      if (!(await columnExists('users', column.name))) {
        await client.query(`ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`);
        console.log(`  ✅ Added column users.${column.name}`);
      } else {
        console.log(`  ⏭️  Column users.${column.name} already exists`);
      }
    }
    
    // Create user_sessions table
    console.log('🔐 Creating user_sessions table...');
    if (!(await tableExists('user_sessions'))) {
      await client.query(`
        CREATE TABLE user_sessions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          refresh_token VARCHAR(500) UNIQUE NOT NULL,
          device_info JSONB,
          ip_address INET,
          user_agent TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('  ✅ Created user_sessions table');
    } else {
      console.log('  ⏭️  user_sessions table already exists');
    }
    
    // Create user_addresses table
    console.log('🏠 Creating user_addresses table...');
    if (!(await tableExists('user_addresses'))) {
      await client.query(`
        CREATE TABLE user_addresses (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(20) CHECK (type IN ('shipping', 'billing')) NOT NULL,
          is_default BOOLEAN DEFAULT FALSE,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          company VARCHAR(200),
          address_line_1 VARCHAR(255) NOT NULL,
          address_line_2 VARCHAR(255),
          city VARCHAR(100) NOT NULL,
          province VARCHAR(100) NOT NULL,
          postal_code VARCHAR(20) NOT NULL,
          country VARCHAR(2) DEFAULT 'ZA',
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('  ✅ Created user_addresses table');
    } else {
      console.log('  ⏭️  user_addresses table already exists');
    }
    
    // Create guest_sessions table
    console.log('👤 Creating guest_sessions table...');
    if (!(await tableExists('guest_sessions'))) {
      await client.query(`
        CREATE TABLE guest_sessions (
          id SERIAL PRIMARY KEY,
          session_token VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP NOT NULL,
          cart_data JSONB DEFAULT '[]'
        )
      `);
      console.log('  ✅ Created guest_sessions table');
    } else {
      console.log('  ⏭️  guest_sessions table already exists');
    }
    
    // Create payment_methods table
    console.log('💳 Creating payment_methods table...');
    if (!(await tableExists('payment_methods'))) {
      await client.query(`
        CREATE TABLE payment_methods (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          provider VARCHAR(50) NOT NULL,
          provider_payment_method_id VARCHAR(255),
          last_four VARCHAR(4),
          brand VARCHAR(50),
          is_default BOOLEAN DEFAULT FALSE,
          expires_month INTEGER,
          expires_year INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('  ✅ Created payment_methods table');
    } else {
      console.log('  ⏭️  payment_methods table already exists');
    }
    
    // Create payment_transactions table
    console.log('💰 Creating payment_transactions table...');
    if (!(await tableExists('payment_transactions'))) {
      await client.query(`
        CREATE TABLE payment_transactions (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          payment_method_id INTEGER REFERENCES payment_methods(id),
          transaction_id VARCHAR(255) UNIQUE NOT NULL,
          provider VARCHAR(50) NOT NULL,
          type VARCHAR(50) NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'ZAR',
          status VARCHAR(50) NOT NULL,
          gateway_response JSONB,
          processed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('  ✅ Created payment_transactions table');
    } else {
      console.log('  ⏭️  payment_transactions table already exists');
    }
    
    // Enhance orders table
    console.log('📦 Enhancing orders table...');
    const orderColumns = [
      { name: 'payment_method_id', type: 'INTEGER REFERENCES payment_methods(id)' },
      { name: 'payment_status', type: 'VARCHAR(50) DEFAULT \'pending\'' },
      { name: 'payment_intent_id', type: 'VARCHAR(255)' },
      { name: 'tracking_number', type: 'VARCHAR(100)' },
      { name: 'estimated_delivery', type: 'DATE' },
      { name: 'delivered_at', type: 'TIMESTAMP' },
      { name: 'notes', type: 'TEXT' },
      { name: 'discount_amount', type: 'DECIMAL(10, 2) DEFAULT 0' },
      { name: 'discount_code', type: 'VARCHAR(50)' }
    ];
    
    for (const column of orderColumns) {
      if (!(await columnExists('orders', column.name))) {
        await client.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
        console.log(`  ✅ Added column orders.${column.name}`);
      } else {
        console.log(`  ⏭️  Column orders.${column.name} already exists`);
      }
    }
    
    // Create error_logs table for monitoring
    console.log('🐛 Creating error_logs table...');
    if (!(await tableExists('error_logs'))) {
      await client.query(`
        CREATE TABLE error_logs (
          id SERIAL PRIMARY KEY,
          error_type VARCHAR(100) NOT NULL,
          error_message TEXT NOT NULL,
          stack_trace TEXT,
          user_id INTEGER REFERENCES users(id),
          request_path VARCHAR(500),
          request_method VARCHAR(10),
          ip_address INET,
          user_agent TEXT,
          metadata JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('  ✅ Created error_logs table');
    } else {
      console.log('  ⏭️  error_logs table already exists');
    }
    
    // Create audit_logs table
    console.log('📋 Creating audit_logs table...');
    if (!(await tableExists('audit_logs'))) {
      await client.query(`
        CREATE TABLE audit_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          action VARCHAR(100) NOT NULL,
          resource_type VARCHAR(50),
          resource_id INTEGER,
          old_values JSONB,
          new_values JSONB,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('  ✅ Created audit_logs table');
    } else {
      console.log('  ⏭️  audit_logs table already exists');
    }
    
    // Create essential indexes (safely)
    console.log('📊 Creating indexes...');
    const indexes = [
      { table: 'user_sessions', column: 'user_id', name: 'idx_user_sessions_user' },
      { table: 'user_sessions', column: 'refresh_token', name: 'idx_user_sessions_refresh_token' },
      { table: 'user_addresses', column: 'user_id', name: 'idx_user_addresses_user' },
      { table: 'payment_methods', column: 'user_id', name: 'idx_payment_methods_user' },
      { table: 'payment_transactions', column: 'order_id', name: 'idx_payment_transactions_order' },
      { table: 'error_logs', column: 'created_at', name: 'idx_error_logs_created_at' },
      { table: 'audit_logs', column: 'user_id', name: 'idx_audit_logs_user' }
    ];
    
    for (const index of indexes) {
      try {
        await client.query(`CREATE INDEX IF NOT EXISTS ${index.name} ON ${index.table}(${index.column})`);
        console.log(`  ✅ Created index ${index.name}`);
      } catch (error) {
        if (error.code !== '42P07') { // Index already exists
          console.log(`  ⚠️  Index ${index.name}: ${error.message}`);
        } else {
          console.log(`  ⏭️  Index ${index.name} already exists`);
        }
      }
    }
    
    // Seed categories if empty
    const categoryCount = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoryCount.rows[0].count) === 0) {
      console.log('🌱 Seeding categories...');
      await client.query(`
        INSERT INTO categories (name, slug, description, icon) VALUES
        ('Supplements', 'supplements', 'Nutritional supplements for optimal health', 'pill'),
        ('Wellness', 'wellness', 'Products for overall wellness and vitality', 'heart'),
        ('Immunity', 'immunity', 'Boost your immune system naturally', 'shield'),
        ('Digestive Health', 'digestive-health', 'Support digestive wellness', 'stomach'),
        ('Sleep & Relaxation', 'sleep-relaxation', 'Products for better sleep and relaxation', 'moon'),
        ('Energy & Vitality', 'energy-vitality', 'Natural energy and vitality boosters', 'lightning'),
        ('Beauty & Skin', 'beauty-skin', 'Natural beauty and skincare products', 'sparkles'),
        ('Fitness & Recovery', 'fitness-recovery', 'Support your fitness journey', 'dumbbell'),
        ('Mental Clarity', 'mental-clarity', 'Enhance focus and cognitive function', 'brain'),
        ('Detox & Cleanse', 'detox-cleanse', 'Cleanse and detoxify naturally', 'leaf')
      `);
      console.log('  ✅ Added 10 product categories');
    } else {
      console.log(`  ⏭️  Categories already exist (${categoryCount.rows[0].count} found)`);
    }
    
    console.log('🎉 Safe migration completed successfully!');
    
    // Final verification
    const tables = [
      'users', 'user_sessions', 'user_addresses', 'categories', 'products', 
      'cart', 'orders', 'payment_methods', 'payment_transactions',
      'error_logs', 'audit_logs'
    ];
    
    console.log('✅ Database verification:');
    for (const table of tables) {
      const exists = await tableExists(table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSafeMigration()
    .then(() => {
      console.log('✅ Safe migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Safe migration failed:', error);
      process.exit(1);
    });
}

export default runSafeMigration;