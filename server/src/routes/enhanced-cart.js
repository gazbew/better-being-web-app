import express from 'express';
import CartService from '../services/simple-cart.service.js';
import { authenticateToken, optionalAuth } from '../middleware/enhanced-auth.js';
import { generalLimiter, authLimiter } from '../middleware/security.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Apply rate limiting
router.use(generalLimiter);

// Session management middleware
const handleSession = (req, res, next) => {
  // Get session ID from cookie or create new one
  let sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
  
  req.sessionId = sessionId;
  next();
};

// Apply session handling to all routes
router.use(handleSession);

// Validation middleware
const validateAddItem = [
  body('productId').isInt({ min: 1 }).withMessage('Valid product ID required'),
  body('quantity').isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99'),
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

const validateUpdateQuantity = [
  body('quantity').isInt({ min: 0, max: 99 }).withMessage('Quantity must be between 0 and 99'),
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

const validateCartItemId = (req, res, next) => {
  const itemId = parseInt(req.params.itemId);
  if (isNaN(itemId) || itemId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid cart item ID'
    });
  }
  req.cartItemId = itemId;
  next();
};

/**
 * @route GET /api/cart
 * @desc Get user's shopping cart
 * @access Private (authentication required)
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await CartService.getCart(userId);

  res.json({
    success: true,
    cart,
    authenticated: true
  });
}));

/**
 * @route GET /api/cart/count
 * @desc Get cart item count (for navbar badge)
 * @access Private (authentication required)
 */
router.get('/count', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const count = await CartService.getCartCount(userId);

  res.json({
    success: true,
    ...count
  });
}));

/**
 * @route POST /api/cart/items
 * @desc Add item to cart
 * @access Private (authentication required)
 */
router.post('/items', 
  authenticateToken,
  authLimiter, // Prevent cart spam
  validateAddItem,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    const cart = await CartService.addItem(userId, null, {
      productId,
      quantity
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  })
);

/**
 * @route PUT /api/cart/items/:itemId
 * @desc Update cart item quantity
 * @access Private (authentication required)
 */
router.put('/items/:itemId',
  authenticateToken,
  validateCartItemId,
  validateUpdateQuantity,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { quantity } = req.body;

    const cart = await CartService.updateItemQuantity(
      userId, 
      null, 
      req.cartItemId, 
      quantity
    );

    res.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
      cart
    });
  })
);

/**
 * @route DELETE /api/cart/items/:itemId
 * @desc Remove item from cart
 * @access Private (authentication required)
 */
router.delete('/items/:itemId',
  authenticateToken,
  validateCartItemId,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await CartService.removeItem(userId, null, req.cartItemId);

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  })
);

/**
 * @route DELETE /api/cart
 * @desc Clear entire cart
 * @access Private (authentication required)
 */
router.delete('/', 
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await CartService.clearCart(userId);

    res.json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  })
);

/**
 * @route POST /api/cart/validate
 * @desc Validate cart for checkout
 * @access Private (authentication required)
 */
router.post('/validate', 
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const validation = await CartService.validateCartForCheckout(userId);

    res.json({
      success: true,
      ...validation
    });
  })
);

/**
 * @route POST /api/cart/merge
 * @desc Merge session cart to user cart (called after login)
 * @access Private
 */
router.post('/merge',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const sessionId = req.sessionId;

    await CartService.mergeSessionCartToUser(userId, sessionId);
    
    // Get the merged cart
    const cart = await CartService.getCart(userId);

    res.json({
      success: true,
      message: 'Cart merged successfully',
      cart
    });
  })
);

/**
 * @route GET /api/cart/summary
 * @desc Get cart summary (for quick display)
 * @access Private (authentication required)
 */
router.get('/summary', 
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await CartService.getCart(userId);

    res.json({
      success: true,
      summary: cart.summary,
      isEmpty: cart.isEmpty,
      itemCount: cart.items.length
    });
  })
);

/**
 * @route POST /api/cart/bulk-add
 * @desc Add multiple items to cart at once
 * @access Private (authentication required)
 */
router.post('/bulk-add',
  authenticateToken,
  authLimiter,
  [
    body('items').isArray({ min: 1, max: 10 }).withMessage('Items must be an array with 1-10 items'),
    body('items.*.productId').isInt({ min: 1 }).withMessage('Valid product ID required'),
    body('items.*.quantity').isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99'),
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
    const userId = req.user.id;
    const { items } = req.body;

    const results = [];
    const errors = [];

    // Add items one by one
    for (const item of items) {
      try {
        await CartService.addItem(userId, null, item);
        results.push({
          productId: item.productId,
          quantity: item.quantity,
          success: true
        });
      } catch (error) {
        errors.push({
          productId: item.productId,
          quantity: item.quantity,
          success: false,
          error: error.message
        });
      }
    }

    // Get updated cart
    const cart = await CartService.getCart(userId);

    res.json({
      success: errors.length === 0,
      message: errors.length === 0 
        ? 'All items added successfully' 
        : `${results.filter(r => r.success).length} of ${items.length} items added`,
      cart,
      results,
      errors
    });
  })
);

export default router;