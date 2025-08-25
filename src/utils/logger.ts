/**
 * Production-safe logging utility
 * Console statements are automatically removed in production builds via esbuild
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: any[]) => {
    // Keep errors in production for debugging, but only critical ones
    console.error(...args);
  },
  debug: (...args: any[]) => {
    if (isDev) console.log('[DEBUG]', ...args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  }
};

// For development debugging only - completely removed in production
export const devLog = (...args: any[]) => {
  if (isDev) console.log('[DEV]', ...args);
};