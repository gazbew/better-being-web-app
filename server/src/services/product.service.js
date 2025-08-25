import { db } from '../config/db.js';
import { AppError } from '../middleware/error-handler.js';
import { eq, and, or, ilike, gte, lte, desc, asc, sql } from 'drizzle-orm';
import { products, categories, subcategories, productBenefits, productIngredients, productTags, productSizes } from '../config/schema.js';

class ProductService {
  
  // Advanced product search with filters
  async searchProducts(filters = {}) {
    const {
      query = '',
      category,
      subcategory,
      tags = [],
      priceRange = {},
      rating = 0,
      inStock = null,
      featured = null,
      popular = null,
      sort = 'relevance',
      limit = 20,
      offset = 0
    } = filters;

    let searchQuery = `
      SELECT DISTINCT
        p.id,
        p.sku,
        p.name,
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
        array_agg(DISTINCT pt.tag) FILTER (WHERE pt.tag IS NOT NULL) as tags,
        json_agg(DISTINCT jsonb_build_object(
          'size', ps.size,
          'price', ps.price,
          'original_price', ps.original_price,
          'in_stock', ps.in_stock
        )) FILTER (WHERE ps.size IS NOT NULL) as sizes,
        -- Relevance scoring for search
        CASE 
          WHEN p.name ILIKE $1 THEN 100
          WHEN p.name ILIKE $2 THEN 90
          WHEN p.description ILIKE $1 THEN 70
          WHEN p.description ILIKE $2 THEN 60
          ELSE 50
        END as relevance_score
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN product_benefits pb ON p.id = pb.product_id
      LEFT JOIN product_ingredients pi ON p.id = pi.product_id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN product_sizes ps ON p.id = ps.product_id
      WHERE 1=1
    `;

    const queryParams = [`%${query}%`, `%${query.split(' ').join('%')}%`];
    let paramCount = 2;

    // Add search conditions
    if (query) {
      paramCount++;
      searchQuery += ` AND (
        p.name ILIKE $1 OR 
        p.description ILIKE $1 OR
        p.name ILIKE $2 OR
        p.description ILIKE $2 OR
        EXISTS (
          SELECT 1 FROM product_tags pt2 
          WHERE pt2.product_id = p.id AND pt2.tag ILIKE $1
        ) OR
        EXISTS (
          SELECT 1 FROM product_benefits pb2 
          WHERE pb2.product_id = p.id AND pb2.benefit ILIKE $1
        )
      )`;
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

    // Tags filter
    if (tags.length > 0) {
      paramCount++;
      searchQuery += ` AND EXISTS (
        SELECT 1 FROM product_tags pt3 
        WHERE pt3.product_id = p.id AND pt3.tag = ANY($${paramCount}::text[])
      )`;
      queryParams.push(tags);
    }

    // Price range filter
    if (priceRange.min) {
      paramCount++;
      searchQuery += ` AND p.price >= $${paramCount}`;
      queryParams.push(priceRange.min);
    }
    if (priceRange.max) {
      paramCount++;
      searchQuery += ` AND p.price <= $${paramCount}`;
      queryParams.push(priceRange.max);
    }

    // Rating filter
    if (rating > 0) {
      paramCount++;
      searchQuery += ` AND p.rating >= $${paramCount}`;
      queryParams.push(rating);
    }

    // Stock filter
    if (inStock !== null) {
      if (inStock) {
        searchQuery += ` AND p.in_stock = true AND p.stock_count > 0`;
      } else {
        searchQuery += ` AND (p.in_stock = false OR p.stock_count = 0)`;
      }
    }

    // Featured filter
    if (featured !== null) {
      searchQuery += ` AND p.is_featured = ${featured}`;
    }

    // Popular filter
    if (popular !== null) {
      searchQuery += ` AND p.is_popular = ${popular}`;
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
          searchQuery += ` ORDER BY relevance_score DESC, p.is_featured DESC, p.rating DESC`;
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
      tags = [],
      priceRange = {},
      rating = 0,
      inStock = null,
      featured = null,
      popular = null
    } = filters;

    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN product_benefits pb ON p.id = pb.product_id
      WHERE 1=1
    `;

    const queryParams = [`%${query}%`, `%${query.split(' ').join('%')}%`];
    let paramCount = 2;

    // Add same conditions as search
    if (query) {
      countQuery += ` AND (
        p.name ILIKE $1 OR 
        p.description ILIKE $1 OR
        p.name ILIKE $2 OR
        p.description ILIKE $2 OR
        pt.tag ILIKE $1 OR
        pb.benefit ILIKE $1
      )`;
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

    if (tags.length > 0) {
      paramCount++;
      countQuery += ` AND pt.tag = ANY($${paramCount}::text[])`;
      queryParams.push(tags);
    }

    if (priceRange.min) {
      paramCount++;
      countQuery += ` AND p.price >= $${paramCount}`;
      queryParams.push(priceRange.min);
    }

    if (priceRange.max) {
      paramCount++;
      countQuery += ` AND p.price <= $${paramCount}`;
      queryParams.push(priceRange.max);
    }

    if (rating > 0) {
      paramCount++;
      countQuery += ` AND p.rating >= $${paramCount}`;
      queryParams.push(rating);
    }

    if (inStock !== null) {
      if (inStock) {
        countQuery += ` AND p.in_stock = true AND p.stock_count > 0`;
      } else {
        countQuery += ` AND (p.in_stock = false OR p.stock_count = 0)`;
      }
    }

    if (featured !== null) {
      countQuery += ` AND p.is_featured = ${featured}`;
    }

    if (popular !== null) {
      countQuery += ` AND p.is_popular = ${popular}`;
    }

    const result = await pool.query(countQuery, queryParams);
    return parseInt(result.rows[0].total);
  }

  // Get product by ID with full details
  async getProductById(productId) {
    try {
      const result = await db
        .select({
          id: products.id,
          sku: products.sku,
          name: products.name,
          description: products.description,
          longDescription: products.longDescription,
          price: products.price,
          originalPrice: products.originalPrice,
          rating: products.rating,
          reviewsCount: products.reviewsCount,
          categoryId: products.categoryId,
          subcategoryId: products.subcategoryId,
          imageUrl: products.imageUrl,
          isPopular: products.isPopular,
          isFeatured: products.isFeatured,
          inStock: products.inStock,
          stockCount: products.stockCount,
          usageInstructions: products.usageInstructions,
          warnings: products.warnings,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          categoryName: categories.name,
          categorySlug: categories.slug,
          subcategoryName: subcategories.name,
          subcategorySlug: subcategories.slug,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
        .where(eq(products.id, productId))
        .limit(1);

      if (result.length === 0) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      return result[0];
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new AppError('Failed to fetch product', 500, 'DATABASE_ERROR');
    }
  }

  // Get related products
  async getRelatedProducts(productId, limit = 4) {
    const query = `
      SELECT DISTINCT
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
        c.slug as category_slug,
        -- Calculate similarity score
        (
          CASE WHEN p.category_id = source.category_id THEN 3 ELSE 0 END +
          CASE WHEN p.subcategory_id = source.subcategory_id THEN 2 ELSE 0 END +
          (
            SELECT COUNT(*) FROM product_tags pt1 
            JOIN product_tags pt2 ON pt1.tag = pt2.tag 
            WHERE pt1.product_id = $1 AND pt2.product_id = p.id
          )
        ) as similarity_score
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN products source ON source.id = $1
      WHERE p.id != $1 
        AND p.in_stock = true 
        AND p.stock_count > 0
      ORDER BY similarity_score DESC, p.rating DESC, p.reviews_count DESC
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
        COUNT(p.id) as product_count,
        json_agg(
          jsonb_build_object(
            'id', sc.id,
            'name', sc.name,
            'slug', sc.slug,
            'product_count', sc_counts.count
          )
        ) FILTER (WHERE sc.id IS NOT NULL) as subcategories
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.in_stock = true
      LEFT JOIN subcategories sc ON c.id = sc.category_id
      LEFT JOIN (
        SELECT 
          sc.id,
          COUNT(p.id) as count
        FROM subcategories sc
        LEFT JOIN products p ON sc.id = p.subcategory_id AND p.in_stock = true
        GROUP BY sc.id
      ) sc_counts ON sc.id = sc_counts.id
      GROUP BY c.id, c.name, c.slug, c.description, c.image_url, c.is_active
      ORDER BY c.display_order, c.name
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // Get popular search terms and filters
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
    const nameResult = await pool.query(nameQuery, [`%${query}%`, Math.ceil(limit / 2)]);
    suggestions.push(...nameResult.rows);

    // Tag matches
    const tagQuery = `
      SELECT DISTINCT tag as name, 'tag' as type
      FROM product_tags pt
      JOIN products p ON pt.product_id = p.id
      WHERE pt.tag ILIKE $1 AND p.in_stock = true
      ORDER BY COUNT(p.id) DESC
      LIMIT $2
    `;
    const tagResult = await pool.query(tagQuery, [`%${query}%`, Math.floor(limit / 2)]);
    suggestions.push(...tagResult.rows);

    return suggestions.slice(0, limit);
  }

  // Get product reviews
  async getProductReviews(productId, limit = 20, offset = 0) {
    const query = `
      SELECT 
        pr.*,
        u.first_name,
        u.last_name,
        CASE WHEN u.id IS NOT NULL THEN true ELSE false END as is_verified_purchase
      FROM product_reviews pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE pr.product_id = $1 AND pr.is_approved = true
      ORDER BY pr.is_featured DESC, pr.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [productId, limit, offset]);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM product_reviews WHERE product_id = $1 AND is_approved = true',
      [productId]
    );

    return {
      reviews: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset
    };
  }

  // Update product stock
  async updateStock(productId, sizeId = null, quantity) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      if (sizeId) {
        // Update specific size stock
        const result = await client.query(
          'UPDATE product_sizes SET stock_count = stock_count - $1 WHERE product_id = $2 AND id = $3 RETURNING stock_count',
          [quantity, productId, sizeId]
        );

        if (result.rows.length === 0) {
          throw new AppError('Product size not found', 404, 'SIZE_NOT_FOUND');
        }

        // Update main product stock if needed
        await client.query(
          'UPDATE products SET stock_count = (SELECT SUM(stock_count) FROM product_sizes WHERE product_id = $1) WHERE id = $1',
          [productId]
        );
      } else {
        // Update main product stock
        const result = await client.query(
          'UPDATE products SET stock_count = stock_count - $1 WHERE id = $2 RETURNING stock_count',
          [quantity, productId]
        );

        if (result.rows.length === 0) {
          throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }
      }

      // Update in_stock status
      await client.query(
        'UPDATE products SET in_stock = (stock_count > 0) WHERE id = $1',
        [productId]
      );

      await client.query('COMMIT');
      
      return this.getProductById(productId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Check stock availability
  async checkStockAvailability(items) {
    const availabilityChecks = items.map(async (item) => {
      const { productId, sizeId, quantity } = item;
      
      let query;
      let params;
      
      if (sizeId) {
        query = `
          SELECT 
            p.id,
            p.name,
            ps.id as size_id,
            ps.size,
            ps.stock_count,
            ps.in_stock,
            ps.price
          FROM products p
          JOIN product_sizes ps ON p.id = ps.product_id
          WHERE p.id = $1 AND ps.id = $2
        `;
        params = [productId, sizeId];
      } else {
        query = `
          SELECT 
            id,
            name,
            null as size_id,
            null as size,
            stock_count,
            in_stock,
            price
          FROM products
          WHERE id = $1
        `;
        params = [productId];
      }

      const result = await pool.query(query, params);
      
      if (result.rows.length === 0) {
        return {
          productId,
          sizeId,
          available: false,
          reason: 'Product not found',
          requestedQuantity: quantity
        };
      }

      const product = result.rows[0];
      const available = product.in_stock && product.stock_count >= quantity;

      return {
        productId,
        sizeId,
        available,
        reason: !available ? (
          !product.in_stock ? 'Out of stock' : 'Insufficient stock'
        ) : null,
        requestedQuantity: quantity,
        availableQuantity: product.stock_count,
        product: {
          name: product.name,
          size: product.size,
          price: product.price
        }
      };
    });

    return Promise.all(availabilityChecks);
  }
}

export default new ProductService();