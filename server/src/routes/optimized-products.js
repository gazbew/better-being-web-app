import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Cache for frequent queries (in-memory, replace with Redis in production)
const queryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache helper functions
const getCacheKey = (query, params) => JSON.stringify({ query, params });
const setCache = (key, data) => queryCache.set(key, { data, timestamp: Date.now() });
const getCache = (key) => {
  const cached = queryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  queryCache.delete(key);
  return null;
};

// Get all products with optimized queries
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      subcategory, 
      featured, 
      popular, 
      search, 
      sort, 
      limit = 20, 
      offset = 0,
      price_min,
      price_max
    } = req.query;
    
    const cacheKey = getCacheKey('products_list', req.query);
    const cached = getCache(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    // If DB pool isn't initialized or has no connections, fall back to mock data
    if (!pool || (pool.totalCount !== undefined && pool.totalCount === 0)) {
      try {
        const mock = await import('../../mock_products.json', { assert: { type: 'json' } });
        return res.json({ products: mock.default || mock, total: (mock.default || mock).length, limit: parseInt(limit), offset: parseInt(offset) });
      } catch (e) {
        // continue to run DB query and let it fail so the error handler returns 500
      }
    }

    // Use the new search function if search term is provided
    if (search) {
      const searchQuery = `
        SELECT * FROM search_products(
          $1::TEXT, $2::TEXT, $3::TEXT, $4::BOOLEAN, $5::BOOLEAN, 
          TRUE, $6::DECIMAL, $7::DECIMAL, $8::INTEGER, $9::INTEGER
        )
      `;
      
      const searchParams = [
        search,
        category || null,
        subcategory || null,
        featured === 'true',
        popular === 'true',
        price_min ? parseFloat(price_min) : null,
        price_max ? parseFloat(price_max) : null,
        parseInt(limit),
        parseInt(offset)
      ];
      
      const result = await pool.query(searchQuery, searchParams);
      
      // Get total count for search
      const countQuery = `
        SELECT COUNT(*) as total
        FROM search_products($1::TEXT, $2::TEXT, $3::TEXT, $4::BOOLEAN, $5::BOOLEAN, TRUE, $6::DECIMAL, $7::DECIMAL, 999999, 0)
      `;
      const countResult = await pool.query(countQuery, searchParams.slice(0, -2).concat([999999, 0]));
      
      const response = {
        products: result.rows,
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
        search_term: search
      };
      
      setCache(cacheKey, response);
      return res.json(response);
    }

    // Optimized query without search - single query with all data
    let baseQuery = `
      WITH product_aggregates AS (
        SELECT 
          product_id,
          array_agg(DISTINCT benefit) FILTER (WHERE benefit IS NOT NULL) as benefits,
          array_agg(DISTINCT ingredient) FILTER (WHERE ingredient IS NOT NULL) as ingredients,
          array_agg(DISTINCT tag) FILTER (WHERE tag IS NOT NULL) as tags,
          json_agg(DISTINCT jsonb_build_object(
            'size', size, 
            'price', price, 
            'original_price', original_price
          )) FILTER (WHERE size IS NOT NULL) as sizes
        FROM (
          SELECT product_id, benefit, NULL as ingredient, NULL as tag, NULL as size, NULL as price, NULL as original_price FROM product_benefits
          UNION ALL
          SELECT product_id, NULL, ingredient, NULL, NULL, NULL, NULL FROM product_ingredients
          UNION ALL
          SELECT product_id, NULL, NULL, tag, NULL, NULL, NULL FROM product_tags
          UNION ALL
          SELECT product_id, NULL, NULL, NULL, size, price, original_price FROM product_sizes
        ) combined
        GROUP BY product_id
      )
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        sc.name as subcategory_name,
        sc.slug as subcategory_slug,
        COALESCE(pa.benefits, ARRAY[]::text[]) as benefits,
        COALESCE(pa.ingredients, ARRAY[]::text[]) as ingredients,
        COALESCE(pa.tags, ARRAY[]::text[]) as tags,
        COALESCE(pa.sizes, '[]'::json) as sizes
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN product_aggregates pa ON p.id = pa.product_id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCount = 0;
    
    // Apply filters
    if (category) {
      paramCount++;
      baseQuery += ` AND c.slug = $${paramCount}`;
      queryParams.push(category);
    }
    
    if (subcategory) {
      paramCount++;
      baseQuery += ` AND sc.slug = $${paramCount}`;
      queryParams.push(subcategory);
    }
    
    if (featured === 'true') {
      baseQuery += ` AND p.is_featured = true`;
    }
    
    if (popular === 'true') {
      baseQuery += ` AND p.is_popular = true`;
    }
    
    if (price_min) {
      paramCount++;
      baseQuery += ` AND p.price >= $${paramCount}`;
      queryParams.push(parseFloat(price_min));
    }
    
    if (price_max) {
      paramCount++;
      baseQuery += ` AND p.price <= $${paramCount}`;
      queryParams.push(parseFloat(price_max));
    }
    
    // Add sorting
    switch (sort) {
      case 'price-low':
        baseQuery += ` ORDER BY p.price ASC`;
        break;
      case 'price-high':
        baseQuery += ` ORDER BY p.price DESC`;
        break;
      case 'rating':
        baseQuery += ` ORDER BY p.rating DESC, p.reviews_count DESC`;
        break;
      case 'popular':
        baseQuery += ` ORDER BY p.reviews_count DESC, p.rating DESC`;
        break;
      case 'newest':
        baseQuery += ` ORDER BY p.created_at DESC`;
        break;
      default:
        baseQuery += ` ORDER BY p.is_featured DESC, p.is_popular DESC, p.rating DESC, p.created_at DESC`;
    }
    
    // Add pagination
    paramCount++;
    baseQuery += ` LIMIT $${paramCount}`;
    queryParams.push(parseInt(limit));
    
    paramCount++;
    baseQuery += ` OFFSET $${paramCount}`;
    queryParams.push(parseInt(offset));
    
    // Execute main query
    const result = await pool.query(baseQuery, queryParams);
    
    // Get total count with same filters (optimized count query)
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      WHERE 1=1
    `;
    
    const countParams = [];
    let countParamNum = 0;
    
    if (category) {
      countParamNum++;
      countQuery += ` AND c.slug = $${countParamNum}`;
      countParams.push(category);
    }
    
    if (subcategory) {
      countParamNum++;
      countQuery += ` AND sc.slug = $${countParamNum}`;
      countParams.push(subcategory);
    }
    
    if (featured === 'true') {
      countQuery += ` AND p.is_featured = true`;
    }
    
    if (popular === 'true') {
      countQuery += ` AND p.is_popular = true`;
    }
    
    if (price_min) {
      countParamNum++;
      countQuery += ` AND p.price >= $${countParamNum}`;
      countParams.push(parseFloat(price_min));
    }
    
    if (price_max) {
      countParamNum++;
      countQuery += ` AND p.price <= $${countParamNum}`;
      countParams.push(parseFloat(price_max));
    }
    
    const countResult = await pool.query(countQuery, countParams);
    
    const response = {
      products: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
    
    setCache(cacheKey, response);
    res.json(response);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get categories with product counts (optimized)
router.get('/categories', async (req, res) => {
  try {
    const cacheKey = getCacheKey('categories_all', {});
    const cached = getCache(cacheKey);

    if (cached) {
      return res.json({ categories: cached });
    }

    const query = `
      WITH category_counts AS (
        SELECT
          c.id,
          COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.in_stock = true
        GROUP BY c.id
      ),
      subcategory_counts AS (
        SELECT
          sc.category_id,
          json_agg(
            json_build_object(
              'id', sc.id,
              'name', sc.name,
              'slug', sc.slug,
              'description', sc.description,
              'product_count', COUNT(p.id)
            )
            ORDER BY sc.name
          ) as subcategories
        FROM subcategories sc
        LEFT JOIN products p ON sc.id = p.subcategory_id AND p.in_stock = true
        GROUP BY sc.category_id
      )
      SELECT
        c.*,
        cc.product_count,
        COALESCE(scc.subcategories, '[]'::json) as subcategories
      FROM categories c
      LEFT JOIN category_counts cc ON c.id = cc.id
      LEFT JOIN subcategory_counts scc ON c.id = scc.category_id
      ORDER BY c.name
    `;

    const result = await pool.query(query);
    setCache(cacheKey, result.rows);
    res.json({ categories: result.rows });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single product with optimized query
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that id is a number, not a string like "categories"
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const cacheKey = getCacheKey('product_detail', { id });
    const cached = getCache(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Single optimized query for product details
    const query = `
      WITH product_data AS (
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          sc.name as subcategory_name,
          sc.slug as subcategory_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
        WHERE p.id = $1
      ),
      product_benefits AS (
        SELECT array_agg(benefit) as benefits
        FROM product_benefits
        WHERE product_id = $1
      ),
      product_ingredients AS (
        SELECT array_agg(ingredient) as ingredients
        FROM product_ingredients
        WHERE product_id = $1
      ),
      product_tags AS (
        SELECT array_agg(tag) as tags
        FROM product_tags
        WHERE product_id = $1
      ),
      product_sizes AS (
        SELECT json_agg(jsonb_build_object(
          'size', size,
          'price', price,
          'original_price', original_price
        )) as sizes
        FROM product_sizes
        WHERE product_id = $1
      ),
      recent_reviews AS (
        SELECT
          json_agg(
            jsonb_build_object(
              'id', r.id,
              'rating', r.rating,
              'title', r.title,
              'comment', r.comment,
              'created_at', r.created_at,
              'user_name', COALESCE(u.first_name || ' ' || u.last_name, 'Anonymous'),
              'is_verified', r.is_verified_purchase
            )
            ORDER BY r.created_at DESC
          ) as recent_reviews
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.product_id = $1
        LIMIT 5
      )
      SELECT
        pd.*,
        COALESCE(pb.benefits, ARRAY[]::text[]) as benefits,
        COALESCE(pi.ingredients, ARRAY[]::text[]) as ingredients,
        COALESCE(pt.tags, ARRAY[]::text[]) as tags,
        COALESCE(ps.sizes, '[]'::json) as sizes,
        COALESCE(rr.recent_reviews, '[]'::json) as recent_reviews
      FROM product_data pd
      CROSS JOIN product_benefits pb
      CROSS JOIN product_ingredients pi
      CROSS JOIN product_tags pt
      CROSS JOIN product_sizes ps
      CROSS JOIN recent_reviews rr
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = result.rows[0];
    setCache(cacheKey, product);
    res.json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const cacheKey = getCacheKey('search_suggestions', { q, limit });
    const cached = getCache(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const query = 'SELECT suggestion FROM get_search_suggestions($1, $2)';
    const result = await pool.query(query, [q, parseInt(limit)]);

    const response = {
      suggestions: result.rows.map(row => row.suggestion)
    };

    setCache(cacheKey, response);
    res.json(response);

  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.json({ suggestions: [] });
  }
});

// Get search suggestions - legacy endpoint
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const cacheKey = getCacheKey('search_suggestions', { q });
    const cached = getCache(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const query = 'SELECT suggestion FROM get_search_suggestions($1, 10)';
    const result = await pool.query(query, [q]);

    const response = {
      suggestions: result.rows.map(row => row.suggestion)
    };

    setCache(cacheKey, response);
    res.json(response);

  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.json({ suggestions: [] });
  }
});

// Get categories with product counts (optimized) - legacy endpoint
router.get('/categories/all', async (req, res) => {
  try {
    const cacheKey = getCacheKey('categories_all', {});
    const cached = getCache(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const query = `
      WITH category_counts AS (
        SELECT
          c.id,
          COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.in_stock = true
        GROUP BY c.id
      ),
      subcategory_counts AS (
        SELECT
          sc.category_id,
          json_agg(
            json_build_object(
              'id', sc.id,
              'name', sc.name,
              'slug', sc.slug,
              'description', sc.description,
              'product_count', COUNT(p.id)
            )
            ORDER BY sc.name
          ) as subcategories
        FROM subcategories sc
        LEFT JOIN products p ON sc.id = p.subcategory_id AND p.in_stock = true
        GROUP BY sc.category_id
      )
      SELECT
        c.*,
        cc.product_count,
        COALESCE(scc.subcategories, '[]'::json) as subcategories
      FROM categories c
      LEFT JOIN category_counts cc ON c.id = cc.id
      LEFT JOIN subcategory_counts scc ON c.id = scc.category_id
      ORDER BY c.name
    `;

    const result = await pool.query(query);
    setCache(cacheKey, result.rows);
    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get related products
router.get('/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const cacheKey = getCacheKey('related_products', { id, limit });
    const cached = getCache(cacheKey);

    if (cached) {
      return res.json({ products: cached, count: cached.length });
    }

    // Get the current product's category and tags
    const productQuery = `
      SELECT
        p.category_id,
        p.subcategory_id,
        array_agg(DISTINCT pt.tag) as tags,
        array_agg(DISTINCT pb.benefit) as benefits,
        array_agg(DISTINCT pi.ingredient) as ingredients
      FROM products p
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN product_benefits pb ON p.id = pb.product_id
      LEFT JOIN product_ingredients pi ON p.id = pi.product_id
      WHERE p.id = $1
      GROUP BY p.id, p.category_id, p.subcategory_id
    `;

    const productResult = await pool.query(productQuery, [id]);

    if (productResult.rows.length === 0) {
      return res.json({ products: [], count: 0 });
    }

    const product = productResult.rows[0];

    // Find related products based on category, subcategory, and shared tags/benefits/ingredients
    const relatedQuery = `
      WITH product_similarity AS (
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          sc.name as subcategory_name,
          sc.slug as subcategory_slug,
          CASE
            WHEN p.category_id = $2 THEN 3
            WHEN p.subcategory_id = $3 THEN 2
            ELSE 1
          END as relevance_score,
          array_agg(DISTINCT pt.tag) as tags,
          array_agg(DISTINCT pb.benefit) as benefits,
          array_agg(DISTINCT pi.ingredient) as ingredients
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
        LEFT JOIN product_tags pt ON p.id = pt.product_id
        LEFT JOIN product_benefits pb ON p.id = pb.product_id
        LEFT JOIN product_ingredients pi ON p.id = pi.product_id
        WHERE p.id != $1
          AND p.in_stock = true
          AND (
            p.category_id = $2
            OR p.subcategory_id = $3
            OR EXISTS (
              SELECT 1 FROM product_tags
              WHERE product_id = p.id AND tag = ANY($4)
            )
            OR EXISTS (
              SELECT 1 FROM product_benefits
              WHERE product_id = p.id AND benefit = ANY($5)
            )
          )
        GROUP BY p.id, c.name, c.slug, sc.name, sc.slug
        ORDER BY relevance_score DESC, p.rating DESC, p.reviews_count DESC
        LIMIT $6
      )
      SELECT
        ps.*,
        COALESCE(ps.tags, ARRAY[]::text[]) as tags,
        COALESCE(ps.benefits, ARRAY[]::text[]) as benefits,
        COALESCE(ps.ingredients, ARRAY[]::text[]) as ingredients
      FROM product_similarity ps
    `;

    const relatedResult = await pool.query(relatedQuery, [
      id,
      product.category_id,
      product.subcategory_id,
      product.tags || [],
      product.benefits || [],
      parseInt(limit)
    ]);

    setCache(cacheKey, relatedResult.rows);
    res.json({
      products: relatedResult.rows,
      count: relatedResult.rows.length
    });

  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ error: 'Failed to fetch related products' });
  }
});

// Clear cache endpoint (for development/admin)
router.post('/cache/clear', async (req, res) => {
  try {
    queryCache.clear();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

export default router;