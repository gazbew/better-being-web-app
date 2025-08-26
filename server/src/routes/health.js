import express from 'express';
import pool from '../config/database.js';
import { cache } from '../config/redis.js';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {}
    };

    // Check database connection
    try {
      await pool.query('SELECT 1');
      health.services.database = 'connected';
    } catch (error) {
      health.services.database = 'disconnected';
      health.status = 'unhealthy';
    }

    // Check Redis connection (optional)
    try {
      if (cache && cache.isAvailable && cache.isAvailable()) {
        await cache.ping();
        health.services.redis = 'connected';
      } else {
        health.services.redis = 'not configured';
      }
    } catch (error) {
      health.services.redis = 'disconnected';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

export default router;