-- Performance optimization indexes migration
-- Run with CONCURRENTLY to avoid blocking operations

-- Add session support to cart table for guest users
ALTER TABLE cart ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);

-- Create critical performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured_filtered ON products(is_featured) WHERE is_featured = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_popular_filtered ON products(is_popular) WHERE is_popular = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_in_stock ON products(in_stock) WHERE in_stock = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_reviews_count ON products(reviews_count);

-- Search optimization indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_description_trgm ON products USING gin (description gin_trgm_ops);

-- Full-text search index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search_vector ON products 
USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(long_description, '')));

-- Order performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);

-- Cart performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_user_session ON cart(user_id, session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_session_id ON cart(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_user_id_product ON cart(user_id, product_id);

-- Order items indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Product relationships indexes for JOIN optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_benefits_product_id ON product_benefits(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_ingredients_product_id ON product_ingredients(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);

-- Reviews performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_product_rating ON reviews(product_id, rating);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Categories and subcategories indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_featured ON products(category_id, is_featured) WHERE is_featured = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_popular ON products(category_id, is_popular) WHERE is_popular = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_subcategory_featured ON products(subcategory_id, is_featured) WHERE is_featured = true;

-- Wishlist performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wishlist_user_product ON wishlist(user_id, product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wishlist_user_created ON wishlist(user_id, created_at DESC);

-- Enable trigram extension for better search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Update statistics for better query planning
ANALYZE products;
ANALYZE orders;
ANALYZE cart;
ANALYZE order_items;
ANALYZE categories;
ANALYZE subcategories;