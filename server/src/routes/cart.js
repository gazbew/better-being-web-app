import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get cart for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const query = `
      SELECT 
        c.id as cart_id,
        c.quantity,
        c.size,
        c.created_at,
        p.id as product_id,
        p.name,
        p.price,
        p.original_price,
        p.image_url,
        p.in_stock,
        p.stock_count,
        COALESCE(ps.price, p.price) as actual_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN product_sizes ps ON p.id = ps.product_id AND c.size = ps.size
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Get cart summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const query = `
      SELECT 
        COUNT(*) as totalItems,
        COALESCE(SUM(c.quantity), 0) as totalQuantity,
        COALESCE(SUM(c.quantity * COALESCE(ps.price, p.price)), 0) as totalPrice
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN product_sizes ps ON p.id = ps.product_id AND c.size = ps.size
      WHERE c.user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    res.json({
      totalItems: parseInt(result.rows[0].totalitems),
      totalQuantity: parseInt(result.rows[0].totalquantity),
      totalPrice: parseFloat(result.rows[0].totalprice)
    });
  } catch (error) {
    console.error('Error fetching cart summary:', error);
    res.status(500).json({ error: 'Failed to fetch cart summary' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, size } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Check if product exists and is in stock
    const productQuery = 'SELECT * FROM products WHERE id = $1';
    const productResult = await pool.query(productQuery, [productId]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productResult.rows[0];
    if (!product.in_stock || product.stock_count < quantity) {
      return res.status(400).json({ error: 'Product is out of stock' });
    }
    
    // Check if item already exists in cart
    const existingItemQuery = `
      SELECT * FROM cart 
      WHERE user_id = $1 AND product_id = $2 AND ($3::varchar IS NULL OR size = $3)
    `;
    const existingItem = await pool.query(existingItemQuery, [userId, productId, size || null]);
    
    if (existingItem.rows.length > 0) {
      // Update quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      const updateQuery = `
        UPDATE cart 
        SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING *
      `;
      await pool.query(updateQuery, [newQuantity, existingItem.rows[0].id]);
    } else {
      // Add new item
      const insertQuery = `
        INSERT INTO cart (user_id, product_id, quantity, size)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      await pool.query(insertQuery, [userId, productId, quantity, size || null]);
    }
    
    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/update/:cartItemId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }
    
    // Verify cart item belongs to user
    const verifyQuery = 'SELECT * FROM cart WHERE id = $1 AND user_id = $2';
    const verifyResult = await pool.query(verifyQuery, [cartItemId, userId]);
    
    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    // Update quantity
    const updateQuery = `
      UPDATE cart 
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;
    
    await pool.query(updateQuery, [quantity, cartItemId, userId]);
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/remove/:cartItemId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    
    const deleteQuery = 'DELETE FROM cart WHERE id = $1 AND user_id = $2';
    const result = await pool.query(deleteQuery, [cartItemId, userId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Get cart count
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT
        COUNT(*) as itemCount,
        COALESCE(SUM(quantity), 0) as totalQuantity
      FROM cart
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    const row = result.rows[0];

    res.json({
      itemCount: parseInt(row.itemcount),
      totalQuantity: parseInt(row.totalquantity)
    });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    res.status(500).json({ error: 'Failed to fetch cart count' });
  }
});

// Validate cart items (check availability, stock, etc.)
router.post('/validate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const cartQuery = `
      SELECT
        c.id as cart_item_id,
        c.product_id,
        c.quantity,
        c.size,
        p.name as product_name,
        p.in_stock,
        p.stock_count,
        COALESCE(ps.price, p.price) as price,
        CASE
          WHEN p.in_stock = false THEN 'out_of_stock'
          WHEN p.stock_count < c.quantity THEN 'insufficient_stock'
          WHEN c.size IS NOT NULL AND ps.product_id IS NULL THEN 'invalid_size'
          ELSE 'available'
        END as availability_status
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN product_sizes ps ON p.id = ps.product_id AND c.size = ps.size
      WHERE c.user_id = $1
      ORDER BY c.created_at
    `;

    const result = await pool.query(cartQuery, [userId]);
    const cartItems = result.rows;

    const availability = cartItems.map(item => ({
      productId: item.product_id,
      available: item.availability_status === 'available',
      message: item.availability_status === 'available' ? 'Available' :
               item.availability_status === 'out_of_stock' ? 'Out of stock' :
               item.availability_status === 'insufficient_stock' ? `Only ${item.stock_count} available` :
               item.availability_status === 'invalid_size' ? 'Size not available' : 'Unknown error'
    }));

    const valid = availability.every(item => item.available);

    // Calculate cart total
    const validItems = cartItems.filter(item => item.availability_status === 'available');
    const totalPrice = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      valid,
      cart: {
        items: validItems.map(item => ({
          id: item.cart_item_id,
          productId: item.product_id,
          quantity: item.quantity,
          size: item.size,
          product: {
            name: item.product_name,
            price: item.price
          }
        })),
        totalPrice
      },
      availability
    });
  } catch (error) {
    console.error('Error validating cart:', error);
    res.status(500).json({ error: 'Failed to validate cart' });
  }
});

// Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
