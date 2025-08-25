import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Redis client configuration
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
  database: parseInt(process.env.REDIS_DB) || 0,
  
  // Connection settings
  socket: {
    connectTimeout: 5000,
    lazyConnect: true,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Redis: Too many reconnection attempts, giving up');
        return new Error('Too many reconnection attempts');
      }
      const delay = Math.min(retries * 100, 3000);
      console.log(`🔄 Redis: Attempting reconnection in ${delay}ms (attempt ${retries})`);
      return delay;
    }
  },
  
  // Performance settings
  commandTimeout: 5000,
  lazyConnect: true
};

let client = null;
let isConnected = false;

// Create Redis client
const createRedisClient = () => {
  if (client) return client;
  
  client = createClient(redisConfig);
  
  // Event handlers
  client.on('connect', () => {
    console.log('🔗 Redis: Connecting...');
  });
  
  client.on('ready', () => {
    console.log('✅ Redis: Connected and ready');
    isConnected = true;
  });
  
  client.on('error', (err) => {
    console.error('❌ Redis error:', err.message);
    isConnected = false;
  });
  
  client.on('end', () => {
    console.log('📤 Redis: Connection ended');
    isConnected = false;
  });
  
  client.on('reconnecting', () => {
    console.log('🔄 Redis: Reconnecting...');
    isConnected = false;
  });
  
  return client;
};

// Initialize client
createRedisClient();

// Cache service class
export class CacheService {
  constructor() {
    this.defaultTTL = parseInt(process.env.CACHE_TTL) || 300; // 5 minutes
    this.keyPrefix = process.env.CACHE_KEY_PREFIX || 'bb:';
  }
  
  // Connect to Redis
  async connect() {
    if (!client || !client.isOpen) {
      await client.connect();
    }
    return client;
  }
  
  // Check if Redis is available
  isAvailable() {
    return isConnected && client && client.isOpen;
  }
  
  // Generate cache key
  generateKey(namespace, identifier) {
    return `${this.keyPrefix}${namespace}:${JSON.stringify(identifier)}`;
  }
  
  // Get from cache
  async get(namespace, identifier) {
    if (!this.isAvailable()) return null;
    
    try {
      const key = this.generateKey(namespace, identifier);
      const value = await client.get(key);
      
      if (value) {
        const parsed = JSON.parse(value);
        console.log(`🎯 Cache hit: ${key}`);
        return parsed;
      }
      
      console.log(`❌ Cache miss: ${key}`);
      return null;
    } catch (error) {
      console.error('Redis get error:', error.message);
      return null;
    }
  }
  
  // Set in cache
  async set(namespace, identifier, data, ttl = null) {
    if (!this.isAvailable()) return false;
    
    try {
      const key = this.generateKey(namespace, identifier);
      const value = JSON.stringify(data);
      const expiry = ttl || this.defaultTTL;
      
      await client.setEx(key, expiry, value);
      console.log(`💾 Cache set: ${key} (TTL: ${expiry}s)`);
      return true;
    } catch (error) {
      console.error('Redis set error:', error.message);
      return false;
    }
  }
  
  // Delete from cache
  async del(namespace, identifier) {
    if (!this.isAvailable()) return false;
    
    try {
      const key = this.generateKey(namespace, identifier);
      await client.del(key);
      console.log(`🗑️ Cache deleted: ${key}`);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error.message);
      return false;
    }
  }
  
  // Clear namespace
  async clearNamespace(namespace) {
    if (!this.isAvailable()) return false;
    
    try {
      const pattern = `${this.keyPrefix}${namespace}:*`;
      const keys = await client.keys(pattern);
      
      if (keys.length > 0) {
        await client.del(keys);
        console.log(`🧹 Cache cleared namespace: ${namespace} (${keys.length} keys)`);
      }
      
      return true;
    } catch (error) {
      console.error('Redis clearNamespace error:', error.message);
      return false;
    }
  }
  
  // Increment counter
  async incr(namespace, identifier, ttl = null) {
    if (!this.isAvailable()) return null;
    
    try {
      const key = this.generateKey(namespace, identifier);
      const value = await client.incr(key);
      
      if (ttl && value === 1) {
        await client.expire(key, ttl);
      }
      
      return value;
    } catch (error) {
      console.error('Redis incr error:', error.message);
      return null;
    }
  }
  
  // Get cache statistics
  async getStats() {
    if (!this.isAvailable()) return null;
    
    try {
      const info = await client.info('memory');
      const dbSize = await client.dbSize();
      
      return {
        connected: isConnected,
        dbSize,
        memory: info
      };
    } catch (error) {
      console.error('Redis getStats error:', error.message);
      return null;
    }
  }
  
  // Health check
  async healthCheck() {
    try {
      const start = Date.now();
      await client.ping();
      const latency = Date.now() - start;
      
      return {
        healthy: true,
        latency,
        connected: isConnected
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        connected: false
      };
    }
  }
}

// Create cache service instance
export const cache = new CacheService();

// Cache middleware for Express routes
export const cacheMiddleware = (namespace, ttl = 300) => {
  return async (req, res, next) => {
    // Generate cache key from request
    const identifier = {
      path: req.path,
      query: req.query,
      method: req.method
    };
    
    try {
      // Try to get from cache
      const cached = await cache.get(namespace, identifier);
      
      if (cached) {
        return res.json(cached);
      }
      
      // Store original res.json
      const originalJson = res.json;
      
      // Override res.json to cache the response
      res.json = function(data) {
        // Cache the response
        cache.set(namespace, identifier, data, ttl);
        
        // Call original json method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      next();
    }
  };
};

// Graceful shutdown
export const disconnectRedis = async () => {
  if (client && client.isOpen) {
    console.log('🛑 Disconnecting from Redis...');
    await client.disconnect();
    console.log('✅ Redis disconnected');
  }
};

process.on('SIGINT', disconnectRedis);
process.on('SIGTERM', disconnectRedis);

export default client;