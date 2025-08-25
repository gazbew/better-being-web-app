-- Reviews Tables
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  pros JSONB DEFAULT '[]',
  cons JSONB DEFAULT '[]',
  would_recommend BOOLEAN DEFAULT true,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS review_images (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_votes (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

CREATE TABLE IF NOT EXISTS review_reports (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL,
  details TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Add review-related columns to products table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'rating') THEN
    ALTER TABLE products ADD COLUMN rating DECIMAL(3,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'review_count') THEN
    ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Recommendations Tables
CREATE TABLE IF NOT EXISTS recommendation_impressions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendation_clicks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50),
  position INTEGER,
  clicked_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendation_conversions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50),
  order_id INTEGER REFERENCES orders(id),
  converted_at TIMESTAMP DEFAULT NOW()
);

-- Add columns to products table for recommendations if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'tags') THEN
    ALTER TABLE products ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'subcategory_id') THEN
    ALTER TABLE products ADD COLUMN subcategory_id INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'weight') THEN
    ALTER TABLE products ADD COLUMN weight DECIMAL(10,2) DEFAULT 0;
  END IF;
END $$;

-- Loyalty Program Tables
CREATE TABLE IF NOT EXISTS loyalty_points (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'earned', 'redeemed', 'expired', 'transferred'
  points INTEGER NOT NULL,
  description TEXT,
  order_id INTEGER REFERENCES orders(id),
  redemption_id INTEGER,
  expires_at TIMESTAMP,
  redeemed_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_reward_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES loyalty_reward_categories(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'discount', 'product', 'shipping'
  points_required INTEGER NOT NULL,
  discount_type VARCHAR(50), -- 'percentage', 'fixed'
  discount_value DECIMAL(10,2),
  stock INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_redemptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reward_id INTEGER REFERENCES loyalty_rewards(id),
  points_spent INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  reward_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loyalty_transfers (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(50) NOT NULL, -- 'percentage', 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  description TEXT,
  minimum_purchase DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id), -- For user-specific codes
  expires_at TIMESTAMP,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stock Reservations Table for checkout
CREATE TABLE IF NOT EXISTS stock_reservations (
  id SERIAL PRIMARY KEY,
  reservation_id VARCHAR(100) NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_reservation_id (reservation_id),
  INDEX idx_expires_at (expires_at)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_type ON loyalty_points(type);
CREATE INDEX IF NOT EXISTS idx_recommendation_impressions_user_id ON recommendation_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_clicks_user_id ON recommendation_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_user_id ON promo_codes(user_id);

-- Insert sample loyalty reward categories
INSERT INTO loyalty_reward_categories (name, slug, description) VALUES
  ('Discounts', 'discounts', 'Save on your next purchase'),
  ('Free Products', 'products', 'Get free products with your points'),
  ('Shipping', 'shipping', 'Free or discounted shipping'),
  ('Exclusive Access', 'exclusive', 'Access to exclusive products and sales')
ON CONFLICT DO NOTHING;

-- Insert sample loyalty rewards
INSERT INTO loyalty_rewards (category_id, name, description, type, points_required, discount_type, discount_value) VALUES
  (1, 'R50 Off Voucher', 'Get R50 off your next purchase over R500', 'discount', 500, 'fixed', 50),
  (1, '10% Off Coupon', 'Get 10% off your entire order', 'discount', 300, 'percentage', 10),
  (1, '15% Off Coupon', 'Get 15% off your entire order', 'discount', 750, 'percentage', 15),
  (3, 'Free Standard Shipping', 'Free standard shipping on your next order', 'shipping', 200, 'percentage', 100),
  (3, 'Free Express Shipping', 'Free express shipping on your next order', 'shipping', 400, 'percentage', 100)
ON CONFLICT DO NOTHING;

-- Insert sample promo codes
INSERT INTO promo_codes (code, discount_type, discount_value, description, minimum_purchase, usage_limit) VALUES
  ('WELLNESS10', 'percentage', 10, '10% off your order', 100, NULL),
  ('FIRST15', 'percentage', 15, '15% off for first-time customers', 200, 1),
  ('SAVE50', 'fixed', 50, 'R50 off orders over R500', 500, 100)
ON CONFLICT DO NOTHING;
