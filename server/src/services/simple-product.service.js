import pool from '../config/database.js';
import { AppError } from '../middleware/error-handler.js';

class SimpleProductService {
  
  // Basic product search with existing schema
  async searchProducts(filters = {}) {
    const {
      query = '',
      category,
      subcategory,
      featured = null,
      popular = null,
      sort = 'relevance',
      limit = 20,
      offset = 0
    } = filters;

    let searchQuery = `
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
        p.in_stock,
        p.stock_count,
        p.is_featured,
        p.is_popular,
        p.image_url,
        p.created_at,
        c.name as category_name,
        c.slug as category_slug,
        sc.name as subcategory_name,
        sc.slug as subcategory_slug,
        array_agg(DISTINCT pb.benefit) FILTER (WHERE pb.benefit IS NOT NULL) as benefits,
        array_agg(DISTINCT pi.ingredient) FILTER (WHERE pi.ingredient IS NOT NULL) as ingredients,
        array_agg(DISTINCT pt.tag) FILTER (WHERE pt.tag IS NOT NULL) as tags
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN product_benefits pb ON p.id = pb.product_id
      LEFT JOIN product_ingredients pi ON p.id = pi.product_id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramCount = 0;

    // Search functionality
    if (query) {
      paramCount++;
      searchQuery += ` AND (
        p.name ILIKE $${paramCount} OR 
        p.description ILIKE $${paramCount}
      )`;
      queryParams.push(`%${query}%`);
    }

    // Category filter
    if (category) {
      paramCount++;
      searchQuery += ` AND c.slug = $${paramCount}`;
      queryParams.push(category);
    }

    // Subcategory filter
    if (subcategory) {
      paramCount++;
      searchQuery += ` AND sc.slug = $${paramCount}`;
      queryParams.push(subcategory);
    }

    // Featured filter
    if (featured === true) {
      searchQuery += ` AND p.is_featured = true`;
    } else if (featured === false) {
      searchQuery += ` AND p.is_featured = false`;
    }

    // Popular filter
    if (popular === true) {
      searchQuery += ` AND p.is_popular = true`;
    } else if (popular === false) {
      searchQuery += ` AND p.is_popular = false`;
    }

    searchQuery += ` GROUP BY p.id, c.name, c.slug, sc.name, sc.slug`;

    // Sorting
    switch (sort) {
      case 'price-asc':
        searchQuery += ` ORDER BY p.price ASC`;
        break;
      case 'price-desc':
        searchQuery += ` ORDER BY p.price DESC`;
        break;
      case 'rating':
        searchQuery += ` ORDER BY p.rating DESC, p.reviews_count DESC`;
        break;
      case 'popular':
        searchQuery += ` ORDER BY p.reviews_count DESC, p.rating DESC`;
        break;
      case 'newest':
        searchQuery += ` ORDER BY p.created_at DESC`;
        break;
      case 'name':
        searchQuery += ` ORDER BY p.name ASC`;
        break;
      case 'relevance':
      default:
        if (query) {
          searchQuery += ` ORDER BY 
            CASE 
              WHEN p.name ILIKE $1 THEN 1
              WHEN p.description ILIKE $1 THEN 2
              ELSE 3
            END,
            p.is_featured DESC, 
            p.rating DESC`;
        } else {
          searchQuery += ` ORDER BY p.is_featured DESC, p.is_popular DESC, p.created_at DESC`;
        }
        break;
    }

    // Pagination
    paramCount++;
    searchQuery += ` LIMIT $${paramCount}`;
    queryParams.push(limit);

    paramCount++;
    searchQuery += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const result = await pool.query(searchQuery, queryParams);

    // Get total count for the same filters
    const totalCount = await this.getSearchResultsCount(filters);

    return {
      products: result.rows,
      total: totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: offset + limit < totalCount
    };
  }

  // Get search results count
  async getSearchResultsCount(filters) {
    const {
      query = '',
      category,
      subcategory,
      featured = null,
      popular = null
    } = filters;

    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramCount = 0;

    if (query) {
      paramCount++;
      countQuery += ` AND (
        p.name ILIKE $${paramCount} OR 
        p.description ILIKE $${paramCount}
      )`;
      queryParams.push(`%${query}%`);
    }

    if (category) {
      paramCount++;
      countQuery += ` AND c.slug = $${paramCount}`;
      queryParams.push(category);
    }

    if (subcategory) {
      paramCount++;
      countQuery += ` AND sc.slug = $${paramCount}`;
      queryParams.push(subcategory);
    }

    if (featured === true) {
      countQuery += ` AND p.is_featured = true`;
    } else if (featured === false) {
      countQuery += ` AND p.is_featured = false`;
    }

    if (popular === true) {
      countQuery += ` AND p.is_popular = true`;
    } else if (popular === false) {
      countQuery += ` AND p.is_popular = false`;
    }

    const result = await pool.query(countQuery, queryParams);
    return parseInt(result.rows[0].total);
  }

  // Get product by ID with full details
  async getProductById(productId) {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        sc.name as subcategory_name,
        sc.slug as subcategory_slug,
        array_agg(DISTINCT pb.benefit) FILTER (WHERE pb.benefit IS NOT NULL) as benefits,
        array_agg(DISTINCT pi.ingredient) FILTER (WHERE pi.ingredient IS NOT NULL) as ingredients,
        array_agg(DISTINCT pt.tag) FILTER (WHERE pt.tag IS NOT NULL) as tags
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN product_benefits pb ON p.id = pb.product_id
      LEFT JOIN product_ingredients pi ON p.id = pi.product_id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      WHERE p.id = $1
      GROUP BY p.id, c.name, c.slug, sc.name, sc.slug
    `;

    const result = await pool.query(query, [productId]);
    
    if (result.rows.length === 0) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    return result.rows[0];
  }

  // Get related products
  async getRelatedProducts(productId, limit = 4) {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.rating,
        p.reviews_count,
        p.image_url,
        p.is_featured,
        p.is_popular,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN products source ON source.id = $1
      WHERE p.id != $1 
        AND (
          p.category_id = source.category_id OR
          p.subcategory_id = source.subcategory_id
        )
        AND p.in_stock = true
      ORDER BY 
        CASE WHEN p.category_id = source.category_id THEN 1 ELSE 2 END,
        p.rating DESC, 
        p.reviews_count DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [productId, limit]);
    return result.rows;
  }

  // Get product categories with counts
  async getCategories() {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.in_stock = true
      GROUP BY c.id, c.name, c.slug, c.description, c.icon
      ORDER BY c.name
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // Get basic search suggestions
  async getSearchSuggestions(query, limit = 10) {
    const suggestions = [];

    // Product name matches
    const nameQuery = `
      SELECT DISTINCT name, 'product' as type
      FROM products 
      WHERE name ILIKE $1 AND in_stock = true
      ORDER BY reviews_count DESC
      LIMIT $2
    `;
    const nameResult = await pool.query(nameQuery, [`%${query}%`, limit]);
    suggestions.push(...nameResult.rows);

    return suggestions.slice(0, limit);
  }

  // Simple stock check
  async checkStockAvailability(items) {
    const availabilityChecks = items.map(async (item) => {
      const { productId, quantity } = item;
      
      const query = `
        SELECT 
          id,
          name,
          stock_count,
          in_stock,
          price
        FROM products
        WHERE id = $1
      `;

      const result = await pool.query(query, [productId]);
      
      if (result.rows.length === 0) {
        return {
          productId,
          available: false,
          reason: 'Product not found',
          requestedQuantity: quantity
        };
      }

      const product = result.rows[0];
      const available = product.in_stock && product.stock_count >= quantity;

      return {
        productId,
        available,
        reason: !available ? (
          !product.in_stock ? 'Out of stock' : 'Insufficient stock'
        ) : null,
        requestedQuantity: quantity,
        availableQuantity: product.stock_count,
        product: {
          name: product.name,
          price: product.price
        }
      };
    });

    return Promise.all(availabilityChecks);
  }

  // Update product stock
  async updateStock(productId, quantity) {
    const result = await pool.query(
      'UPDATE products SET stock_count = stock_count - $1, in_stock = (stock_count - $1) > 0 WHERE id = $2 RETURNING stock_count, in_stock',
      [quantity, productId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    return result.rows[0];
  }
}

export default new SimpleProductService();