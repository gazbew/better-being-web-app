// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import database and routes
import pool from '../server/src/config/database.js';
import productsRouter from '../server/src/routes/products.js';
import ordersRouter from '../server/src/routes/orders.js';
import usersRouter from '../server/src/routes/users.js';
import cartRouter from '../server/src/routes/cart.js';
import checkoutRouter from '../server/src/routes/checkout.js';
import reviewsRouter from '../server/src/routes/reviews.js';
import recommendationsRouter from '../server/src/routes/recommendations.js';
import loyaltyRouter from '../server/src/routes/loyalty.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', usersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/loyalty', loyaltyRouter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;