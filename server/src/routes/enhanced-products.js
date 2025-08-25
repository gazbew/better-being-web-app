import express from 'express';
import pool from '../config/database.js';
import ProductService from '../services/simple-product.service.js';
import { authenticateToken, optionalAuth } from '../middleware/enhanced-auth.js';
import { generalLimiter } from '../middleware/security.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { body, query, validationResult } from 'express-validator';

const router = express.Router();

// Apply general rate limiting
router.use(generalLimiter);

// Validation middleware
const validateSearch = [
  query('query').optional().isLength({ max: 100 }).withMessage('Search query too long'),
  query('category').optional().isSlug().withMessage('Invalid category format'),
  query('subcategory').optional().isSlug().withMessage('Invalid subcategory format'),
  query('tags').optional().isArray().withMessage('Tags must be an array'),
  query('priceMin').optional().isFloat({ min: 0 }).withMessage('Invalid minimum price'),
  query('priceMax').optional().isFloat({ min: 0 }).withMessage('Invalid maximum price'),
  query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Invalid rating range'),
  query('sort').optional().isIn(['relevance', 'price-asc', 'price-desc', 'rating', 'popular', 'newest', 'name']).withMessage('Invalid sort option'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid limit'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Invalid offset'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

const validateProductId = [
  (req, res, next) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    req.productId = productId;
    next();
  }
];

/**
 * @route GET /api/products/search
 * @desc Advanced product search with filters
 * @access Public
 */
router.get('/search', validateSearch, asyncHandler(async (req, res) => {
  const {
    query = '',
    category,
    subcategory,
    tags,
    priceMin,
    priceMax,
    rating = 0,
    inStock,
    featured,
    popular,
    sort = 'relevance',
    limit = 20,
    offset = 0
  } = req.query;

  // Build filters object
  const filters = {
    query: query.trim(),
    category,
    subcategory,
    tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
    priceRange: {},
    rating: parseFloat(rating),
    inStock: inStock === 'true' ? true : (inStock === 'false' ? false : null),
    featured: featured === 'true' ? true : (featured === 'false' ? false : null),
    popular: popular === 'true' ? true : (popular === 'false' ? false : null),
    sort,
    limit: parseInt(limit),
    offset: parseInt(offset)
  };

  if (priceMin) filters.priceRange.min = parseFloat(priceMin);
  if (priceMax) filters.priceRange.max = parseFloat(priceMax);

  const results = await ProductService.searchProducts(filters);

  res.json({
    success: true,
    ...results,
    filters: {
      query: filters.query,
      category: filters.category,
      subcategory: filters.subcategory,
      tags: filters.tags,
      priceRange: filters.priceRange,
      rating: filters.rating,
      sort: filters.sort
    }
  });
}));

/**
 * @route GET /api/products/suggestions
 * @desc Get search suggestions
 * @access Public
 */
router.get('/suggestions', asyncHandler(async (req, res) => {
  const { q = '', limit = 10 } = req.query;
  
  if (!q.trim()) {
    return res.json({
      success: true,
      suggestions: []
    });
  }

  const suggestions = await ProductService.getSearchSuggestions(q.trim(), parseInt(limit));

  res.json({
    success: true,
    suggestions
  });
}));

/**
 * @route GET /api/products/categories
 * @desc Get all categories with product counts
 * @access Public
 */
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await ProductService.getCategories();

  res.json({
    success: true,
    categories
  });
}));

/**
 * @route GET /api/products/:id
 * @desc Get single product with full details
 * @access Public
 */
router.get('/:id', validateProductId, asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(req.productId);

  res.json({
    success: true,
    product
  });
}));

/**
 * @route GET /api/products/:id/related
 * @desc Get related products
 * @access Public
 */
router.get('/:id/related', validateProductId, asyncHandler(async (req, res) => {
  const { limit = 4 } = req.query;
  const relatedProducts = await ProductService.getRelatedProducts(req.productId, parseInt(limit));

  res.json({
    success: true,
    products: relatedProducts,
    count: relatedProducts.length
  });
}));

/**
 * @route GET /api/products/:id/reviews
 * @desc Get product reviews
 * @access Public
 */
router.get('/:id/reviews', validateProductId, asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  const reviews = await ProductService.getProductReviews(
    req.productId, 
    parseInt(limit), 
    parseInt(offset)
  );

  res.json({
    success: true,
    ...reviews
  });
}));

/**
 * @route POST /api/products/:id/reviews
 * @desc Add product review
 * @access Private
 */
router.post('/:id/reviews', 
  authenticateToken,
  validateProductId,
  [
    body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').optional().isLength({ min: 3, max: 100 }).withMessage('Review title must be 3-100 characters'),
    body('comment').optional().isLength({ max: 1000 }).withMessage('Review comment too long'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      next();
    }
  ],
  asyncHandler(async (req, res) => {
    const { rating, title, comment } = req.body;
    const userId = req.user.id;
    const productId = req.productId;

    // Check if user already reviewed this product
    const existingReviewResult = await pool.query(
      'SELECT id FROM product_reviews WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingReviewResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Add review
    const reviewResult = await pool.query(`
      INSERT INTO product_reviews (
        user_id, product_id, rating, title, comment, 
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, [userId, productId, rating, title || null, comment || null]);

    // Update product rating
    const avgRatingResult = await pool.query(`
      SELECT 
        AVG(rating) as avg_rating,
        COUNT(*) as review_count
      FROM product_reviews 
      WHERE product_id = $1 AND is_approved = true
    `, [productId]);

    await pool.query(`
      UPDATE products 
      SET rating = $1, reviews_count = $2
      WHERE id = $3
    `, [
      parseFloat(avgRatingResult.rows[0].avg_rating).toFixed(1),
      parseInt(avgRatingResult.rows[0].review_count),
      productId
    ]);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: reviewResult.rows[0]
    });
  })
);

/**
 * @route GET /api/products
 * @desc Get products (backward compatibility with existing route)
 * @access Public
 */
router.get('/', validateSearch, asyncHandler(async (req, res) => {
  // Use the same logic as search but with simpler parameters
  const {
    category,
    subcategory,
    featured,
    popular,
    search,
    sort = 'relevance',
    limit = 20,
    offset = 0
  } = req.query;

  const filters = {
    query: search || '',
    category,
    subcategory,
    featured: featured === 'true' ? true : (featured === 'false' ? false : null),
    popular: popular === 'true' ? true : (popular === 'false' ? false : null),
    sort,
    limit: parseInt(limit),
    offset: parseInt(offset)
  };

  const results = await ProductService.searchProducts(filters);

  res.json({
    success: true,
    ...results
  });
}));

/**
 * @route POST /api/products/stock-check
 * @desc Check stock availability for multiple items
 * @access Public
 */
router.post('/stock-check', 
  [
    body('items').isArray({ min: 1 }).withMessage('Items array required'),
    body('items.*.productId').isInt({ min: 1 }).withMessage('Valid product ID required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity required'),
    body('items.*.sizeId').optional().isInt({ min: 1 }).withMessage('Invalid size ID'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      next();
    }
  ],
  asyncHandler(async (req, res) => {
    const { items } = req.body;
    
    const stockChecks = await ProductService.checkStockAvailability(items);

    res.json({
      success: true,
      items: stockChecks,
      allAvailable: stockChecks.every(check => check.available)
    });
  })
);

export default router;