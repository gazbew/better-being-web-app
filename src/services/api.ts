const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

import type {
  User,
  Product,
  Order,
  Cart,
  ProductCategory,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  SearchFilters,
  SearchResult,
  APIResponse,
  PaginatedResponse,
  Address
} from '@/types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const token = this.getAuthToken();
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // Include HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || `HTTP error! status: ${response.status}`,
          errors: data.errors 
        };
      }

      return { 
        success: true, 
        data: data.success !== undefined ? data : data,
        message: data.message 
      };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  // Health check
  async checkHealth() {
    return this.request<{ status: string; database: string; timestamp: string }>('/health');
  }

  // Authentication
  async register(userData: RegisterData) {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginCredentials) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ token: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout() {
    return this.request<void>('/auth/logout', { method: 'POST' });
  }

  async forgotPassword(email: string) {
    return this.request<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // Products
  async searchProducts(params?: {
    query?: string;
    category?: string;
    subcategory?: string;
    tags?: string[];
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    inStock?: boolean;
    featured?: boolean;
    popular?: boolean;
    sort?: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'popular' | 'newest' | 'name';
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, String(v)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return this.request<SearchResult<Product> & { filters: Record<string, unknown> }>(`/products/search?${queryParams}`);
  }

  async getProduct(id: number) {
    return this.request<{ product: Product }>(`/products/${id}`);
  }

  async getRelatedProducts(id: number, limit = 4) {
    return this.request<{ products: Product[]; count: number }>(`/products/${id}/related?limit=${limit}`);
  }

  async getCategories() {
    return this.request<{ categories: ProductCategory[] }>('/products/categories');
  }

  async getSearchSuggestions(query: string, limit = 10) {
    return this.request<{ suggestions: string[] }>(`/products/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // Cart
  async getCart() {
    return this.request<{ cart: Cart; authenticated: boolean }>('/cart');
  }

  async addToCart(productId: number, quantity = 1) {
    return this.request<{ cart: Cart; message: string }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId: number, quantity: number) {
    return this.request<{ cart: Cart; message: string }>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(itemId: number) {
    return this.request<{ cart: Cart; message: string }>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request<{ cart: Cart; message: string }>('/cart', {
      method: 'DELETE',
    });
  }

  async getCartCount() {
    return this.request<{ itemCount: number; totalQuantity: number }>('/cart/count');
  }

  async validateCart() {
    return this.request<{ valid: boolean; cart: Cart; availability: Array<{ productId: string; available: boolean; message?: string }> }>('/cart/validate', {
      method: 'POST',
    });
  }

  // Orders
  async getOrders(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return this.request<SearchResult<Order>>(`/orders?${queryParams}`);
  }

  async getOrder(orderId: number) {
    return this.request<{ order: Order }>(`/orders/${orderId}`);
  }

  async createOrder(orderData: {
    shippingAddress: Address;
    billingAddress?: Address;
    paymentMethod?: string;
    customerNotes?: string;
  }) {
    return this.request<{ order: Order; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(orderId: number, reason?: string) {
    return this.request<{ order: Order; message: string }>(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getOrderStats() {
    return this.request<{ stats: { totalOrders: number; totalRevenue: number; averageOrderValue: number } }>('/orders/stats');
  }

  // User Account
  async getUserOrders(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    return this.getOrders(params);
  }

  async getAccountStats() {
    return this.request<{
      totalOrders: number;
      totalSpent: number;
      loyaltyPoints: number;
      memberSince: string;
    }>('/users/account-stats');
  }

  // Payments
  async getPaymentConfig() {
    return this.request<{
      config: {
        publicKey: string;
        supportedCurrencies: string[];
        supportedChannels: string[];
        testMode: boolean;
      };
    }>('/payments/config');
  }

  async initializePayment(orderId: number) {
    return this.request<{
      authorization_url: string;
      access_code: string;
      reference: string;
    }>(`/payments/initialize/${orderId}`, {
      method: 'POST',
    });
  }

  async verifyPayment(reference: string) {
    return this.request<{ transaction: { status: string; amount: number; reference: string; currency: string } }>(`/payments/verify/${reference}`);
  }

  async getPaymentStatus(reference: string) {
    return this.request<{ payment: { status: string; amount: number; reference: string; orderId: number } }>(`/payments/status/${reference}`);
  }
}

export const api = new ApiService();