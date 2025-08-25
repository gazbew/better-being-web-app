-- Full-text search optimization migration
-- Adds comprehensive search capabilities with ranking

-- Add search vector column for cached full-text search
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_product_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    coalesce(NEW.name, '') || ' ' || 
    coalesce(NEW.description, '') || ' ' || 
    coalesce(NEW.long_description, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector
DROP TRIGGER IF EXISTS update_product_search_vector_trigger ON products;
CREATE TRIGGER update_product_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- Update existing products with search vectors
UPDATE products SET search_vector = to_tsvector('english', 
  coalesce(name, '') || ' ' || 
  coalesce(description, '') || ' ' || 
  coalesce(long_description, '')
);

-- Create GIN index on search vector for fast full-text search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search_vector_gin ON products USING gin(search_vector);

-- Create function for advanced product search with ranking
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  subcategory_filter TEXT DEFAULT NULL,
  featured_only BOOLEAN DEFAULT FALSE,
  popular_only BOOLEAN DEFAULT FALSE,
  in_stock_only BOOLEAN DEFAULT TRUE,
  price_min DECIMAL DEFAULT NULL,
  price_max DECIMAL DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id INTEGER,
  sku VARCHAR(50),
  name VARCHAR(255),
  slug VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  rating DECIMAL(2,1),
  reviews_count INTEGER,
  category_id INTEGER,
  subcategory_id INTEGER,
  image_url VARCHAR(500),
  is_popular BOOLEAN,
  is_featured BOOLEAN,
  in_stock BOOLEAN,
  stock_count INTEGER,
  category_name VARCHAR(100),
  subcategory_name VARCHAR(100),
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.sku,
    p.name,
    p.slug,
    p.description,
    p.price,
    p.original_price,
    p.rating,
    p.reviews_count,
    p.category_id,
    p.subcategory_id,
    p.image_url,
    p.is_popular,
    p.is_featured,
    p.in_stock,
    p.stock_count,
    c.name as category_name,
    sc.name as subcategory_name,
    ts_rank(p.search_vector, plainto_tsquery('english', search_query)) as search_rank
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
  WHERE 
    (search_query IS NULL OR p.search_vector @@ plainto_tsquery('english', search_query))
    AND (category_filter IS NULL OR c.slug = category_filter)
    AND (subcategory_filter IS NULL OR sc.slug = subcategory_filter)
    AND (NOT featured_only OR p.is_featured = TRUE)
    AND (NOT popular_only OR p.is_popular = TRUE)
    AND (NOT in_stock_only OR p.in_stock = TRUE)
    AND (price_min IS NULL OR p.price >= price_min)
    AND (price_max IS NULL OR p.price <= price_max)
  ORDER BY 
    CASE WHEN search_query IS NOT NULL THEN ts_rank(p.search_vector, plainto_tsquery('english', search_query)) END DESC,
    p.is_featured DESC,
    p.rating DESC,
    p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create function for search suggestions (autocomplete)
CREATE OR REPLACE FUNCTION get_search_suggestions(search_term TEXT, suggestion_limit INTEGER DEFAULT 10)
RETURNS TABLE(suggestion TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT word
  FROM ts_stat('SELECT search_vector FROM products WHERE search_vector @@ plainto_tsquery(''english'', ''' || search_term || ''')')
  WHERE word ILIKE search_term || '%'
  ORDER BY nentry DESC, word
  LIMIT suggestion_limit;
END;
$$ LANGUAGE plpgsql;