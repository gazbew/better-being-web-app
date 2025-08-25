import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get user orders
router.get('/', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    res.json({ orders: [] });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
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