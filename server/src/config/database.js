import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const { Pool } = pg;

// Provide a mock pool when DATABASE_URL is not set so the server can initialize in dev without a DB.
const mockPool = {
  totalCount: 0,
  idleCount: 0,
  waitingCount: 0,
  query: async (text, params) => {
    console.warn('⚠️ Mock pool.query called — returning empty result. Query:', text);
    return { rows: [], rowCount: 0 };
  },
  end: async () => {
    console.log('✅ Mock pool.end called');
  }
};

let pool = null;
let poolClosed = false;

// Health-check wrapper; uses mock responses when no real DB is configured.
export const checkDatabaseHealth = async () => {
  if (!pool || pool === mockPool) {
    return { healthy: false, error: 'No DATABASE_URL configured' };
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    client.release();

    return {
      healthy: true,
      timestamp: result.rows[0].current_time,
      version: result.rows[0].db_version,
      pool_stats: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
      pool_stats: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  }
};

export const getPoolStats = () => {
  if (!pool || pool === mockPool) return { total: 0, idle: 0, waiting: 0, max: 0, min: 0 };
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
    max: pool.options?.max,
    min: pool.options?.min
  };
};

// Safe pool closer to prevent double `end()` calls
export const closePool = async () => {
  if (!pool || pool === mockPool) return;
  if (poolClosed) return;
  try {
    await pool.end();
    poolClosed = true;
    console.log('✅ Database pool closed (closePool)');
  } catch (err) {
    console.warn('⚠️ closePool error:', err && err.message ? err.message : err);
  }
};

// Optimized connection pool configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  
  // Connection pool optimization
  max: parseInt(process.env.DB_MAX_CONNECTIONS) || 20, // Maximum pool size
  min: parseInt(process.env.DB_MIN_CONNECTIONS) || 2,  // Minimum pool size
  idle: parseInt(process.env.DB_IDLE_TIMEOUT) || 10000, // Close idle clients after 10s
  
  // Connection timeout settings
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 10000,
  
  // Query settings
  query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30000,
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT) || 30000,
  
  // SSL configuration - secure by default
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA,
    cert: process.env.DB_SSL_CERT,
    key: process.env.DB_SSL_KEY
  } : process.env.DATABASE_URL?.includes('localhost') ? false : {
    rejectUnauthorized: false // Only for development with cloud databases
  }
};

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL is not set — using a mock DB pool for development.');
  pool = mockPool;
} else {
  pool = new Pool(poolConfig);

  // Enhanced connection monitoring
  pool.on('connect', (client) => {
    console.log(`✅ Database connection established. Pool: ${pool.totalCount}/${pool.options.max}`);
    
    // Set connection-level optimizations
    client.query(`
      SET statement_timeout = '${poolConfig.statement_timeout}ms';
      SET idle_in_transaction_session_timeout = '10s';
      SET search_path = public;
    `).catch(err => console.warn('Failed to set connection optimizations:', err.message));
  });

  pool.on('acquire', () => {
    console.log(`🔄 Connection acquired. Active: ${pool.totalCount - pool.idleCount}/${pool.totalCount}`);
  });

  pool.on('release', () => {
    console.log(`📤 Connection released. Idle: ${pool.idleCount}/${pool.totalCount}`);
  });

  pool.on('error', (err, client) => {
    console.error('❌ Unexpected database error:', {
      message: err.message,
      code: err.code,
      severity: err.severity,
      detail: err.detail,
      pool_stats: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    });
    
    // Don't exit process, let the pool handle reconnection
    if (err.code === 'ECONNRESET' || err.code === 'ENOTFOUND') {
      console.log('🔄 Attempting to reconnect to database...');
    }
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down database pool...');
  if (pool && pool.end) await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down database pool...');
  if (pool && pool.end) await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});

// Health check function
// (checkDatabaseHealth and getPoolStats are declared above and reference `pool`)
export default pool;