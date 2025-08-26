import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0, status } = req.query;

    let query = `
      SELECT
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product_name', p.name,
            'product_image', p.image_url
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
    }

    query += `
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      orders: result.rows,
      total: result.rows.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT
        COUNT(*) as totalOrders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completedOrders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingOrders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelledOrders,
        COALESCE(SUM(total), 0) as totalRevenue,
        COALESCE(AVG(total), 0) as averageOrderValue,
        MAX(created_at) as lastOrderDate
      FROM orders
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    const stats = result.rows[0];

    res.json({
      stats: {
        totalOrders: parseInt(stats.totalorders),
        completedOrders: parseInt(stats.completedorders),
        pendingOrders: parseInt(stats.pendingorders),
        cancelledOrders: parseInt(stats.cancelledorders),
        totalRevenue: parseFloat(stats.totalrevenue),
        averageOrderValue: parseFloat(stats.averageordervalue),
        lastOrderDate: stats.lastorderdate
      }
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    console.log('Order request body:', JSON.stringify(req.body, null, 2));
    
    const { 
      items, 
      shipping, 
      shippingMethod, 
      subtotal, 
      shipping: shippingCost, 
      tax, 
      discount, 
      total 
    } = req.body;

    // Generate order number
    const orderNumber = `BB-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Insert order into database
    const orderResult = await pool.query(`
      INSERT INTO orders (
        order_number, status, subtotal, tax, shipping, total, shipping_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `, [
      orderNumber,
      'pending',
      subtotal,
      tax,
      shippingCost,
      total,
      JSON.stringify(shipping)
    ]);

    const orderId = orderResult.rows[0].id;

    // Insert order items
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await pool.query(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)
        `, [orderId, item.id, item.quantity, item.price]);
      }
    }

    res.status(201).json({
      success: true,
      order: {
        id: orderId,
        orderNumber,
        ...orderResult.rows[0]
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create order',
      message: error.message 
    });
  }
});

export default router;