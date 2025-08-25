import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Types
interface CartItem {
  cart_id: number;
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
  size?: string;
  in_stock: boolean;
  stock_count: number;
}

interface CartSummary {
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
}

interface AddToCartData {
  productId: number;
  quantity?: number;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  isLoading: boolean;
  addToCart: (data: AddToCartData) => void;
  updateCartItem: (cartItemId: number, quantity: number) => void;
  removeFromCart: (cartItemId: number) => void;
  clearCart: () => void;
  isAddingToCart: boolean;
  prefetchCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Optimized API functions with better error handling and caching
const API_BASE = '/api';

// Enhanced request function with retry logic and better error handling
const makeRequest = async <T>(
  url: string, 
  options: RequestInit = {},
  retries = 2
): Promise<T> => {
  const token = localStorage.getItem('auth_token');
  if (!token && url !== `${API_BASE}/cart/guest`) {
    throw new Error('No authentication token');
  }
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  let lastError: Error;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx) or abort errors
      if (error instanceof Error && 
          (error.name === 'AbortError' || 
           error.message.includes('HTTP 4'))) {
        break;
      }
      
      // Wait before retry (exponential backoff)
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 500));
      }
    }
  }
  
  throw lastError;
};

const cartApi = {
  getCart: (): Promise<CartItem[]> => 
    makeRequest(`${API_BASE}/cart`),

  getCartSummary: (): Promise<CartSummary> => 
    makeRequest(`${API_BASE}/cart/summary`),

  addToCart: (data: AddToCartData): Promise<any> => 
    makeRequest(`${API_BASE}/cart/add`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCartItem: (cartItemId: number, quantity: number): Promise<any> => 
    makeRequest(`${API_BASE}/cart/update/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeFromCart: (cartItemId: number): Promise<any> => 
    makeRequest(`${API_BASE}/cart/remove/${cartItemId}`, {
      method: 'DELETE',
    }),

  clearCart: (): Promise<any> => 
    makeRequest(`${API_BASE}/cart/clear`, {
      method: 'DELETE',
    }),
};

// Query key factory for better cache management
const cartKeys = {
  all: ['cart'] as const,
  lists: () => [...cartKeys.all, 'list'] as const,
  list: (filters: string) => [...cartKeys.lists(), { filters }] as const,
  details: () => [...cartKeys.all, 'detail'] as const,
  detail: (id: number) => [...cartKeys.details(), id] as const,
  summary: () => [...cartKeys.all, 'summary'] as const,
};

// Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProviderOptimized: React.FC<CartProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  // Optimized cart queries with stale time and better cache management
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: cartKeys.lists(),
    queryFn: cartApi.getCart,
    enabled: !!localStorage.getItem('auth_token'),
    staleTime: 30000, // 30 seconds stale time
    gcTime: 300000, // 5 minutes cache time
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('No authentication token') || 
          error.message.includes('HTTP 401')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // Disable refetch on window focus for better UX
  });

  const { data: cartSummary = { totalItems: 0, totalQuantity: 0, totalPrice: 0 } } = useQuery({
    queryKey: cartKeys.summary(),
    queryFn: cartApi.getCartSummary,
    enabled: !!localStorage.getItem('auth_token'),
    staleTime: 30000,
    gcTime: 300000,
    retry: (failureCount, error) => {
      if (error.message.includes('No authentication token') || 
          error.message.includes('HTTP 401')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });

  // Optimistic update helper
  const updateCartOptimistically = useCallback((
    updater: (oldData: CartItem[]) => CartItem[]
  ) => {
    queryClient.setQueryData(cartKeys.lists(), updater);
    
    // Update summary optimistically
    queryClient.setQueryData(cartKeys.summary(), (oldSummary: CartSummary) => {
      const newItems = queryClient.getQueryData<CartItem[]>(cartKeys.lists()) || [];
      return {
        totalItems: newItems.length,
        totalQuantity: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
      };
    });
  }, [queryClient]);

  // Add to cart mutation with optimistic updates
  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.lists() });
      await queryClient.cancelQueries({ queryKey: cartKeys.summary() });

      // Snapshot previous values
      const previousItems = queryClient.getQueryData<CartItem[]>(cartKeys.lists());
      const previousSummary = queryClient.getQueryData<CartSummary>(cartKeys.summary());

      // Optimistically update cart
      if (previousItems) {
        const existingItemIndex = previousItems.findIndex(
          item => item.product_id === newItem.productId && item.size === newItem.size
        );

        if (existingItemIndex >= 0) {
          updateCartOptimistically(oldItems => 
            oldItems.map((item, index) => 
              index === existingItemIndex 
                ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                : item
            )
          );
        }
      }

      return { previousItems, previousSummary };
    },
    onError: (error, newItem, context) => {
      // Rollback optimistic update
      if (context?.previousItems) {
        queryClient.setQueryData(cartKeys.lists(), context.previousItems);
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(cartKeys.summary(), context.previousSummary);
      }
      toast.error(error.message || 'Failed to add item to cart');
    },
    onSuccess: (data) => {
      // Invalidate to ensure server state is correct
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
      toast.success(data.message || 'Item added to cart!');
    },
  });

  // Update cart item mutation with optimistic updates
  const updateCartMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartApi.updateCartItem(cartItemId, quantity),
    onMutate: async ({ cartItemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.lists() });
      await queryClient.cancelQueries({ queryKey: cartKeys.summary() });

      const previousItems = queryClient.getQueryData<CartItem[]>(cartKeys.lists());
      const previousSummary = queryClient.getQueryData<CartSummary>(cartKeys.summary());

      if (previousItems) {
        updateCartOptimistically(oldItems =>
          oldItems.map(item =>
            item.cart_id === cartItemId ? { ...item, quantity } : item
          )
        );
      }

      return { previousItems, previousSummary };
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(cartKeys.lists(), context.previousItems);
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(cartKeys.summary(), context.previousSummary);
      }
      toast.error(error.message || 'Failed to update cart');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
      toast.success(data.message || 'Cart updated!');
    },
  });

  // Remove from cart mutation with optimistic updates
  const removeFromCartMutation = useMutation({
    mutationFn: cartApi.removeFromCart,
    onMutate: async (cartItemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.lists() });
      await queryClient.cancelQueries({ queryKey: cartKeys.summary() });

      const previousItems = queryClient.getQueryData<CartItem[]>(cartKeys.lists());
      const previousSummary = queryClient.getQueryData<CartSummary>(cartKeys.summary());

      if (previousItems) {
        updateCartOptimistically(oldItems =>
          oldItems.filter(item => item.cart_id !== cartItemId)
        );
      }

      return { previousItems, previousSummary };
    },
    onError: (error, cartItemId, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(cartKeys.lists(), context.previousItems);
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(cartKeys.summary(), context.previousSummary);
      }
      toast.error(error.message || 'Failed to remove item from cart');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
      toast.success(data.message || 'Item removed from cart!');
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.lists() });
      await queryClient.cancelQueries({ queryKey: cartKeys.summary() });

      const previousItems = queryClient.getQueryData<CartItem[]>(cartKeys.lists());
      const previousSummary = queryClient.getQueryData<CartSummary>(cartKeys.summary());

      queryClient.setQueryData(cartKeys.lists(), []);
      queryClient.setQueryData(cartKeys.summary(), { 
        totalItems: 0, 
        totalQuantity: 0, 
        totalPrice: 0 
      });

      return { previousItems, previousSummary };
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(cartKeys.lists(), context.previousItems);
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(cartKeys.summary(), context.previousSummary);
      }
      toast.error(error.message || 'Failed to clear cart');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
      toast.success(data.message || 'Cart cleared!');
    },
  });

  // Prefetch function for performance
  const prefetchCart = useCallback(() => {
    if (localStorage.getItem('auth_token')) {
      queryClient.prefetchQuery({
        queryKey: cartKeys.lists(),
        queryFn: cartApi.getCart,
        staleTime: 30000,
      });
      queryClient.prefetchQuery({
        queryKey: cartKeys.summary(),
        queryFn: cartApi.getCartSummary,
        staleTime: 30000,
      });
    }
  }, [queryClient]);

  const contextValue: CartContextType = {
    cartItems,
    cartSummary,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateCartItem: useCallback((cartItemId: number, quantity: number) =>
      updateCartMutation.mutate({ cartItemId, quantity }), [updateCartMutation]),
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    prefetchCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCartOptimized = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartOptimized must be used within a CartProviderOptimized');
  }
  return context;
};