import express from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get personalized recommendations for a user
router.get('/personalized', authenticate, async (req, res) => {
  try {
    const { limit = 12, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    // Get user's purchase history and preferences
    const userDataQuery = `
      SELECT 
        p.category_id,
        COUNT(*) as purchase_count,
        AVG(oi.price) as avg_price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY p.category_id
      ORDER BY purchase_count DESC
    `;

    const userData = await pool.query(userDataQuery, [userId]);
    const preferredCategories = userData.rows.map(row => row.category_id);
    const avgPriceRange = userData.rows[0]?.avg_price || 500;

    // Get products based on collaborative filtering
    const collaborativeQuery = `
      WITH user_purchases AS (
        SELECT DISTINCT oi.product_id
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = $1
      ),
      similar_users AS (
        SELECT o.user_id, COUNT(*) as common_products
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE oi.product_id IN (SELECT product_id FROM user_purchases)
        AND o.user_id != $1
        GROUP BY o.user_id
        ORDER BY common_products DESC
        LIMIT 50
      ),
      recommended_products AS (
        SELECT 
          p.*,
          COUNT(DISTINCT o.user_id) as purchase_count,
          AVG(r.rating) as avg_rating,
          'collaborative' as recommendation_type,
          CASE 
            WHEN p.category_id = ANY($2::int[]) THEN 0.9
            ELSE 0.7
          END * (COUNT(DISTINCT o.user_id)::float / 10) as confidence_score
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        JOIN orders o ON oi.order_id = o.id
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE o.user_id IN (SELECT user_id FROM similar_users)
        AND p.id NOT IN (SELECT product_id FROM user_purchases)
        AND p.stock_quantity > 0
        AND p.active = true
        GROUP BY p.id
        HAVING COUNT(DISTINCT o.user_id) > 2
      )
      SELECT * FROM recommended_products
      ORDER BY confidence_score DESC
      LIMIT $3 OFFSET $4
    `;

    const collaborativeResults = await pool.query(
      collaborativeQuery, 
      [userId, preferredCategories, limit, offset]
    );

    // Get content-based recommendations
    const contentBasedQuery = `
      WITH user_interests AS (
        SELECT DISTINCT 
          p.category_id,
          p.tags
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
      ),
      user_reviews AS (
        SELECT product_id, rating
        FROM reviews
        WHERE user_id = $1
        AND rating >= 4
      )
      SELECT 
        p.*,
        'content_based' as recommendation_type,
        CASE 
          WHEN p.category_id IN (SELECT category_id FROM user_interests) THEN 0.8
          ELSE 0.6
        END * (p.rating / 5) as confidence_score
      FROM products p
      WHERE (
        p.category_id IN (SELECT category_id FROM user_interests)
        OR p.tags && (SELECT array_agg(DISTINCT unnest(tags)) FROM user_interests)
      )
      AND p.id NOT IN (
        SELECT oi.product_id 
        FROM orders o 
        JOIN order_items oi ON o.id = oi.order_id 
        WHERE o.user_id = $1
      )
      AND p.stock_quantity > 0
      AND p.active = true
      AND ABS(p.price - $2) < $2 * 0.5  -- Within 50% of average price range
      ORDER BY confidence_score DESC, p.rating DESC
      LIMIT $3 OFFSET $4
    `;

    const contentBasedResults = await pool.query(
      contentBasedQuery,
      [userId, avgPriceRange, limit / 2, 0]
    );

    // Combine and deduplicate recommendations
    const recommendations = [
      ...collaborativeResults.rows,
      ...contentBasedResults.rows
    ];

    // Remove duplicates and sort by confidence
    const uniqueRecommendations = recommendations.reduce((acc, curr) => {
      if (!acc.find(item => item.id === curr.id)) {
        acc.push(curr);
      }
      return acc;
    }, []).sort((a, b) => b.confidence_score - a.confidence_score);

    // Track recommendations for analytics
    if (uniqueRecommendations.length > 0) {
      const trackingValues = uniqueRecommendations.map(rec => 
        `(${userId}, ${rec.id}, '${rec.recommendation_type}', ${rec.confidence_score})`
      ).join(',');

      await pool.query(`
        INSERT INTO recommendation_impressions (user_id, product_id, type, confidence_score)
        VALUES ${trackingValues}
        ON CONFLICT DO NOTHING
      `);
    }

    res.json({
      recommendations: uniqueRecommendations.slice(0, limit),
      total: uniqueRecommendations.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Get trending products
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;

    const query = `
      SELECT 
        p.*,
        COUNT(DISTINCT oi.order_id) as order_count,
        SUM(oi.quantity) as total_sold,
        AVG(r.rating) as recent_rating
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      LEFT JOIN reviews r ON p.id = r.product_id 
        AND r.created_at > NOW() - INTERVAL '${days} days'
      WHERE o.created_at > NOW() - INTERVAL '${days} days'
      AND p.stock_quantity > 0
      AND p.active = true
      GROUP BY p.id
      HAVING COUNT(DISTINCT oi.order_id) > 3
      ORDER BY order_count DESC, total_sold DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);

    res.json({
      trending: result.rows,
      period_days: days
    });
  } catch (error) {
    console.error('Error getting trending products:', error);
    res.status(500).json({ error: 'Failed to get trending products' });
  }
});

// Get frequently bought together
router.get('/frequently-bought/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 6 } = req.query;

    const query = `
      WITH product_orders AS (
        SELECT DISTINCT order_id
        FROM order_items
        WHERE product_id = $1
      )
      SELECT 
        p.*,
        COUNT(*) as co_purchase_count,
        COUNT(*)::float / (SELECT COUNT(*) FROM product_orders) as correlation_score
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      WHERE oi.order_id IN (SELECT order_id FROM product_orders)
      AND p.id != $1
      AND p.stock_quantity > 0
      AND p.active = true
      GROUP BY p.id
      HAVING COUNT(*) > 2
      ORDER BY co_purchase_count DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [productId, limit]);

    res.json({
      frequently_bought_together: result.rows
    });
  } catch (error) {
    console.error('Error getting frequently bought together:', error);
    res.status(500).json({ error: 'Failed to get frequently bought together' });
  }
});

// Get similar products
router.get('/similar/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 8 } = req.query;

    // Get the target product details
    const productQuery = `
      SELECT category_id, price, tags, subcategory_id
      FROM products
      WHERE id = $1
    `;
    
    const productResult = await pool.query(productQuery, [productId]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Find similar products
    const similarQuery = `
      SELECT 
        p.*,
        CASE 
          WHEN p.subcategory_id = $2 THEN 3
          WHEN p.category_id = $3 THEN 2
          ELSE 1
        END +
        CASE 
          WHEN ABS(p.price - $4) < 100 THEN 2
          WHEN ABS(p.price - $4) < 500 THEN 1
          ELSE 0
        END +
        CASE 
          WHEN p.tags && $5::text[] THEN 2
          ELSE 0
        END as similarity_score
      FROM products p
      WHERE p.id != $1
      AND (
        p.category_id = $3
        OR p.subcategory_id = $2
        OR p.tags && $5::text[]
      )
      AND p.stock_quantity > 0
      AND p.active = true
      ORDER BY similarity_score DESC, p.rating DESC
      LIMIT $6
    `;

    const result = await pool.query(similarQuery, [
      productId,
      product.subcategory_id,
      product.category_id,
      product.price,
      product.tags || [],
      limit
    ]);

    res.json({
      similar_products: result.rows
    });
  } catch (error) {
    console.error('Error getting similar products:', error);
    res.status(500).json({ error: 'Failed to get similar products' });
  }
});

// Get bundle recommendations
router.get('/bundles', authenticate, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const userId = req.user.id;

    // Get user's interests
    const userInterestsQuery = `
      SELECT DISTINCT category_id
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
    `;

    const userInterests = await pool.query(userInterestsQuery, [userId]);
    const categoryIds = userInterests.rows.map(row => row.category_id);

    // Get bundle recommendations
    const bundlesQuery = `
      WITH bundle_products AS (
        SELECT 
          p1.id as product1_id,
          p1.name as product1_name,
          p1.price as product1_price,
          p1.image_url as product1_image,
          p2.id as product2_id,
          p2.name as product2_name,
          p2.price as product2_price,
          p2.image_url as product2_image,
          p3.id as product3_id,
          p3.name as product3_name,
          p3.price as product3_price,
          p3.image_url as product3_image,
          (p1.price + p2.price + p3.price) as total_price,
          (p1.price + p2.price + p3.price) * 0.85 as bundle_price
        FROM products p1
        CROSS JOIN products p2
        CROSS JOIN products p3
        WHERE p1.category_id = ANY($1::int[])
        AND p2.category_id = ANY($1::int[])
        AND p3.category_id = ANY($1::int[])
        AND p1.id < p2.id
        AND p2.id < p3.id
        AND p1.stock_quantity > 0
        AND p2.stock_quantity > 0
        AND p3.stock_quantity > 0
        AND p1.active = true
        AND p2.active = true
        AND p3.active = true
        ORDER BY (p1.rating + p2.rating + p3.rating) DESC
        LIMIT $2
      )
      SELECT 
        *,
        (total_price - bundle_price) as savings
      FROM bundle_products
    `;

    const result = await pool.query(bundlesQuery, [
      categoryIds.length > 0 ? categoryIds : [1, 2, 3], // Default categories if no user history
      limit
    ]);

    const bundles = result.rows.map((row, index) => ({
      id: `bundle_${index + 1}`,
      name: `Wellness Bundle ${index + 1}`,
      products: [
        {
          id: row.product1_id,
          name: row.product1_name,
          price: row.product1_price,
          image: row.product1_image
        },
        {
          id: row.product2_id,
          name: row.product2_name,
          price: row.product2_price,
          image: row.product2_image
        },
        {
          id: row.product3_id,
          name: row.product3_name,
          price: row.product3_price,
          image: row.product3_image
        }
      ],
      original_price: row.total_price,
      bundle_price: row.bundle_price,
      savings: row.savings,
      discount_percentage: 15
    }));

    res.json({
      bundles
    });
  } catch (error) {
    console.error('Error getting bundle recommendations:', error);
    res.status(500).json({ error: 'Failed to get bundle recommendations' });
  }
});

// Track recommendation clicks
router.post('/track-click', authenticate, async (req, res) => {
  try {
    const { product_id, recommendation_type, position } = req.body;
    const userId = req.user.id;

    await pool.query(`
      INSERT INTO recommendation_clicks 
      (user_id, product_id, recommendation_type, position, clicked_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [userId, product_id, recommendation_type, position]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking recommendation click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Track recommendation conversions
router.post('/track-conversion', authenticate, async (req, res) => {
  try {
    const { product_id, recommendation_type, order_id } = req.body;
    const userId = req.user.id;

    await pool.query(`
      INSERT INTO recommendation_conversions 
      (user_id, product_id, recommendation_type, order_id, converted_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [userId, product_id, recommendation_type, order_id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking recommendation conversion:', error);
    res.status(500).json({ error: 'Failed to track conversion' });
  }
});

export default router;
