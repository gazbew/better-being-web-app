import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/enhanced-auth.js';
import { generalLimiter, authLimiter } from '../middleware/security.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { body, param, query, validationResult } from 'express-validator';
import crypto from 'crypto';

// Initialize Paystack service conditionally
let PaystackService = null;
try {
  if (process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_WEBHOOK_SECRET) {
    const paystackModule = await import('../services/paystack.service.js');
    PaystackService = paystackModule.default;
  }
} catch (error) {
  console.warn('Paystack service not available:', error.message);
}

const router = express.Router();

// Apply rate limiting
router.use(generalLimiter);

// Validation middleware
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

const validateReference = [
  param('reference').notEmpty().withMessage('Payment reference required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment reference'
      });
    }
    next();
  }
];

/**
 * @route POST /api/payments/initialize/:orderId
 * @desc Initialize payment for an order
 * @access Private
 */
router.post('/initialize/:orderId',
  authenticateToken,
  authLimiter,
  validateOrderId,
  asyncHandler(async (req, res) => {
    if (!PaystackService) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured'
      });
    }

    const userId = req.user.id;
    const orderId = req.orderId;

    const paymentData = await PaystackService.initializePayment(orderId, userId);

    res.json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        authorization_url: paymentData.authorization_url,
        access_code: paymentData.access_code,
        reference: paymentData.reference
      }
    });
  })
);

/**
 * @route GET /api/payments/verify/:reference
 * @desc Verify payment transaction
 * @access Private
 */
router.get('/verify/:reference',
  authenticateToken,
  validateReference,
  asyncHandler(async (req, res) => {
    if (!PaystackService) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured'
      });
    }

    const reference = req.params.reference;

    const transaction = await PaystackService.verifyPayment(reference);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      transaction: {
        reference: transaction.reference,
        status: transaction.status,
        amount: transaction.amount / 100, // Convert from kobo
        currency: transaction.currency,
        channel: transaction.channel,
        paid_at: transaction.paid_at,
        metadata: transaction.metadata
      }
    });
  })
);

/**
 * @route GET /api/payments/callback
 * @desc Handle payment callback from Paystack
 * @access Public
 */
router.get('/callback', 
  asyncHandler(async (req, res) => {
    const { reference, trxref } = req.query;
    const paymentReference = reference || trxref;

    if (!paymentReference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference not provided'
      });
    }

    try {
      const result = await PaystackService.handlePaymentCallback(paymentReference);

      if (result.success) {
        // Redirect to success page
        return res.redirect(`${process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173'}/payment/success?reference=${paymentReference}&order=${result.order.order_number}`);
      } else {
        // Redirect to failure page
        return res.redirect(`${process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173'}/payment/failed?reference=${paymentReference}&reason=${result.transaction.gateway_response || 'Payment failed'}`);
      }
    } catch (error) {
      console.error('Payment callback error:', error);
      return res.redirect(`${process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173'}/payment/error?reference=${paymentReference}&error=${error.message}`);
    }
  })
);

/**
 * @route POST /api/payments/webhook
 * @desc Handle Paystack webhooks
 * @access Public
 */
router.post('/webhook', 
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const signature = req.get('x-paystack-signature');
    const payload = req.body;

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing webhook signature'
      });
    }

    try {
      // Parse the payload
      const parsedPayload = JSON.parse(payload);
      
      // Process the webhook
      const result = await PaystackService.handleWebhook(parsedPayload, signature);

      console.log('Webhook processed:', result);

      res.json({
        success: true,
        message: 'Webhook processed successfully',
        result
      });

    } catch (error) {
      console.error('Webhook processing error:', error);
      
      res.status(400).json({
        success: false,
        message: 'Webhook processing failed',
        error: error.message
      });
    }
  })
);

/**
 * @route GET /api/payments/status/:reference  
 * @desc Get payment status
 * @access Private
 */
router.get('/status/:reference', 
  authenticateToken,
  validateReference,
  asyncHandler(async (req, res) => {
    const reference = req.params.reference;

    const paymentStatus = await PaystackService.getPaymentStatus(reference);

    res.json({
      success: true,
      payment: paymentStatus
    });
  })
);

/**
 * @route GET /api/payments/order/:orderId
 * @desc Get all transactions for an order
 * @access Private  
 */
router.get('/order/:orderId',
  authenticateToken,
  validateOrderId,
  asyncHandler(async (req, res) => {
    const orderId = req.orderId;

    const transactions = await PaystackService.getOrderTransactions(orderId);

    res.json({
      success: true,
      transactions
    });
  })
);

/**
 * @route POST /api/payments/refund/:reference
 * @desc Create refund for a transaction
 * @access Private (admin)
 */
router.post('/refund/:reference',
  authenticateToken,
  validateReference,
  [
    body('amount').optional().isNumeric().withMessage('Amount must be numeric'),
    body('reason').optional().isLength({ max: 500 }).withMessage('Reason too long'),
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
    const reference = req.params.reference;
    const { amount, reason } = req.body;

    const refund = await PaystackService.createRefund(reference, amount, reason);

    res.json({
      success: true,
      message: 'Refund created successfully',
      refund
    });
  })
);

/**
 * @route GET /api/payments/config
 * @desc Get payment configuration for frontend
 * @access Public
 */
router.get('/config',
  asyncHandler(async (req, res) => {
    if (!PaystackService) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured',
        config: {
          publicKey: null,
          supportedCurrencies: [],
          supportedChannels: [],
          testMode: false
        }
      });
    }

    const options = PaystackService.getSupportedOptions();

    res.json({
      success: true,
      config: {
        publicKey: process.env.PAYSTACK_PUBLIC_KEY,
        supportedCurrencies: options.currencies,
        supportedChannels: options.channels,
        testMode: options.testMode
      }
    });
  })
);

export default router;