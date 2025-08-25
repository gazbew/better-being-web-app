// Optimized API service with advanced caching, request deduplication, and performance enhancements

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  cache?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
  retries?: number;
  timeout?: number;
  dedupe?: boolean; // Request deduplication
}

class ApiOptimized {
  private baseURL: string;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private defaultCacheTTL = 5 * 60 * 1000; // 5 minutes
  private maxCacheSize = 100;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.setupCacheCleanup();
  }

  // Setup periodic cache cleanup
  private setupCacheCleanup() {
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60000); // Clean every minute
  }

  // Clean expired cache entries
  private cleanExpiredCache() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.defaultCacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  // Generate cache key
  private getCacheKey(url: string, config: RequestConfig = {}): string {
    const method = config.method || 'GET';
    const body = config.body ? JSON.stringify(config.body) : '';
    return `${method}:${url}:${body}`;
  }

  // Check if cache entry is valid
  private isCacheValid(entry: CacheEntry<any>, ttl: number): boolean {
    return Date.now() - entry.timestamp < ttl;
  }

  // Set cache with size limit
  private setCache<T>(key: string, data: T, etag?: string) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      etag
    });
  }

  // Enhanced request method with all optimizations
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      cache = method === 'GET',
      cacheTTL = this.defaultCacheTTL,
      retries = 2,
      timeout = 10000,
      dedupe = true
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, config);

    // Check cache for GET requests
    if (cache && method === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached, cacheTTL)) {
        return cached.data;
      }
    }

    // Request deduplication
    if (dedupe && this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Create request promise
    const requestPromise = this.executeRequest<T>(url, {
      method,
      headers,
      body,
      retries,
      timeout,
      etag: cache ? this.cache.get(cacheKey)?.etag : undefined
    });

    // Store pending request for deduplication
    if (dedupe) {
      this.pendingRequests.set(cacheKey, requestPromise);
    }

    try {
      const result = await requestPromise;
      
      // Cache successful GET requests
      if (cache && method === 'GET' && result) {
        this.setCache(cacheKey, result, result.etag);
      }

      return result;
    } finally {
      // Clean up pending request
      if (dedupe) {
        this.pendingRequests.delete(cacheKey);
      }
    }
  }

  // Execute HTTP request with retry logic and timeout
  private async executeRequest<T>(
    url: string,
    options: {
      method: string;
      headers: Record<string, string>;
      body?: any;
      retries: number;
      timeout: number;
      etag?: string;
    }
  ): Promise<T> {
    const { method, headers, body, retries, timeout, etag } = options;

    // Setup request headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Add authorization if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    // Add conditional request headers for caching
    if (etag) {
      requestHeaders['If-None-Match'] = etag;
    }

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle 304 Not Modified responses
        if (response.status === 304) {
          const cached = this.cache.get(this.getCacheKey(url, { method, body }));
          if (cached) {
            return cached.data;
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || 
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const responseData = await response.json();
        
        // Add etag for caching
        const responseEtag = response.headers.get('etag');
        if (responseEtag) {
          responseData.etag = responseEtag;
        }

        return responseData;

      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) or abort errors
        if (error instanceof Error && 
            (error.name === 'AbortError' || 
             error.message.includes('HTTP 4'))) {
          break;
        }

        // Exponential backoff for retries
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  // Optimized product methods
  async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });

    const endpoint = `/products?${searchParams.toString()}`;
    return this.request(endpoint, { 
      cache: true, 
      cacheTTL: 2 * 60 * 1000 // 2 minutes for product lists
    });
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`, { 
      cache: true,
      cacheTTL: 5 * 60 * 1000 // 5 minutes for individual products
    });
  }

  // Cart methods with optimistic updates
  async getCart() {
    return this.request('/cart', { 
      cache: true,
      cacheTTL: 30 * 1000 // 30 seconds for cart
    });
  }

  async addToCart(data: { productId: number; quantity?: number; size?: string }) {
    const result = await this.request('/cart/add', {
      method: 'POST',
      body: data,
      cache: false
    });

    // Invalidate cart cache
    this.invalidateCache('/cart');
    this.invalidateCache('/cart/summary');

    return result;
  }

  async updateCartItem(cartItemId: number, quantity: number) {
    const result = await this.request(`/cart/update/${cartItemId}`, {
      method: 'PUT',
      body: { quantity },
      cache: false
    });

    // Invalidate cart cache
    this.invalidateCache('/cart');
    this.invalidateCache('/cart/summary');

    return result;
  }

  async removeFromCart(cartItemId: number) {
    const result = await this.request(`/cart/remove/${cartItemId}`, {
      method: 'DELETE',
      cache: false
    });

    // Invalidate cart cache
    this.invalidateCache('/cart');
    this.invalidateCache('/cart/summary');

    return result;
  }

  // User authentication methods
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
      cache: false
    });
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
      cache: false
    });
  }

  async getProfile() {
    return this.request('/auth/profile', { 
      cache: true,
      cacheTTL: 10 * 60 * 1000 // 10 minutes for profile
    });
  }

  // Order methods
  async getOrders() {
    return this.request('/orders', { 
      cache: true,
      cacheTTL: 60 * 1000 // 1 minute for orders
    });
  }

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
      cache: false
    });
  }

  // Cache management methods
  invalidateCache(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      pendingRequests: this.pendingRequests.size
    };
  }

  // Prefetch commonly used data
  async prefetchProducts() {
    try {
      await Promise.all([
        this.getProducts({ limit: 20 }), // Popular products
        this.getProducts({ category: 'supplements', limit: 10 }),
        this.getProducts({ category: 'wellness', limit: 10 })
      ]);
    } catch (error) {
      console.warn('Failed to prefetch products:', error);
    }
  }

  // Batch requests for better performance
  async batchRequest<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    const maxConcurrent = 5; // Limit concurrent requests
    const results: T[] = [];
    
    for (let i = 0; i < requests.length; i += maxConcurrent) {
      const batch = requests.slice(i, i + maxConcurrent);
      const batchResults = await Promise.allSettled(
        batch.map(request => request())
      );
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results[i + index] = result.value;
        } else {
          console.error(`Batch request ${i + index} failed:`, result.reason);
        }
      });
    }
    
    return results;
  }
}

// Export singleton instance
export const api = new ApiOptimized();

// Export class for custom instances
export { ApiOptimized };

// Legacy compatibility - gradually replace with optimized version
export default api;