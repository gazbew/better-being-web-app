import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './config/database.js';
import { corsOptions } from './middleware/security.js';
import { cache } from './config/redis.js';
import { runMigrations } from './config/migrate.js';

// Route imports
import healthRouter from './routes/health.js';
import productsRouter from './routes/products.js';
import optimizedProductsRouter from './routes/optimized-products.js';
import ordersRouter from './routes/orders.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/enhanced-auth.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';
import paymentsRouter from './routes/payments.js';
import reviewsRouter from './routes/reviews.js';
import recommendationsRouter from './routes/recommendations.js';
import loyaltyRouter from './routes/loyalty.js';

// Middleware imports
import {
  performanceMiddleware,
  requestIdMiddleware,
  createPerformanceRoutes,
  createRateLimiter
} from './middleware/performance.js';
// Security middleware is imported dynamically in initializeServer to avoid dev-time crashes
let enhancedHelmet, xssProtection, securityHeaders, apiRateLimit, requestSizeLimits;

// Load env relative to this file to avoid cwd issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3003;

// Basic security defaults (apply safe defaults; enhanced middleware will be applied dynamically)
app.use(helmet());

// CORS configuration - use env-driven allowlist via security middleware
app.use(cors(corsOptions));

// Basic middleware with safe defaults (requestSizeLimits may be applied later if available)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser for secure authentication
app.use(cookieParser());

// XSS protection may be added later if security middleware is available

// Performance middleware
app.use(requestIdMiddleware);
app.use(performanceMiddleware);

// Note: enhanced API rate limiting (apiRateLimit) is applied after dynamic security
// middleware is loaded during initializeServer. We don't apply it here because the
// variable may be undefined at module initialization time which causes Express to
// throw a TypeError.

// Initialize performance monitoring routes
createPerformanceRoutes(app);

// API Routes - Use optimized products route by default
app.use('/api/health', healthRouter);
app.use('/api/products', optimizedProductsRouter);
app.use('/api/products-legacy', productsRouter); // Keep legacy route for comparison
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter); // Auth routes using enhanced auth router
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/loyalty', loyaltyRouter);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id
  });
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
    
  res.status(err.status || 500).json({ 
    error: message,
    requestId: req.id
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    requestId: req.id
  });
});

// Initialize server
const initializeServer = async () => {
  try {
    console.log('🚀 Initializing Better Being API Server...');
    
    // Run database migrations only when explicitly enabled (avoid requiring DB in local dev)
    if (process.env.AUTO_MIGRATE === 'true') {
      console.log('📋 Running database migrations...');
      await runMigrations();
    } else {
      console.log('📋 Skipping DB migrations (AUTO_MIGRATE not set to true)');
    }
    
    // Connect to Redis (optional)
    try {
      await cache.connect();
      console.log('✅ Redis cache connected');
    } catch (error) {
      console.warn('⚠️ Redis not available:', error.message);
      console.log('🔄 Running without cache (performance may be reduced)');
    }
    
    // Start server
      // Dynamically import and apply security middleware where possible
      try {
        const sec = await import('./middleware/comprehensive-security.js');
        enhancedHelmet = sec.enhancedHelmet;
        xssProtection = sec.xssProtection;
        securityHeaders = sec.securityHeaders;
        apiRateLimit = sec.apiRateLimit;
        requestSizeLimits = sec.requestSizeLimits;

        // Apply security middleware (best-effort)
        if (enhancedHelmet) app.use(enhancedHelmet);
        if (securityHeaders) app.use(securityHeaders);
        if (xssProtection) app.use(xssProtection);
        if (apiRateLimit) app.use('/api', apiRateLimit);
        if (requestSizeLimits) {
          app.use(express.json(requestSizeLimits.json));
          app.use(express.urlencoded(requestSizeLimits.urlencoded));
        }
      } catch (err) {
        console.warn('⚠️ Security middleware failed to load; starting server without advanced security middleware:', err && err.message ? err.message : err);
      }

      const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API Documentation: http://localhost:${PORT}/api/health`);
      console.log(`📊 Performance Metrics: http://localhost:${PORT}/api/metrics`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
      
      server.close(async () => {
        try {
          // Use the exported close helper to avoid double-closing the pool
          const db = await import('./config/database.js');
          if (db && db.closePool) await db.closePool();

          console.log('✅ Database connections closed');
          
          if (cache.isAvailable && cache.isAvailable()) {
            await cache.disconnect();
            console.log('✅ Redis connection closed');
          }
          
          console.log('👋 Server shutdown complete');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error.message);
          process.exit(1);
        }
      });
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('💥 Failed to initialize server:', error.message);
    process.exit(1);
  }
};

// Start the server
initializeServer();
