-- Enhanced Orders Schema Migration
-- Adds payment tracking, order status history, and shipping information

-- Add payment and tracking fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS estimated_delivery DATE,
ADD COLUMN IF NOT EXISTS customer_notes TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0;

-- Create order_status_history table for tracking order status changes
CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table for tracking payment attempts and transactions
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  payment_gateway VARCHAR(50) NOT NULL,
  gateway_transaction_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  status VARCHAR(50) DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create shipping_addresses table (normalized from orders JSONB)
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  recipient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  street_address TEXT NOT NULL,
  suburb VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(100) DEFAULT 'South Africa',
  delivery_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create billing_addresses table (normalized from orders JSONB)  
CREATE TABLE IF NOT EXISTS billing_addresses (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  street_address TEXT NOT NULL,
  suburb VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(100) DEFAULT 'South Africa',
  tax_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_order ON shipping_addresses(order_id);
CREATE INDEX IF NOT EXISTS idx_billing_addresses_order ON billing_addresses(order_id);

-- Update order statuses to be more comprehensive
-- Valid order statuses: pending, confirmed, processing, shipped, delivered, cancelled, refunded
COMMENT ON COLUMN orders.status IS 'Order status: pending, confirmed, processing, shipped, delivered, cancelled, refunded';
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, authorized, paid, failed, refunded, partially_refunded';