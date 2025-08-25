import axios from 'axios';
import pool from '../config/database.js';
import OrderService from './order.service.js';
import { AppError } from '../middleware/error-handler.js';

class PaystackService {
  constructor() {
    // SECURITY: Ensure required environment variables are set
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error('PAYSTACK_SECRET_KEY environment variable is required');
    }
    if (!process.env.PAYSTACK_WEBHOOK_SECRET) {
      throw new Error('PAYSTACK_WEBHOOK_SECRET environment variable is required');
    }

    // Initialize secure Paystack HTTP client
    this.paystackClient = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000, // 30 second timeout
      maxRedirects: 5
    });

    this.webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;
  }

  // Initialize payment transaction
  async initializePayment(orderId, userId) {
    try {
      // Get order details
      const order = await OrderService.getOrderById(orderId, userId);
      
      if (!order) {
        throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
      }

      if (order.payment_status === 'paid') {
        throw new AppError('Order already paid', 400, 'ORDER_ALREADY_PAID');
      }

      // Convert amount to kobo (Paystack uses kobo for ZAR)
      const amountInKobo = Math.round(parseFloat(order.total) * 100);

      // Prepare payment data
      const paymentData = {
        email: order.customer_email,
        amount: amountInKobo,
        currency: 'ZAR',
        reference: `bb-order-${order.order_number}-${Date.now()}`,
        metadata: {
          orderId: order.id,
          orderNumber: order.order_number,
          userId: order.user_id,
          customerName: `${order.first_name} ${order.last_name}`,
          items: order.items.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.price
          }))
        },
        callback_url: `${process.env.VITE_API_URL || 'http://localhost:3001/api'}/payments/callback`,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
      };

      // Initialize transaction with Paystack using secure HTTP client
      const response = await this.paystackClient.post('/transaction/initialize', paymentData);

      if (!response.data || !response.data.status) {
        throw new AppError('Payment initialization failed', 500, 'PAYMENT_INIT_FAILED');
      }

      // Store payment record
      const paymentRecord = await OrderService.createPaymentRecord(orderId, {
        paymentMethod: 'paystack',
        gateway: 'paystack',
        transactionId: response.data.reference,
        amount: parseFloat(order.total),
        currency: 'ZAR',
        status: 'pending',
        gatewayResponse: response.data
      });

      // Update order payment reference
      await OrderService.updatePaymentStatus(orderId, 'pending', response.data.data.reference);

      return {
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference,
        paymentRecord
      };

    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  }

  // Verify payment transaction
  async verifyPayment(reference) {
    try {
      const response = await this.paystackClient.get(`/transaction/verify/${reference}`);

      if (!response.data || !response.data.status) {
        throw new AppError('Payment verification failed', 500, 'PAYMENT_VERIFY_FAILED');
      }

      const transaction = response.data.data;
      return transaction;

    } catch (error) {
      console.error('Payment verification error:', error);
      if (error.response && error.response.status === 404) {
        throw new AppError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
      }
      throw new AppError('Payment verification failed', 500, 'PAYMENT_VERIFY_FAILED');
    }
  }

  // Handle payment callback
  async handlePaymentCallback(reference) {
    try {
      // Verify the transaction
      const transaction = await this.verifyPayment(reference);
      
      // Get order ID from transaction metadata
      const orderId = transaction.metadata?.orderId;
      
      if (!orderId) {
        throw new AppError('Order ID not found in transaction metadata', 400, 'INVALID_TRANSACTION');
      }

      // Get order details
      const order = await OrderService.getOrderById(orderId);
      
      if (!order) {
        throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
      }

      // Process based on transaction status
      let paymentStatus = 'failed';
      let orderStatus = order.status;

      switch (transaction.status) {
        case 'success':
          paymentStatus = 'paid';
          orderStatus = 'confirmed';
          break;
        case 'abandoned':
          paymentStatus = 'abandoned';
          break;
        case 'failed':
          paymentStatus = 'failed';
          break;
        default:
          paymentStatus = 'pending';
      }

      // Update payment record
      await this.updatePaymentRecord(orderId, reference, {
        status: paymentStatus,
        gatewayResponse: transaction
      });

      // Update order payment status
      await OrderService.updatePaymentStatus(orderId, paymentStatus, reference);

      // Update order status if payment successful
      if (paymentStatus === 'paid' && order.status === 'pending') {
        await OrderService.updateOrderStatus(orderId, 'confirmed', 'Payment received via Paystack');
      }

      return {
        success: paymentStatus === 'paid',
        transaction,
        order,
        paymentStatus,
        orderStatus
      };

    } catch (error) {
      console.error('Payment callback error:', error);
      throw error;
    }
  }

  // Handle Paystack webhooks
  async handleWebhook(payload, signature) {
    try {
      // Verify webhook signature
      const crypto = await import('crypto');
      const hash = crypto.createHmac('sha512', this.webhookSecret).update(JSON.stringify(payload)).digest('hex');
      
      if (hash !== signature) {
        throw new AppError('Invalid webhook signature', 400, 'INVALID_WEBHOOK');
      }

      const event = payload.event;
      const data = payload.data;

      console.log('Paystack webhook received:', event);

      switch (event) {
        case 'charge.success':
          return await this.handleChargeSuccess(data);
        
        case 'charge.failed':
          return await this.handleChargeFailed(data);
        
        case 'transfer.success':
          return await this.handleTransferSuccess(data);
        
        case 'transfer.failed':
          return await this.handleTransferFailed(data);
        
        default:
          console.log(`Unhandled webhook event: ${event}`);
          return { processed: false, event };
      }

    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  // Handle successful charge webhook
  async handleChargeSuccess(data) {
    try {
      const orderId = data.metadata?.orderId;
      
      if (!orderId) {
        console.log('No order ID found in charge success webhook');
        return { processed: false, reason: 'No order ID' };
      }

      // Update payment status
      await this.updatePaymentRecord(orderId, data.reference, {
        status: 'paid',
        gatewayResponse: data
      });

      await OrderService.updatePaymentStatus(orderId, 'paid', data.reference);
      await OrderService.updateOrderStatus(orderId, 'confirmed', 'Payment confirmed via webhook');

      console.log(`Order ${orderId} payment confirmed via webhook`);
      
      return { 
        processed: true, 
        orderId, 
        reference: data.reference,
        amount: data.amount / 100 
      };

    } catch (error) {
      console.error('Charge success webhook error:', error);
      return { processed: false, error: error.message };
    }
  }

  // Handle failed charge webhook  
  async handleChargeFailed(data) {
    try {
      const orderId = data.metadata?.orderId;
      
      if (!orderId) {
        console.log('No order ID found in charge failed webhook');
        return { processed: false, reason: 'No order ID' };
      }

      // Update payment status
      await this.updatePaymentRecord(orderId, data.reference, {
        status: 'failed',
        gatewayResponse: data
      });

      await OrderService.updatePaymentStatus(orderId, 'failed', data.reference);

      console.log(`Order ${orderId} payment failed via webhook`);
      
      return { 
        processed: true, 
        orderId, 
        reference: data.reference,
        status: 'failed'
      };

    } catch (error) {
      console.error('Charge failed webhook error:', error);
      return { processed: false, error: error.message };
    }
  }

  // Handle transfer success (for refunds)
  async handleTransferSuccess(data) {
    // Handle refund success if implemented
    console.log('Transfer success webhook received:', data.reference);
    return { processed: true, type: 'transfer_success' };
  }

  // Handle transfer failed (for refunds)
  async handleTransferFailed(data) {
    // Handle refund failure if implemented  
    console.log('Transfer failed webhook received:', data.reference);
    return { processed: true, type: 'transfer_failed' };
  }

  // Update payment record in database
  async updatePaymentRecord(orderId, reference, updates) {
    const client = await pool.connect();
    
    try {
      const query = `
        UPDATE payments 
        SET 
          status = $1,
          gateway_response = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $3 AND gateway_transaction_id = $4
        RETURNING *
      `;

      const result = await client.query(query, [
        updates.status,
        JSON.stringify(updates.gatewayResponse),
        orderId,
        reference
      ]);

      return result.rows[0];

    } catch (error) {
      console.error('Payment record update error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Get payment status
  async getPaymentStatus(reference) {
    try {
      const transaction = await this.verifyPayment(reference);
      return {
        status: transaction.status,
        amount: transaction.amount / 100,
        currency: transaction.currency,
        reference: transaction.reference,
        paidAt: transaction.paid_at,
        channel: transaction.channel,
        metadata: transaction.metadata
      };
    } catch (error) {
      console.error('Get payment status error:', error);
      throw error;
    }
  }

  // Create refund (if needed)
  async createRefund(reference, amount = null, reason = null) {
    try {
      const refundData = {
        transaction: reference
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to kobo
      }

      if (reason) {
        refundData.customer_note = reason;
      }

      const response = await this.paystackClient.post('/refund', refundData);

      if (!response.data || !response.data.status) {
        throw new AppError('Refund creation failed', 500, 'REFUND_FAILED');
      }

      return response.data.data;

    } catch (error) {
      console.error('Refund creation error:', error);
      if (error.response) {
        throw new AppError(`Refund failed: ${error.response.data.message}`, 500, 'REFUND_FAILED');
      }
      throw new AppError('Refund creation failed', 500, 'REFUND_FAILED');
    }
  }

  // List transactions for an order
  async getOrderTransactions(orderId) {
    try {
      const query = `
        SELECT * 
        FROM payments 
        WHERE order_id = $1 AND payment_gateway = 'paystack'
        ORDER BY created_at DESC
      `;

      const result = await pool.query(query, [orderId]);
      return result.rows;

    } catch (error) {
      console.error('Get order transactions error:', error);
      throw error;
    }
  }

  // Get supported currencies and channels
  getSupportedOptions() {
    return {
      currencies: ['ZAR', 'USD', 'GHS', 'NGN', 'KES'],
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      testMode: process.env.PAYSTACK_SANDBOX === 'true'
    };
  }
}

export default new PaystackService();