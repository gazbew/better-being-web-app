import express from 'express';
import OrderService from '../services/order.service.js';
import { authenticateToken } from '../middleware/enhanced-auth.js';
import { generalLimiter, authLimiter } from '../middleware/security.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { body, param, query, validationResult } from 'express-validator';

const router = express.Router();

// Apply rate limiting
router.use(generalLimiter);

// Validation middleware
const validateCreateOrder = [
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.recipientName').optional().isLength({ min: 2, max: 255 }).withMessage('Recipient name must be 2-255 characters'),
  body('shippingAddress.firstName').optional().isLength({ min: 1, max: 100 }).withMessage('First name required'),
  body('shippingAddress.lastName').optional().isLength({ min: 1, max: 100 }).withMessage('Last name required'),
  body('shippingAddress.phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('shippingAddress.streetAddress').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.province').notEmpty().withMessage('Province is required'),
  body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
  body('billingAddress').optional().isObject().withMessage('Billing address must be an object'),
  body('paymentMethod').optional().isIn(['card', 'eft', 'payfast', 'zapper', 'payjustnow']).withMessage('Invalid payment method'),
  body('customerNotes').optional().isLength({ max: 1000 }).withMessage('Customer notes too long'),
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

const validateOrderId = [
  param('orderId').isInt({ min: 1 }).withMessage('Valid order ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }
    req.orderId = parseInt(req.params.orderId);
    next();
  }
];

const validateOrderQuery = [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * @route POST /api/orders
 * @desc Create order from cart
 * @access Private
 */
router.post('/', 
  authenticateToken,
  authLimiter,
  validateCreateOrder,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const orderData = req.body;

    const order = await OrderService.createOrderFromCart(userId, orderData);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        total: order.total,
        createdAt: order.created_at
      }
    });
  })
);

/**
 * @route GET /api/orders
 * @desc Get user's order history
 * @access Private
 */
router.get('/', 
  authenticateToken,
  validateOrderQuery,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { limit = 20, offset = 0, status } = req.query;

    const result = await OrderService.getUserOrders(userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      status
    });

    res.json({
      success: true,
      ...result
    });
  })
);

/**
 * @route GET /api/orders/stats
 * @desc Get user's order statistics
 * @access Private
 */
router.get('/stats', 
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const stats = await OrderService.getOrderStats(userId);

    res.json({
      success: true,
      stats: {
        totalOrders: parseInt(stats.total_orders),
        pendingOrders: parseInt(stats.pending_orders),
        confirmedOrders: parseInt(stats.confirmed_orders),
        processingOrders: parseInt(stats.processing_orders),
        shippedOrders: parseInt(stats.shipped_orders),
        deliveredOrders: parseInt(stats.delivered_orders),
        cancelledOrders: parseInt(stats.cancelled_orders),
        totalRevenue: parseFloat(stats.total_revenue || 0)
      }
    });
  })
);

/**
 * @route GET /api/orders/:orderId
 * @desc Get single order details
 * @access Private
 */
router.get('/:orderId', 
  authenticateToken,
  validateOrderId,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const orderId = req.orderId;

    const order = await OrderService.getOrderById(orderId, userId);

    res.json({
      success: true,
      order
    });
  })
);

/**
 * @route PATCH /api/orders/:orderId/status
 * @desc Update order status (admin only for now, will add admin auth later)
 * @access Private
 */
router.patch('/:orderId/status', 
  authenticateToken,
  validateOrderId,
  [
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
    body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long'),
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
    const orderId = req.orderId;
    const { status, notes } = req.body;
    const updatedBy = req.user.id;

    const order = await OrderService.updateOrderStatus(orderId, status, notes, updatedBy);

    res.json({
      success: true,
      message: 'Order status updated',
      order: {
        id: order.id,
        status: order.status,
        updatedAt: order.updated_at
      }
    });
  })
);

/**
 * @route PATCH /api/orders/:orderId/tracking
 * @desc Add tracking information
 * @access Private (admin)
 */
router.patch('/:orderId/tracking', 
  authenticateToken,
  validateOrderId,
  [
    body('trackingNumber').notEmpty().withMessage('Tracking number is required'),
    body('estimatedDelivery').optional().isISO8601().toDate().withMessage('Invalid delivery date'),
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
    const orderId = req.orderId;
    const { trackingNumber, estimatedDelivery } = req.body;
    const updatedBy = req.user.id;

    const order = await OrderService.addTrackingInfo(
      orderId, 
      trackingNumber, 
      estimatedDelivery, 
      updatedBy
    );

    res.json({
      success: true,
      message: 'Tracking information added',
      order: {
        id: order.id,
        trackingNumber: order.tracking_number,
        estimatedDelivery: order.estimated_delivery,
        status: order.status
      }
    });
  })
);

/**
 * @route PATCH /api/orders/:orderId/payment
 * @desc Update payment status
 * @access Private (payment gateway webhook)
 */
router.patch('/:orderId/payment', 
  authenticateToken,
  validateOrderId,
  [
    body('paymentStatus').isIn(['pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded']).withMessage('Invalid payment status'),
    body('paymentReference').optional().isString().withMessage('Payment reference must be a string'),
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
    const orderId = req.orderId;
    const { paymentStatus, paymentReference } = req.body;

    const order = await OrderService.updatePaymentStatus(orderId, paymentStatus, paymentReference);

    res.json({
      success: true,
      message: 'Payment status updated',
      order: {
        id: order.id,
        paymentStatus: order.payment_status,
        paymentReference: order.payment_reference,
        status: order.status
      }
    });
  })
);

/**
 * @route POST /api/orders/:orderId/cancel
 * @desc Cancel an order
 * @access Private
 */
router.post('/:orderId/cancel', 
  authenticateToken,
  validateOrderId,
  [
    body('reason').optional().isLength({ max: 500 }).withMessage('Cancellation reason too long'),
  ],
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const orderId = req.orderId;
    const { reason } = req.body;

    // First verify the order belongs to the user and can be cancelled
    const order = await OrderService.getOrderById(orderId, userId);
    
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    const updatedOrder = await OrderService.updateOrderStatus(
      orderId, 
      'cancelled', 
      reason || 'Cancelled by customer', 
      userId
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updated_at
      }
    });
  })
);

export default router;