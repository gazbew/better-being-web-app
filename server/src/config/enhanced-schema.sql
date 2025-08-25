-- Enhanced Database Schema for Better Being Platform
-- Supports Epic 001 (Authentication), Epic 002 (E-Commerce), Epic 003 (Production)

-- ========================================
-- USER MANAGEMENT & AUTHENTICATION
-- ========================================

-- Enhanced users table with authentication features
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255),
ADD COLUMN IF NOT EXISTS backup_codes TEXT[],
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP,
ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

-- User sessions table for JWT management
CREATE TABLE IF NOT EXISTS user_sessions (
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
);

-- User addresses for shipping and billing
CREATE TABLE IF NOT EXISTS user_addresses (
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
);

-- ========================================
-- ENHANCED E-COMMERCE TABLES
-- ========================================

-- Guest sessions for anonymous carts
CREATE TABLE IF NOT EXISTS guest_sessions (
  id SERIAL PRIMARY KEY,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  cart_data JSONB DEFAULT '[]'
);

-- Enhanced cart table supporting guest sessions
DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  guest_session_id INTEGER REFERENCES guest_sessions(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size VARCHAR(50),
  price_snapshot DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cart_user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_session_id IS NULL) OR 
    (user_id IS NULL AND guest_session_id IS NOT NULL)
  )
);

-- Payment methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'card', 'payfast', 'zapper', 'payjustnow'
  provider VARCHAR(50) NOT NULL,
  provider_payment_method_id VARCHAR(255),
  last_four VARCHAR(4),
  brand VARCHAR(50),
  is_default BOOLEAN DEFAULT FALSE,
  expires_month INTEGER,
  expires_year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method_id INTEGER REFERENCES payment_methods(id),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS estimated_delivery DATE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  payment_method_id INTEGER REFERENCES payment_methods(id),
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'payment', 'refund', 'partial_refund'
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  status VARCHAR(50) NOT NULL,
  gateway_response JSONB,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory tracking
CREATE TABLE IF NOT EXISTS inventory_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(50) NOT NULL, -- 'sale', 'restock', 'adjustment', 'reservation', 'release'
  quantity INTEGER NOT NULL,
  reason VARCHAR(255),
  order_id INTEGER REFERENCES orders(id),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product reviews enhancements
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reported_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Discount codes and coupons
CREATE TABLE IF NOT EXISTS discount_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('percentage', 'fixed_amount')) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  minimum_order_amount DECIMAL(10, 2) DEFAULT 0,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  user_limit INTEGER DEFAULT 1,
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PRODUCTION MONITORING TABLES
-- ========================================

-- Error logging
CREATE TABLE IF NOT EXISTS error_logs (
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
);

-- Audit logs for security and compliance
CREATE TABLE IF NOT EXISTS audit_logs (
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
);

-- API rate limiting
CREATE TABLE IF NOT EXISTS rate_limit_logs (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL, -- IP or user ID
  endpoint VARCHAR(500) NOT NULL,
  requests_count INTEGER DEFAULT 1,
  window_start TIMESTAMP NOT NULL,
  blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email notifications queue
CREATE TABLE IF NOT EXISTS email_queue (
  id SERIAL PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_body TEXT NOT NULL,
  text_body TEXT,
  template_name VARCHAR(100),
  template_data JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  last_attempt TIMESTAMP,
  error_message TEXT,
  scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ========================================

-- Authentication indexes
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token ON user_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user ON user_addresses(user_id);

-- E-commerce indexes
CREATE INDEX IF NOT EXISTS idx_cart_guest_session ON cart(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_cart_product ON cart(product_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);

-- Production monitoring indexes
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_identifier ON rate_limit_logs(identifier);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);

-- ========================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ========================================

-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON user_addresses;
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_updated_at ON cart;
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INITIAL DATA SEEDING
-- ========================================

-- Insert default categories if they don't exist
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
ON CONFLICT (slug) DO NOTHING;

-- Create admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password, first_name, last_name, email_verified) VALUES
('admin@betterbeing.co.za', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewTbCqLUWnlTLpZO', 'System', 'Administrator', true)
ON CONFLICT (email) DO NOTHING;