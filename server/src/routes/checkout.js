import express from 'express';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_');

// Create payment intent
router.post('/create-payment-intent', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: 'zar',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user.id,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Validate promo code
router.post('/validate-promo', async (req, res) => {
  try {
    const { code } = req.body;
    
    // Query promo codes from database
    const result = await pool.query(
      `SELECT * FROM promo_codes 
       WHERE code = $1 
       AND active = true 
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (usage_limit IS NULL OR usage_count < usage_limit)`,
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Invalid or expired promo code' 
      });
    }

    const promo = result.rows[0];
    
    res.json({
      valid: true,
      discount_type: promo.discount_type, // 'percentage' or 'fixed'
      discount_value: promo.discount_value,
      message: `Promo code applied: ${promo.description}`
    });
  } catch (error) {
    console.error('Promo validation error:', error);
    res.status(500).json({ error: 'Failed to validate promo code' });
  }
});

// Calculate shipping rates
router.post('/calculate-shipping', async (req, res) => {
  try {
    const { address, items } = req.body;
    
    // Calculate total weight
    const itemIds = items.map(item => item.id);
    const products = await pool.query(
      'SELECT id, weight FROM products WHERE id = ANY($1)',
      [itemIds]
    );
    
    const totalWeight = items.reduce((sum, item) => {
      const product = products.rows.find(p => p.id === item.id);
      return sum + (product?.weight || 0) * item.quantity;
    }, 0);

    // Calculate shipping rates based on location and weight
    const rates = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        price: calculateStandardShipping(address, totalWeight),
        estimatedDays: '5-7 business days'
      },
      {
        id: 'express',
        name: 'Express Shipping',
        price: calculateExpressShipping(address, totalWeight),
        estimatedDays: '2-3 business days'
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        price: calculateOvernightShipping(address, totalWeight),
        estimatedDays: '1 business day'
      }
    ];

    res.json({ rates });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate shipping' });
  }
});

// Helper functions for shipping calculation
function calculateStandardShipping(address, weight) {
  const baseRate = 50;
  const weightRate = weight * 0.5;
  return Math.round(baseRate + weightRate);
}

function calculateExpressShipping(address, weight) {
  const baseRate = 150;
  const weightRate = weight * 0.75;
  return Math.round(baseRate + weightRate);
}

function calculateOvernightShipping(address, weight) {
  const baseRate = 300;
  const weightRate = weight * 1;
  return Math.round(baseRate + weightRate);
}

// Calculate tax
router.post('/calculate-tax', async (req, res) => {
  try {
    const { subtotal, address } = req.body;
    
    // South African VAT is 15%
    const vatRate = 0.15;
    const tax = subtotal * vatRate;
    
    res.json({
      tax_rate: vatRate,
      tax_amount: tax,
      tax_name: 'VAT'
    });
  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate tax' });
  }
});

// Validate stock availability
router.post('/validate-stock', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { items } = req.body;
    const unavailable = [];

    for (const item of items) {
      const result = await client.query(
        'SELECT id, name, stock_quantity FROM products WHERE id = $1',
        [item.id]
      );

      if (result.rows.length === 0) {
        unavailable.push({
          id: item.id,
          reason: 'Product not found'
        });
      } else if (result.rows[0].stock_quantity < item.quantity) {
        unavailable.push({
          id: item.id,
          name: result.rows[0].name,
          available: result.rows[0].stock_quantity,
          requested: item.quantity,
          reason: 'Insufficient stock'
        });
      }
    }

    if (unavailable.length > 0) {
      return res.status(400).json({
        available: false,
        unavailable_items: unavailable
      });
    }

    res.json({ available: true });
  } catch (error) {
    console.error('Stock validation error:', error);
    res.status(500).json({ error: 'Failed to validate stock' });
  } finally {
    client.release();
  }
});

// Reserve stock for checkout
router.post('/reserve-stock', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const { items } = req.body;
    const reservationId = generateReservationId();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    for (const item of items) {
      // Check and update stock
      const result = await client.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity - $1
         WHERE id = $2 AND stock_quantity >= $1
         RETURNING id`,
        [item.quantity, item.id]
      );

      if (result.rowCount === 0) {
        throw new Error(`Insufficient stock for product ${item.id}`);
      }

      // Create reservation record
      await client.query(
        `INSERT INTO stock_reservations 
         (reservation_id, product_id, quantity, user_id, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [reservationId, item.id, item.quantity, req.user.id, expiresAt]
      );
    }

    await client.query('COMMIT');
    
    res.json({
      reservation_id: reservationId,
      expires_at: expiresAt
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Stock reservation error:', error);
    res.status(500).json({ error: 'Failed to reserve stock' });
  } finally {
    client.release();
  }
});

// Release stock reservation
router.post('/release-stock', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const { reservationId } = req.body;

    // Get reservation details
    const reservations = await client.query(
      'SELECT * FROM stock_reservations WHERE reservation_id = $1',
      [reservationId]
    );

    // Return stock to inventory
    for (const reservation of reservations.rows) {
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
        [reservation.quantity, reservation.product_id]
      );
    }

    // Delete reservation
    await client.query(
      'DELETE FROM stock_reservations WHERE reservation_id = $1',
      [reservationId]
    );

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Stock release error:', error);
    res.status(500).json({ error: 'Failed to release stock' });
  } finally {
    client.release();
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleSuccessfulPayment(paymentIntent) {
  // Update order status
  await pool.query(
    'UPDATE orders SET payment_status = $1, stripe_payment_intent = $2 WHERE id = $3',
    ['paid', paymentIntent.id, paymentIntent.metadata.orderId]
  );
  
  // Send confirmation email
  // await sendOrderConfirmationEmail(paymentIntent.metadata.orderId);
}

async function handleFailedPayment(paymentIntent) {
  // Update order status
  await pool.query(
    'UPDATE orders SET payment_status = $1 WHERE id = $2',
    ['failed', paymentIntent.metadata.orderId]
  );
  
  // Release stock reservation
  // await releaseStockReservation(paymentIntent.metadata.orderId);
}

function generateReservationId() {
  return 'RES-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

export default router;
