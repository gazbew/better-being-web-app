import React, { createContext, useContext, ReactNode } from 'react';
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// API functions
const API_BASE: string = (import.meta.env.VITE_API_URL as string) || '/api';

const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await fetch(`${API_BASE}/cart`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 401) return [];
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  getCartSummary: async (): Promise<CartSummary> => {
    const response = await fetch(`${API_BASE}/cart/summary`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 401) return { totalItems: 0, totalQuantity: 0, totalPrice: 0 };
    if (!response.ok) throw new Error('Failed to fetch cart summary');
    return response.json();
  },

  addToCart: async (data: AddToCartData): Promise<any> => {
    const response = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to add item to cart');
    }
    return response.json();
  },

  updateCartItem: async (cartItemId: number, quantity: number): Promise<any> => {
    const response = await fetch(`${API_BASE}/cart/update/${cartItemId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update cart item');
    }
    return response.json();
  },

  removeFromCart: async (cartItemId: number): Promise<any> => {
    const response = await fetch(`${API_BASE}/cart/remove/${cartItemId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to remove item from cart');
    }
    return response.json();
  },

  clearCart: async (): Promise<any> => {
    const response = await fetch(`${API_BASE}/cart/clear`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to clear cart');
    }
    return response.json();
  },
};

// Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}

// Hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: true,
    retry: false,
  });

  // Fetch cart summary
  const { data: cartSummary = { totalItems: 0, totalQuantity: 0, totalPrice: 0 } } = useQuery({
    queryKey: ['cart-summary'],
    queryFn: cartApi.getCartSummary,
    enabled: true,
    retry: false,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-summary'] });
      toast.success(data.message || 'Item added to cart!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add item to cart');
    },
  });

  // Update cart item mutation
  const updateCartMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartApi.updateCartItem(cartItemId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-summary'] });
      toast.success(data.message || 'Cart updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update cart');
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-summary'] });
      toast.success(data.message || 'Item removed from cart!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove item from cart');
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-summary'] });
      toast.success(data.message || 'Cart cleared!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to clear cart');
    },
  });

  const contextValue: CartContextType = {
    cartItems,
    cartSummary,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateCartItem: (cartItemId: number, quantity: number) =>
      updateCartMutation.mutate({ cartItemId, quantity }),
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};


// Hook for non-authenticated users (guest cart functionality)
export const useGuestCart = () => {
  const [guestCartItems, setGuestCartItems] = React.useState<any[]>([]);
  
  const addToGuestCart = (item: AddToCartData) => {
    setGuestCartItems(prev => {
      const existingIndex = prev.findIndex(
        p => p.productId === item.productId && p.size === item.size
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity || 1;
        return updated;
      }
      
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    
    toast.success('Item added to cart! Sign in to save your cart.');
  };

  const removeFromGuestCart = (productId: number, size?: string) => {
    setGuestCartItems(prev => 
      prev.filter(item => !(item.productId === productId && item.size === size))
    );
  };

  const clearGuestCart = () => {
    setGuestCartItems([]);
  };

  return {
    guestCartItems,
    addToGuestCart,
    removeFromGuestCart,
    clearGuestCart,
    guestCartCount: guestCartItems.reduce((sum, item) => sum + item.quantity, 0),
  };
};
