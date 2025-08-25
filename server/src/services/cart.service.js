import pool from '../config/database.js';
import ProductService from './product.service.js';
import { AppError } from '../middleware/error-handler.js';

class CartService {
  
  // Get user's cart
  async getCart(userId, sessionId = null) {
    let query, params;

    if (userId) {
      query = `
        SELECT 
          ci.*,
          p.name as product_name,
          p.description as product_description,
          p.image_url as product_image,
          p.price as product_price,
          p.original_price as product_original_price,
          p.in_stock as product_in_stock,
          p.stock_count as product_stock_count,
          ps.size as size_name,
          ps.price as size_price,
          ps.original_price as size_original_price,
          ps.in_stock as size_in_stock,
          ps.stock_count as size_stock_count,
          c.name as category_name
        FROM cart_items ci
        JOIN carts cart ON ci.cart_id = cart.id
        JOIN products p ON ci.product_id = p.id
        LEFT JOIN product_sizes ps ON ci.size_id = ps.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE cart.user_id = $1
        ORDER BY ci.created_at DESC
      `;
      params = [userId];
    } else if (sessionId) {
      query = `
        SELECT 
          ci.*,
          p.name as product_name,
          p.description as product_description,
          p.image_url as product_image,
          p.price as product_price,
          p.original_price as product_original_price,
          p.in_stock as product_in_stock,
          p.stock_count as product_stock_count,
          ps.size as size_name,
          ps.price as size_price,
          ps.original_price as size_original_price,
          ps.in_stock as size_in_stock,
          ps.stock_count as size_stock_count,
          c.name as category_name
        FROM cart_items ci
        JOIN carts cart ON ci.cart_id = cart.id
        JOIN products p ON ci.product_id = p.id
        LEFT JOIN product_sizes ps ON ci.size_id = ps.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE cart.session_id = $1
        ORDER BY ci.created_at DESC
      `;
      params = [sessionId];
    } else {
      throw new AppError('User ID or Session ID required', 400, 'MISSING_IDENTIFIER');
    }

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

  // Get or create cart
  async getOrCreateCart(userId, sessionId = null) {
    let cart;

    if (userId) {
      // Look for user cart
      const userCartResult = await pool.query(
        'SELECT * FROM carts WHERE user_id = $1',
        [userId]
      );

      if (userCartResult.rows.length > 0) {
        cart = userCartResult.rows[0];
      } else {
        // Create new user cart
        const newCartResult = await pool.query(
          'INSERT INTO carts (user_id, created_at, updated_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
          [userId]
        );
        cart = newCartResult.rows[0];
      }

      // If there's a session cart, merge it with user cart
      if (sessionId) {
        await this.mergeSessionCartToUser(userId, sessionId);
      }
    } else if (sessionId) {
      // Look for session cart
      const sessionCartResult = await pool.query(
        'SELECT * FROM carts WHERE session_id = $1',
        [sessionId]
      );

      if (sessionCartResult.rows.length > 0) {
        cart = sessionCartResult.rows[0];
      } else {
        // Create new session cart
        const newCartResult = await pool.query(
          'INSERT INTO carts (session_id, created_at, updated_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
          [sessionId]
        );
        cart = newCartResult.rows[0];
      }
    } else {
      throw new AppError('User ID or Session ID required', 400, 'MISSING_IDENTIFIER');
    }

    return cart;
  }

  // Add item to cart
  async addItem(userId, sessionId, { productId, sizeId = null, quantity = 1 }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Validate product and size
      const product = await ProductService.getProductById(productId);
      if (!product) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      // Check stock availability
      const stockCheck = await ProductService.checkStockAvailability([
        { productId, sizeId, quantity }
      ]);

      if (!stockCheck[0].available) {
        throw new AppError(
          stockCheck[0].reason,
          409,
          'INSUFFICIENT_STOCK',
          { availableQuantity: stockCheck[0].availableQuantity }
        );
      }

      // Get or create cart
      const cart = await this.getOrCreateCart(userId, sessionId);

      // Check if item already exists in cart
      let existingItemQuery = 'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2';
      let existingItemParams = [cart.id, productId];

      if (sizeId) {
        existingItemQuery += ' AND size_id = $3';
        existingItemParams.push(sizeId);
      } else {
        existingItemQuery += ' AND size_id IS NULL';
      }

      const existingItemResult = await client.query(existingItemQuery, existingItemParams);

      if (existingItemResult.rows.length > 0) {
        // Update existing item
        const existingItem = existingItemResult.rows[0];
        const newQuantity = existingItem.quantity + quantity;

        // Check if new quantity is available
        const newStockCheck = await ProductService.checkStockAvailability([
          { productId, sizeId, quantity: newQuantity }
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
          'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [newQuantity, existingItem.id]
        );
      } else {
        // Add new item
        let insertQuery = 'INSERT INTO cart_items (cart_id, product_id, size_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
        let insertParams = [cart.id, productId, sizeId, quantity];

        await client.query(insertQuery, insertParams);
      }

      // Update cart timestamp
      await client.query(
        'UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [cart.id]
      );

      await client.query('COMMIT');

      // Return updated cart
      return this.getCart(userId, sessionId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Update cart item quantity
  async updateItemQuantity(userId, sessionId, itemId, quantity) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      if (quantity <= 0) {
        return this.removeItem(userId, sessionId, itemId);
      }

      // Get cart item
      let cartQuery = userId 
        ? 'SELECT ci.*, c.user_id FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE ci.id = $1 AND c.user_id = $2'
        : 'SELECT ci.*, c.session_id FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE ci.id = $1 AND c.session_id = $2';
      
      const identifier = userId || sessionId;
      const cartItemResult = await client.query(cartQuery, [itemId, identifier]);

      if (cartItemResult.rows.length === 0) {
        throw new AppError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');
      }

      const cartItem = cartItemResult.rows[0];

      // Check stock availability
      const stockCheck = await ProductService.checkStockAvailability([
        { 
          productId: cartItem.product_id, 
          sizeId: cartItem.size_id, 
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
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [quantity, itemId]
      );

      // Update cart timestamp
      await client.query(
        'UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [cartItem.cart_id]
      );

      await client.query('COMMIT');

      return this.getCart(userId, sessionId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Remove item from cart
  async removeItem(userId, sessionId, itemId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Verify item belongs to user/session
      let cartQuery = userId 
        ? 'SELECT ci.*, c.user_id FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE ci.id = $1 AND c.user_id = $2'
        : 'SELECT ci.*, c.session_id FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE ci.id = $1 AND c.session_id = $2';
      
      const identifier = userId || sessionId;
      const cartItemResult = await client.query(cartQuery, [itemId, identifier]);

      if (cartItemResult.rows.length === 0) {
        throw new AppError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');
      }

      const cartItem = cartItemResult.rows[0];

      // Remove item
      await client.query('DELETE FROM cart_items WHERE id = $1', [itemId]);

      // Update cart timestamp
      await client.query(
        'UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [cartItem.cart_id]
      );

      await client.query('COMMIT');

      return this.getCart(userId, sessionId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Clear entire cart
  async clearCart(userId, sessionId) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cart.id]);
    await pool.query(
      'UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [cart.id]
    );

    return this.getCart(userId, sessionId);
  }

  // Merge session cart to user cart when user logs in
  async mergeSessionCartToUser(userId, sessionId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get session cart
      const sessionCartResult = await client.query(
        'SELECT * FROM carts WHERE session_id = $1',
        [sessionId]
      );

      if (sessionCartResult.rows.length === 0) {
        await client.query('COMMIT');
        return;
      }

      const sessionCart = sessionCartResult.rows[0];

      // Get or create user cart
      const userCart = await this.getOrCreateCart(userId);

      // Get session cart items
      const sessionItemsResult = await client.query(
        'SELECT * FROM cart_items WHERE cart_id = $1',
        [sessionCart.id]
      );

      // Merge each item
      for (const sessionItem of sessionItemsResult.rows) {
        // Check if item exists in user cart
        let existingQuery = 'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2';
        let existingParams = [userCart.id, sessionItem.product_id];

        if (sessionItem.size_id) {
          existingQuery += ' AND size_id = $3';
          existingParams.push(sessionItem.size_id);
        } else {
          existingQuery += ' AND size_id IS NULL';
        }

        const existingItemResult = await client.query(existingQuery, existingParams);

        if (existingItemResult.rows.length > 0) {
          // Update existing item (add quantities)
          const existingItem = existingItemResult.rows[0];
          const newQuantity = existingItem.quantity + sessionItem.quantity;

          await client.query(
            'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [newQuantity, existingItem.id]
          );
        } else {
          // Add new item to user cart
          await client.query(
            'INSERT INTO cart_items (cart_id, product_id, size_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
            [userCart.id, sessionItem.product_id, sessionItem.size_id, sessionItem.quantity, sessionItem.created_at, sessionItem.updated_at]
          );
        }
      }

      // Delete session cart and its items
      await client.query('DELETE FROM cart_items WHERE cart_id = $1', [sessionCart.id]);
      await client.query('DELETE FROM carts WHERE id = $1', [sessionCart.id]);

      // Update user cart timestamp
      await client.query(
        'UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [userCart.id]
      );

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
      const price = item.size_price || item.product_price;
      const originalPrice = item.size_original_price || item.product_original_price;
      const quantity = item.quantity;

      const itemTotal = parseFloat(price.replace('R', '').replace(',', '')) * quantity;
      const itemOriginalTotal = parseFloat(originalPrice.replace('R', '').replace(',', '')) * quantity;

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
      subtotal: subtotal.toFixed(2),
      originalTotal: originalTotal.toFixed(2),
      savings: totalSavings.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shippingCost.toFixed(2),
      total: finalTotal.toFixed(2),
      quantity: totalQuantity,
      itemCount: items.length,
      freeShippingEligible: subtotal >= shippingThreshold,
      freeShippingRemaining: subtotal >= shippingThreshold ? 0 : (shippingThreshold - subtotal).toFixed(2)
    };
  }

  // Validate cart for checkout
  async validateCartForCheckout(userId, sessionId) {
    const cart = await this.getCart(userId, sessionId);
    
    if (cart.isEmpty) {
      throw new AppError('Cart is empty', 400, 'EMPTY_CART');
    }

    // Check stock availability for all items
    const stockChecks = cart.items.map(item => ({
      productId: item.product_id,
      sizeId: item.size_id,
      quantity: item.quantity
    }));

    const availability = await ProductService.checkStockAvailability(stockChecks);
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
  async getCartCount(userId, sessionId) {
    const cart = await this.getCart(userId, sessionId);
    return {
      itemCount: cart.summary.itemCount,
      totalQuantity: cart.summary.quantity
    };
  }

  // Clean up old session carts (run periodically)
  async cleanupOldSessionCarts(olderThanDays = 30) {
    const query = `
      DELETE FROM carts 
      WHERE session_id IS NOT NULL 
        AND user_id IS NULL 
        AND updated_at < NOW() - INTERVAL '${olderThanDays} days'
    `;
    
    const result = await pool.query(query);
    return result.rowCount;
  }
}

export default new CartService();