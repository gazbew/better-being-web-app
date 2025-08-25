-- Orders table enhancement
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50) UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- Shipping addresses table
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'South Africa',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stock reservations table for checkout
CREATE TABLE IF NOT EXISTS stock_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id VARCHAR(100) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_reservation_id (reservation_id),
  INDEX idx_expires_at (expires_at)
);

-- Order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  transaction_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  status VARCHAR(50) NOT NULL,
  gateway VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', etc.
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customer payment methods (saved cards)
CREATE TABLE IF NOT EXISTS customer_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_method_id VARCHAR(255),
  type VARCHAR(50), -- 'card', 'bank_account', etc.
  brand VARCHAR(50), -- 'visa', 'mastercard', etc.
  last4 VARCHAR(4),
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Abandoned carts table for recovery
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  cart_data JSONB NOT NULL,
  total_amount DECIMAL(10,2),
  recovery_email_sent BOOLEAN DEFAULT false,
  recovered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoice table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'unpaid',
  pdf_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shipping zones for dynamic pricing
CREATE TABLE IF NOT EXISTS shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  provinces TEXT[], -- Array of provinces
  base_rate DECIMAL(10,2) NOT NULL,
  per_kg_rate DECIMAL(10,2) DEFAULT 0,
  express_multiplier DECIMAL(3,2) DEFAULT 2.0,
  overnight_multiplier DECIMAL(3,2) DEFAULT 3.0,
  free_shipping_threshold DECIMAL(10,2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default shipping zones for South Africa
INSERT INTO shipping_zones (name, provinces, base_rate, per_kg_rate, free_shipping_threshold) VALUES
('Major Cities', ARRAY['Western Cape', 'Gauteng', 'KwaZulu-Natal'], 50, 5, 500),
('Secondary Cities', ARRAY['Eastern Cape', 'Free State', 'Mpumalanga'], 75, 7.5, 750),
('Remote Areas', ARRAY['Northern Cape', 'Limpopo', 'North West'], 100, 10, 1000)
ON CONFLICT DO NOTHING;

-- Insert sample promo codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, minimum_order_amount, active) VALUES
('WELLNESS10', 'New Customer Discount - 10% OFF', 'percentage', 10, 0, true),
('SAVE50', 'Save R50 on orders over R500', 'fixed', 50, 500, true),
('SUMMER2025', 'Summer Sale - 15% OFF', 'percentage', 15, 0, true),
('FREESHIP', 'Free Shipping', 'fixed', 0, 0, true)
ON CONFLICT (code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
DECLARE
  order_num VARCHAR;
BEGIN
  order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
               LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- Function to clean up expired stock reservations
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS void AS $$
BEGIN
  -- Return stock from expired reservations
  UPDATE products p
  SET stock_quantity = stock_quantity + sr.quantity
  FROM stock_reservations sr
  WHERE p.id = sr.product_id
    AND sr.expires_at < NOW();
  
  -- Delete expired reservations
  DELETE FROM stock_reservations
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a periodic job to clean up reservations (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-reservations', '*/5 * * * *', 'SELECT cleanup_expired_reservations();');
