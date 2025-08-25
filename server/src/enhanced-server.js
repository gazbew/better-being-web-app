import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/database.js';

// Enhanced middleware imports
import { corsOptions, generalLimiter, authLimiter, securityHeaders, sanitizeInput, requestLogger, securityAudit } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/error-handler.js';

// Route imports
import productsRouter from './routes/products.js';
import enhancedProductsRouter from './routes/enhanced-products.js';
import ordersRouter from './routes/orders.js';
import enhancedOrdersRouter from './routes/enhanced-orders.js';
import paymentsRouter from './routes/payments.js';
import usersRouter from './routes/users.js';
import enhancedAuthRouter from './routes/enhanced-auth.js';
import cartRouter from './routes/cart.js';
import enhancedCartRouter from './routes/enhanced-cart.js';
import checkoutRouter from './routes/checkout.js';
import reviewsRouter from './routes/reviews.js';
import recommendationsRouter from './routes/recommendations.js';
import loyaltyRouter from './routes/loyalty.js';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// ========================================
// SECURITY MIDDLEWARE (Applied First)
// ========================================

// Security headers
app.use(securityHeaders);

// CORS with enhanced configuration
app.use(cors(corsOptions));

// General rate limiting
app.use(generalLimiter);

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// ========================================
// PARSING MIDDLEWARE
// ========================================

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Security audit
app.use(securityAudit);

// ========================================
// HEALTH CHECK ENDPOINTS
// ========================================

// Basic health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: result.rows[0].now,
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Detailed health check for monitoring
app.get('/api/health', async (req, res) => {
  try {
    const dbStart = Date.now();
    const dbResult = await pool.query('SELECT NOW()');
    const dbLatency = Date.now() - dbStart;

    // Check database connection pool
    const poolInfo = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };

    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      database: {
        status: 'connected',
        latency: `${dbLatency}ms`,
        pool: poolInfo,
        timestamp: dbResult.rows[0].now
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        error: error.message
      }
    });
  }
});

// ========================================
// API ROUTES
// ========================================

// Enhanced authentication routes (new secure system)
app.use('/api/auth', enhancedAuthRouter);

// Enhanced e-commerce routes (new advanced system)
app.use('/api/products', enhancedProductsRouter);
app.use('/api/cart', enhancedCartRouter);
app.use('/api/orders', enhancedOrdersRouter);
app.use('/api/payments', paymentsRouter);

// Legacy user routes (for backward compatibility)
app.use('/api/users', authLimiter, usersRouter);

// Legacy API routes (for backward compatibility)
app.use('/api/legacy/orders', ordersRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/loyalty', loyaltyRouter);

// Legacy routes (for backward compatibility)
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);

// API documentation endpoint (development only)
if (process.env.ENABLE_API_DOCS === 'true') {
  app.get('/api/docs', (req, res) => {
    res.json({
      title: 'Better Being API',
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      endpoints: {
        authentication: {
          'POST /api/users/register': 'Register new user',
          'POST /api/users/login': 'User login',
          'POST /api/users/refresh': 'Refresh JWT token',
          'POST /api/users/logout': 'User logout',
          'POST /api/users/forgot-password': 'Request password reset',
          'POST /api/users/reset-password': 'Reset password with token'
        },
        products: {
          'GET /api/products': 'Get all products with filters',
          'GET /api/products/:id': 'Get single product',
          'GET /api/products/category/:category': 'Get products by category'
        },
        cart: {
          'GET /api/cart': 'Get user cart',
          'POST /api/cart/items': 'Add item to cart',
          'PUT /api/cart/items/:id': 'Update cart item',
          'DELETE /api/cart/items/:id': 'Remove cart item'
        },
        orders: {
          'GET /api/orders': 'Get user orders',
          'GET /api/orders/:id': 'Get order details',
          'POST /api/orders': 'Create new order'
        },
        checkout: {
          'POST /api/checkout/initiate': 'Initiate checkout process',
          'POST /api/checkout/payfast': 'Process PayFast payment',
          'POST /api/checkout/webhook': 'Handle payment webhooks'
        }
      }
    });
  });
}

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

const gracefulShutdown = () => {
  console.log('Starting graceful shutdown...');
  
  server.close(() => {
    console.log('HTTP server closed');
    
    pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after 30 seconds');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// ========================================
// START SERVER
// ========================================

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Better Being API Server Starting...

Environment: ${process.env.NODE_ENV}
Port: ${PORT}
Database: Connected to Neon PostgreSQL
Security: Enhanced middleware active
Rate Limiting: Enabled
CORS: Configured for development

📊 Health Check: http://localhost:${PORT}/health
📖 API Docs: http://localhost:${PORT}/api/docs
🔍 Database: ${pool.totalCount} connections in pool

🎯 Ready for Epic Development!
  `);
});

export default app;