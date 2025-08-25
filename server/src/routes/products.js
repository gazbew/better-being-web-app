import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, featured, popular, search, sort, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        sc.name as subcategory_name,
        array_agg(DISTINCT pb.benefit) as benefits,
        array_agg(DISTINCT pi.ingredient) as ingredients,
        array_agg(DISTINCT pt.tag) as tags,
        json_agg(DISTINCT jsonb_build_object('size', ps.size, 'price', ps.price, 'original_price', ps.original_price)) as sizes
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN product_benefits pb ON p.id = pb.product_id
      LEFT JOIN product_ingredients pi ON p.id = pi.product_id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN product_sizes ps ON p.id = ps.product_id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCount = 0;
    
    if (category) {
      paramCount++;
      query += ` AND c.slug = $${paramCount}`;
      queryParams.push(category);
    }
    
    if (subcategory) {
      paramCount++;
      query += ` AND sc.slug = $${paramCount}`;
      queryParams.push(subcategory);
    }
    
    if (featured === 'true') {
      query += ` AND p.is_featured = true`;
    }
    
    if (popular === 'true') {
      query += ` AND p.is_popular = true`;
    }
    
    if (search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }
    
    query += ` GROUP BY p.id, c.name, sc.name`;
    
    // Sorting
    switch (sort) {
      case 'price-low':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'price-high':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'rating':
        query += ` ORDER BY p.rating DESC`;
        break;
      case 'popular':
        query += ` ORDER BY p.reviews_count DESC`;
        break;
      default:
        query += ` ORDER BY p.is_featured DESC, p.created_at DESC`;
    }
    
    // Pagination
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    queryParams.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    queryParams.push(offset);
    
    const result = await pool.query(query, queryParams);
    
    // Get total count
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
    
    if (search) {
      countParamNum++;
      countQuery += ` AND (p.name ILIKE $${countParamNum} OR p.description ILIKE $${countParamNum})`;
      countParams.push(`%${search}%`);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      products: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        sc.name as subcategory_name,
        array_agg(DISTINCT pb.benefit) as benefits,
        array_agg(DISTINCT pi.ingredient) as ingredients,
        array_agg(DISTINCT pt.tag) as tags,
        json_agg(DISTINCT jsonb_build_object('size', ps.size, 'price', ps.price, 'original_price', ps.original_price)) as sizes
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN product_benefits pb ON p.id = pb.product_id
      LEFT JOIN product_ingredients pi ON p.id = pi.product_id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN product_sizes ps ON p.id = ps.product_id
      WHERE p.id = $1
      GROUP BY p.id, c.name, sc.name
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get categories
router.get('/categories/all', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*,
        json_agg(
          json_build_object(
            'id', sc.id,
            'name', sc.name,
            'slug', sc.slug,
            'description', sc.description
          )
        ) as subcategories
      FROM categories c
      LEFT JOIN subcategories sc ON c.id = sc.category_id
      GROUP BY c.id
      ORDER BY c.name
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;