import { performance } from 'perf_hooks';
import { getPoolStats, checkDatabaseHealth } from '../config/database.js';
import { cache } from '../config/redis.js';

// Performance metrics store
const metrics = {
  requests: {
    total: 0,
    byEndpoint: new Map(),
    byMethod: new Map(),
    responseTime: {
      total: 0,
      samples: []
    }
  },
  database: {
    queries: 0,
    totalTime: 0,
    slowQueries: []
  },
  cache: {
    hits: 0,
    misses: 0,
    errors: 0
  },
  errors: {
    total: 0,
    by5xx: 0,
    by4xx: 0
  }
};

// Request performance tracking middleware
export const performanceMiddleware = (req, res, next) => {
  const startTime = performance.now();
  const originalSend = res.send;
  
  // Track request start
  metrics.requests.total++;
  
  const endpoint = `${req.method} ${req.route?.path || req.path}`;
  metrics.requests.byEndpoint.set(endpoint, (metrics.requests.byEndpoint.get(endpoint) || 0) + 1);
  metrics.requests.byMethod.set(req.method, (metrics.requests.byMethod.get(req.method) || 0) + 1);
  
  // Override res.send to capture response time
  res.send = function(data) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // Track response time
    metrics.requests.responseTime.total += responseTime;
    metrics.requests.responseTime.samples.push(responseTime);
    
    // Keep only last 1000 samples
    if (metrics.requests.responseTime.samples.length > 1000) {
      metrics.requests.responseTime.samples.shift();
    }
    
    // Track errors
    if (res.statusCode >= 500) {
      metrics.errors.by5xx++;
      metrics.errors.total++;
    } else if (res.statusCode >= 400) {
      metrics.errors.by4xx++;
      metrics.errors.total++;
    }
    
    // Log slow requests
    if (responseTime > 1000) {
      console.warn(`🐌 Slow request detected: ${endpoint} - ${responseTime.toFixed(2)}ms`);
    }
    
    // Add performance headers
    res.set({
      'X-Response-Time': `${responseTime.toFixed(2)}ms`,
      'X-Request-ID': req.id || 'unknown'
    });
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Database query tracking
export const trackDatabaseQuery = (query, duration) => {
  metrics.database.queries++;
  metrics.database.totalTime += duration;
  
  // Track slow queries
  if (duration > 500) {
    metrics.database.slowQueries.push({
      query: query.substring(0, 100) + '...',
      duration,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 slow queries
    if (metrics.database.slowQueries.length > 50) {
      metrics.database.slowQueries.shift();
    }
  }
};

// Cache performance tracking
export const trackCacheOperation = (operation, success) => {
  if (operation === 'hit') {
    metrics.cache.hits++;
  } else if (operation === 'miss') {
    metrics.cache.misses++;
  } else if (operation === 'error') {
    metrics.cache.errors++;
  }
};

// Get performance metrics
export const getPerformanceMetrics = async () => {
  const samples = metrics.requests.responseTime.samples;
  const avgResponseTime = samples.length > 0 
    ? samples.reduce((a, b) => a + b, 0) / samples.length 
    : 0;
  
  const p95ResponseTime = samples.length > 0 
    ? samples.sort((a, b) => a - b)[Math.floor(samples.length * 0.95)] 
    : 0;
  
  const p99ResponseTime = samples.length > 0 
    ? samples.sort((a, b) => a - b)[Math.floor(samples.length * 0.99)] 
    : 0;
  
  const avgDbQueryTime = metrics.database.queries > 0 
    ? metrics.database.totalTime / metrics.database.queries 
    : 0;
  
  const cacheHitRate = (metrics.cache.hits + metrics.cache.misses) > 0 
    ? (metrics.cache.hits / (metrics.cache.hits + metrics.cache.misses)) * 100 
    : 0;
  
  const errorRate = metrics.requests.total > 0 
    ? (metrics.errors.total / metrics.requests.total) * 100 
    : 0;
  
  // Get database health
  const dbHealth = await checkDatabaseHealth();
  const dbStats = getPoolStats();
  
  // Get cache health
  const cacheHealth = await cache.healthCheck();
  const cacheStats = await cache.getStats();
  
  return {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    
    // Request metrics
    requests: {
      total: metrics.requests.total,
      byEndpoint: Object.fromEntries(metrics.requests.byEndpoint),
      byMethod: Object.fromEntries(metrics.requests.byMethod),
      avgResponseTime: avgResponseTime.toFixed(2),
      p95ResponseTime: p95ResponseTime.toFixed(2),
      p99ResponseTime: p99ResponseTime.toFixed(2)
    },
    
    // Database metrics
    database: {
      health: dbHealth,
      pool: dbStats,
      queries: {
        total: metrics.database.queries,
        avgTime: avgDbQueryTime.toFixed(2),
        slowQueries: metrics.database.slowQueries.slice(-10)
      }
    },
    
    // Cache metrics
    cache: {
      health: cacheHealth,
      stats: cacheStats,
      performance: {
        hits: metrics.cache.hits,
        misses: metrics.cache.misses,
        errors: metrics.cache.errors,
        hitRate: cacheHitRate.toFixed(2)
      }
    },
    
    // Error metrics
    errors: {
      total: metrics.errors.total,
      rate: errorRate.toFixed(2),
      by4xx: metrics.errors.by4xx,
      by5xx: metrics.errors.by5xx
    },
    
    // Memory metrics
    memory: process.memoryUsage()
  };
};

// Reset metrics
export const resetMetrics = () => {
  metrics.requests.total = 0;
  metrics.requests.byEndpoint.clear();
  metrics.requests.byMethod.clear();
  metrics.requests.responseTime.total = 0;
  metrics.requests.responseTime.samples = [];
  
  metrics.database.queries = 0;
  metrics.database.totalTime = 0;
  metrics.database.slowQueries = [];
  
  metrics.cache.hits = 0;
  metrics.cache.misses = 0;
  metrics.cache.errors = 0;
  
  metrics.errors.total = 0;
  metrics.errors.by4xx = 0;
  metrics.errors.by5xx = 0;
};

// Performance monitoring routes
export const createPerformanceRoutes = (app) => {
  // Get metrics endpoint
  app.get('/api/metrics', async (req, res) => {
    try {
      const metrics = await getPerformanceMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get metrics' });
    }
  });
  
  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    try {
      const dbHealth = await checkDatabaseHealth();
      const cacheHealth = await cache.healthCheck();
      
      const isHealthy = dbHealth.healthy && (!cache.isAvailable() || cacheHealth.healthy);
      
      res.status(isHealthy ? 200 : 503).json({
        healthy: isHealthy,
        timestamp: new Date().toISOString(),
        services: {
          database: dbHealth,
          cache: cacheHealth
        }
      });
    } catch (error) {
      res.status(503).json({
        healthy: false,
        error: error.message
      });
    }
  });
  
  // Reset metrics endpoint (admin only)
  app.post('/api/metrics/reset', (req, res) => {
    resetMetrics();
    res.json({ message: 'Metrics reset successfully' });
  });
};

// Request ID middleware
export const requestIdMiddleware = (req, res, next) => {
  req.id = req.get('X-Request-ID') || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.set('X-Request-ID', req.id);
  next();
};

// Rate limiting with Redis
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return async (req, res, next) => {
    const key = `rate_limit:${req.ip}:${Math.floor(Date.now() / windowMs)}`;
    
    try {
      const current = await cache.incr('rate_limit', key, windowMs / 1000);
      
      res.set({
        'X-RateLimit-Limit': max,
        'X-RateLimit-Remaining': Math.max(0, max - current),
        'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
      });
      
      if (current > max) {
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: windowMs / 1000
        });
      }
      
      next();
    } catch (error) {
      // If Redis is down, allow the request
      console.warn('Rate limiter error:', error.message);
      next();
    }
  };
};