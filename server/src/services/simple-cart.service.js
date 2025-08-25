import pool from '../config/database.js';
import SimpleProductService from './simple-product.service.js';
import { AppError } from '../middleware/error-handler.js';

class SimpleCartService {
  
  // Get user's cart (using existing cart table from schema.sql)
  async getCart(userId, sessionId = null) {
    if (!userId) {
      // For now, session-based carts are not supported with current schema
      // Return empty cart for unauthenticated users
      return {
        items: [],
        summary: this.calculateCartSummary([]),
        isEmpty: true
      };
    }

    const query = `
      SELECT 
        c.*,
        p.name as product_name,
        p.description as product_description,
        p.image_url as product_image,
        p.price as product_price,
        p.original_price as product_original_price,
        p.in_stock as product_in_stock,
        p.stock_count as product_stock_count,
        cat.name as category_name
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;
    const params = [userId];

    const result = await pool.query(query, params);
    
    // Calculate totals
    const items = result.rows;
    const summary = this.calculateCartSummary(items);

    return {
      items,
      summary,
      isEmpty: items.length === 0
    };
  }

  // Add item to cart (authenticated users only)
  async addItem(userId, sessionId, { productId, quantity = 1 }) {
    if (!userId) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Validate product
      const product = await SimpleProductService.getProductById(productId);
      if (!product) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      // Check stock availability
      const stockCheck = await SimpleProductService.checkStockAvailability([
        { productId, quantity }
      ]);

      if (!stockCheck[0].available) {
        throw new AppError(
          stockCheck[0].reason,
          409,
          'INSUFFICIENT_STOCK',
          { availableQuantity: stockCheck[0].availableQuantity }
        );
      }

      // Check if item already exists in cart
      const existingItemQuery = 'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2';
      const existingItemParams = [userId, productId];

      const existingItemResult = await client.query(existingItemQuery, existingItemParams);

      if (existingItemResult.rows.length > 0) {
        // Update existing item
        const existingItem = existingItemResult.rows[0];
        const newQuantity = existingItem.quantity + quantity;

        // Check if new quantity is available
        const newStockCheck = await SimpleProductService.checkStockAvailability([
          { productId, quantity: newQuantity }
        ]);

        if (!newStockCheck[0].available) {
          throw new AppError(
            `Cannot add ${quantity} items. ${newStockCheck[0].reason}`,
            409,
            'INSUFFICIENT_STOCK',
            { 
              availableQuantity: newStockCheck[0].availableQuantity,
              currentQuantity: existingItem.quantity
            }
          );
        }

        await client.query(
          'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [newQuantity, existingItem.id]
        );
      } else {
        // Add new item
        const insertQuery = 'INSERT INTO cart (user_id, product_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
        const insertParams = [userId, productId, quantity];
        await client.query(insertQuery, insertParams);
      }

      await client.query('COMMIT');

      // Return updated cart
      return this.getCart(userId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Update cart item quantity (authenticated users only)
  async updateItemQuantity(userId, sessionId, itemId, quantity) {
    if (!userId) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      if (quantity <= 0) {
        return this.removeItem(userId, sessionId, itemId);
      }

      // Get cart item
      const cartQuery = 'SELECT * FROM cart WHERE id = $1 AND user_id = $2';
      const cartItemResult = await client.query(cartQuery, [itemId, userId]);

      if (cartItemResult.rows.length === 0) {
        throw new AppError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');
      }

      const cartItem = cartItemResult.rows[0];

      // Check stock availability
      const stockCheck = await SimpleProductService.checkStockAvailability([
        { 
          productId: cartItem.product_id, 
          quantity 
        }
      ]);

      if (!stockCheck[0].available) {
        throw new AppError(
          stockCheck[0].reason,
          409,
          'INSUFFICIENT_STOCK',
          { availableQuantity: stockCheck[0].availableQuantity }
        );
      }

      // Update quantity
      await client.query(
        'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [quantity, itemId]
      );

      await client.query('COMMIT');

      return this.getCart(userId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Remove item from cart (authenticated users only)
  async removeItem(userId, sessionId, itemId) {
    if (!userId) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    // Verify item belongs to user
    const cartQuery = 'SELECT * FROM cart WHERE id = $1 AND user_id = $2';
    const cartItemResult = await pool.query(cartQuery, [itemId, userId]);

    if (cartItemResult.rows.length === 0) {
      throw new AppError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');
    }

    // Remove item
    await pool.query('DELETE FROM cart WHERE id = $1', [itemId]);

    return this.getCart(userId);
  }

  // Clear entire cart (authenticated users only)
  async clearCart(userId, sessionId) {
    if (!userId) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    return this.getCart(userId);
  }

  // Merge session cart to user cart when user logs in
  async mergeSessionCartToUser(userId, sessionId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get session cart items
      const sessionItemsResult = await client.query(
        'SELECT * FROM cart WHERE session_id = $1',
        [sessionId]
      );

      if (sessionItemsResult.rows.length === 0) {
        await client.query('COMMIT');
        return;
      }

      // Merge each item
      for (const sessionItem of sessionItemsResult.rows) {
        // Check if item exists in user cart
        const existingItemResult = await client.query(
          'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
          [userId, sessionItem.product_id]
        );

        if (existingItemResult.rows.length > 0) {
          // Update existing item (add quantities)
          const existingItem = existingItemResult.rows[0];
          const newQuantity = existingItem.quantity + sessionItem.quantity;

          await client.query(
            'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [newQuantity, existingItem.id]
          );
        } else {
          // Add new item to user cart
          await client.query(
            'INSERT INTO cart (user_id, product_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
            [userId, sessionItem.product_id, sessionItem.quantity, sessionItem.created_at, sessionItem.updated_at]
          );
        }
      }

      // Delete session cart items
      await client.query('DELETE FROM cart WHERE session_id = $1', [sessionId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Calculate cart summary
  calculateCartSummary(items) {
    let subtotal = 0;
    let originalTotal = 0;
    let totalQuantity = 0;
    let totalSavings = 0;

    items.forEach(item => {
      const price = parseFloat(item.product_price || 0);
      const originalPrice = parseFloat(item.product_original_price || item.product_price || 0);
      const quantity = item.quantity;

      const itemTotal = price * quantity;
      const itemOriginalTotal = originalPrice * quantity;

      subtotal += itemTotal;
      originalTotal += itemOriginalTotal;
      totalQuantity += quantity;
    });

    totalSavings = originalTotal - subtotal;

    // Calculate tax (15% VAT)
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    // Calculate shipping (free over R500)
    const shippingThreshold = 500;
    const shippingCost = subtotal >= shippingThreshold ? 0 : 75;
    const finalTotal = total + shippingCost;

    return {
      subtotal: `R${subtotal.toFixed(2)}`,
      originalTotal: `R${originalTotal.toFixed(2)}`,
      savings: `R${totalSavings.toFixed(2)}`,
      tax: `R${tax.toFixed(2)}`,
      shipping: `R${shippingCost.toFixed(2)}`,
      total: `R${finalTotal.toFixed(2)}`,
      quantity: totalQuantity,
      itemCount: items.length,
      freeShippingEligible: subtotal >= shippingThreshold,
      freeShippingRemaining: subtotal >= shippingThreshold ? 0 : (shippingThreshold - subtotal).toFixed(2)
    };
  }

  // Validate cart for checkout
  async validateCartForCheckout(userId) {
    const cart = await this.getCart(userId);
    
    if (cart.isEmpty) {
      throw new AppError('Cart is empty', 400, 'EMPTY_CART');
    }

    // Check stock availability for all items
    const stockChecks = cart.items.map(item => ({
      productId: item.product_id,
      quantity: item.quantity
    }));

    const availability = await SimpleProductService.checkStockAvailability(stockChecks);
    const unavailableItems = availability.filter(check => !check.available);

    if (unavailableItems.length > 0) {
      throw new AppError(
        'Some items in your cart are no longer available',
        409,
        'CART_VALIDATION_FAILED',
        { unavailableItems }
      );
    }

    return {
      valid: true,
      cart,
      availability
    };
  }

  // Get cart count for user
  async getCartCount(userId) {
    const cart = await this.getCart(userId);
    return {
      itemCount: cart.summary.itemCount,
      totalQuantity: cart.summary.quantity
    };
  }

  // Clean up old session carts (run periodically)
  async cleanupOldSessionCarts(olderThanDays = 30) {
    const query = `
      DELETE FROM cart 
      WHERE session_id IS NOT NULL 
        AND user_id IS NULL 
        AND updated_at < NOW() - INTERVAL '${olderThanDays} days'
    `;
    
    const result = await pool.query(query);
    return result.rowCount;
  }
}

export default new SimpleCartService();