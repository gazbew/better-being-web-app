import pool from '../config/database.js';
import SimpleCartService from './simple-cart.service.js';
import { AppError } from '../middleware/error-handler.js';
import { v4 as uuidv4 } from 'uuid';

class OrderService {
  
  // Generate unique order number
  generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `BB${timestamp}${random}`;
  }

  // Create order from user's cart
  async createOrderFromCart(userId, orderData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Validate cart and get items
      const cartValidation = await SimpleCartService.validateCartForCheckout(userId);
      
      if (!cartValidation.valid || cartValidation.cart.isEmpty) {
        throw new AppError('Cart is empty or invalid', 400, 'INVALID_CART');
      }

      const cart = cartValidation.cart;

      // Generate order number
      const orderNumber = this.generateOrderNumber();

      // Create order
      const orderQuery = `
        INSERT INTO orders (
          user_id, order_number, status, subtotal, tax, shipping, total,
          shipping_address, billing_address, payment_method, customer_notes,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;

      // Parse cart summary to extract numeric values
      const subtotal = parseFloat(cart.summary.subtotal.replace('R', ''));
      const tax = parseFloat(cart.summary.tax.replace('R', ''));
      const shipping = parseFloat(cart.summary.shipping.replace('R', ''));
      const total = parseFloat(cart.summary.total.replace('R', ''));

      const orderParams = [
        userId,
        orderNumber,
        'pending',
        subtotal,
        tax, 
        shipping,
        total,
        JSON.stringify(orderData.shippingAddress),
        JSON.stringify(orderData.billingAddress),
        orderData.paymentMethod || 'pending',
        orderData.customerNotes || null
      ];

      const orderResult = await client.query(orderQuery, orderParams);
      const order = orderResult.rows[0];

      // Create order items from cart
      for (const item of cart.items) {
        const orderItemQuery = `
          INSERT INTO order_items (
            order_id, product_id, quantity, price, size, created_at
          ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        `;
        
        await client.query(orderItemQuery, [
          order.id,
          item.product_id,
          item.quantity,
          parseFloat(item.product_price),
          item.size || null
        ]);
      }

      // Create shipping address record
      if (orderData.shippingAddress) {
        const shippingQuery = `
          INSERT INTO shipping_addresses (
            order_id, recipient_name, phone, street_address, suburb,
            city, province, postal_code, country, delivery_instructions
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        
        const addr = orderData.shippingAddress;
        await client.query(shippingQuery, [
          order.id,
          addr.recipientName || `${addr.firstName} ${addr.lastName}`,
          addr.phone,
          addr.streetAddress,
          addr.suburb,
          addr.city,
          addr.province,
          addr.postalCode,
          addr.country || 'South Africa',
          addr.deliveryInstructions
        ]);
      }

      // Create billing address record
      if (orderData.billingAddress) {
        const billingQuery = `
          INSERT INTO billing_addresses (
            order_id, full_name, company, street_address, suburb,
            city, province, postal_code, country, tax_number
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        
        const addr = orderData.billingAddress;
        await client.query(billingQuery, [
          order.id,
          addr.fullName || `${addr.firstName} ${addr.lastName}`,
          addr.company,
          addr.streetAddress,
          addr.suburb,
          addr.city,
          addr.province,
          addr.postalCode,
          addr.country || 'South Africa',
          addr.taxNumber
        ]);
      }

      // Add initial status to order history
      await client.query(`
        INSERT INTO order_status_history (
          order_id, status, notes, created_at
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      `, [order.id, 'pending', 'Order created']);

      // Clear the user's cart
      await SimpleCartService.clearCart(userId);

      // Update product stock
      for (const item of cart.items) {
        await client.query(`
          UPDATE products 
          SET stock_count = stock_count - $1,
              in_stock = (stock_count - $1) > 0
          WHERE id = $2
        `, [item.quantity, item.product_id]);
      }

      await client.query('COMMIT');

      // Return complete order with details
      return this.getOrderById(order.id, userId);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get order by ID with full details
  async getOrderById(orderId, userId = null) {
    let query = `
      SELECT 
        o.*,
        u.email as customer_email,
        u.first_name,
        u.last_name,
        sa.recipient_name,
        sa.phone as shipping_phone,
        sa.street_address as shipping_street,
        sa.suburb as shipping_suburb,
        sa.city as shipping_city,
        sa.province as shipping_province,
        sa.postal_code as shipping_postal_code,
        sa.country as shipping_country,
        sa.delivery_instructions,
        ba.full_name as billing_name,
        ba.company as billing_company,
        ba.street_address as billing_street,
        ba.suburb as billing_suburb,
        ba.city as billing_city,
        ba.province as billing_province,
        ba.postal_code as billing_postal_code,
        ba.country as billing_country,
        ba.tax_number
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN shipping_addresses sa ON o.id = sa.order_id
      LEFT JOIN billing_addresses ba ON o.id = ba.order_id
      WHERE o.id = $1
    `;

    const params = [orderId];

    // If userId is provided, ensure user can only see their own orders
    if (userId) {
      query += ' AND o.user_id = $2';
      params.push(userId);
    }

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    const order = result.rows[0];

    // Get order items
    const itemsQuery = `
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url,
        p.sku
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `;

    const itemsResult = await pool.query(itemsQuery, [orderId]);
    order.items = itemsResult.rows;

    // Get status history
    const historyQuery = `
      SELECT 
        osh.*,
        u.first_name,
        u.last_name
      FROM order_status_history osh
      LEFT JOIN users u ON osh.created_by = u.id
      WHERE osh.order_id = $1
      ORDER BY osh.created_at DESC
    `;

    const historyResult = await pool.query(historyQuery, [orderId]);
    order.statusHistory = historyResult.rows;

    // Get payment records
    const paymentsQuery = `
      SELECT *
      FROM payments
      WHERE order_id = $1
      ORDER BY created_at DESC
    `;

    const paymentsResult = await pool.query(paymentsQuery, [orderId]);
    order.payments = paymentsResult.rows;

    return order;
  }

  // Get user's order history
  async getUserOrders(userId, { limit = 20, offset = 0, status = null } = {}) {
    let query = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.subtotal,
        o.tax,
        o.shipping,
        o.total,
        o.payment_status,
        o.tracking_number,
        o.estimated_delivery,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
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

    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE user_id = $1';
    const countParams = [userId];

    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return {
      orders: result.rows,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: offset + limit < total
    };
  }

  // Update order status
  async updateOrderStatus(orderId, newStatus, notes = null, updatedBy = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update order status
      const orderQuery = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
      const orderResult = await client.query(orderQuery, [newStatus, orderId]);
      
      if (orderResult.rows.length === 0) {
        throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
      }

      // Add to status history
      await client.query(`
        INSERT INTO order_status_history (
          order_id, status, notes, created_by, created_at
        ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      `, [orderId, newStatus, notes, updatedBy]);

      await client.query('COMMIT');

      return orderResult.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Add tracking information
  async addTrackingInfo(orderId, trackingNumber, estimatedDelivery = null, updatedBy = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update order with tracking info
      const orderQuery = `
        UPDATE orders 
        SET tracking_number = $1, 
            estimated_delivery = $2, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $3 
        RETURNING *
      `;
      
      const orderResult = await client.query(orderQuery, [trackingNumber, estimatedDelivery, orderId]);
      
      if (orderResult.rows.length === 0) {
        throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
      }

      // Update status to shipped if not already
      if (orderResult.rows[0].status !== 'shipped') {
        await this.updateOrderStatus(orderId, 'shipped', 'Tracking number added', updatedBy);
      }

      await client.query('COMMIT');

      return orderResult.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Create payment record
  async createPaymentRecord(orderId, paymentData) {
    const query = `
      INSERT INTO payments (
        order_id, payment_method, payment_gateway, gateway_transaction_id,
        amount, currency, status, gateway_response, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const params = [
      orderId,
      paymentData.paymentMethod,
      paymentData.gateway,
      paymentData.transactionId,
      paymentData.amount,
      paymentData.currency || 'ZAR',
      paymentData.status,
      JSON.stringify(paymentData.gatewayResponse || {})
    ];

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus, paymentReference = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update order payment status
      const orderQuery = `
        UPDATE orders 
        SET payment_status = $1, 
            payment_reference = $2,
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $3 
        RETURNING *
      `;
      
      const orderResult = await client.query(orderQuery, [paymentStatus, paymentReference, orderId]);
      
      if (orderResult.rows.length === 0) {
        throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
      }

      // If payment is successful, update order status to confirmed
      if (paymentStatus === 'paid' && orderResult.rows[0].status === 'pending') {
        await this.updateOrderStatus(orderId, 'confirmed', 'Payment received');
      }

      await client.query('COMMIT');

      return orderResult.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get orders summary/stats
  async getOrderStats(userId = null) {
    let baseQuery = 'FROM orders';
    let params = [];
    
    if (userId) {
      baseQuery += ' WHERE user_id = $1';
      params = [userId];
    }

    const statsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        SUM(CASE WHEN status NOT IN ('cancelled', 'refunded') THEN total ELSE 0 END) as total_revenue
      ${baseQuery}
    `;

    const result = await pool.query(statsQuery, params);
    return result.rows[0];
  }
}

export default new OrderService();