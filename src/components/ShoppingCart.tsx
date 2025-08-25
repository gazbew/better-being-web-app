import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ShoppingCart as ShoppingCartIcon, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  ShoppingBag,
  ArrowRight,
  Package,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

import { api } from '@/services/api';

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  size?: string;
  created_at: string;
  updated_at: string;
  product_name: string;
  product_description: string;
  product_image: string;
  product_price: string;
  product_original_price?: string;
  product_in_stock: boolean;
  product_stock_count: number;
  category_name?: string;
}

interface CartSummary {
  subtotal: string;
  originalTotal: string;
  savings: string;
  tax: string;
  shipping: string;
  total: string;
  quantity: number;
  itemCount: number;
  freeShippingEligible: boolean;
  freeShippingRemaining: string;
}

interface Cart {
  items: CartItem[];
  summary: CartSummary;
  isEmpty: boolean;
}

export default function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch cart data
  const { data: cartResponse, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.getCart(),
    refetchOnWindowFocus: false,
  });

  // Fetch cart count for badge
  const { data: countResponse } = useQuery({
    queryKey: ['cart-count'],
    queryFn: () => api.getCartCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const cart: Cart = cartResponse?.data?.cart || { items: [], summary: {} as CartSummary, isEmpty: true };
  const cartCount = countResponse?.data?.itemCount || 0;

  // Mutations
  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      api.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['cart-count']);
      toast.success('Cart updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update cart');
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => api.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['cart-count']);
      toast.success('Item removed from cart');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove item');
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => api.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['cart-count']);
      toast.success('Cart cleared');
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to clear cart');
    },
  });

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCartMutation.mutate();
    }
  };

  // Calculate savings display
  const hasSavings = cart.summary.savings && parseFloat(cart.summary.savings.replace('R', '')) > 0;
  const freeShippingRemaining = parseFloat(cart.summary.freeShippingRemaining || '0');

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCartIcon className="h-4 w-4" />
          {cartCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {cartCount > 0 && (
              <Badge variant="secondary">{cartCount} item{cartCount !== 1 ? 's' : ''}</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {cart.isEmpty ? 'Your cart is empty' : 'Review your items and checkout'}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : cart.isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6 text-center">
              Your cart is empty.<br />
              Start shopping to add items!
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link to="/products">
                Browse Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.items.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    isUpdating={updateQuantityMutation.isLoading}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Free Shipping Progress */}
            {!cart.summary.freeShippingEligible && freeShippingRemaining > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">
                    Free shipping at R500
                  </span>
                  <span className="text-sm text-green-600">
                    R{freeShippingRemaining.toFixed(2)} to go
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.max(10, (500 - freeShippingRemaining) / 500 * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}

            {/* Cart Summary */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{cart.summary.subtotal}</span>
              </div>

              {hasSavings && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>You save</span>
                  <span>-{cart.summary.savings}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (15%)</span>
                <span>{cart.summary.tax}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className={cart.summary.freeShippingEligible ? 'text-green-600' : ''}>
                  {cart.summary.freeShippingEligible ? 'FREE' : cart.summary.shipping}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-green-600">{cart.summary.total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button asChild className="w-full h-12 text-lg font-semibold">
                <Link to="/checkout" onClick={() => setIsOpen(false)}>
                  Checkout
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/products" className="flex items-center">
                    Continue Shopping
                  </Link>
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearCart}
                  disabled={clearCartMutation.isLoading}
                  className="text-red-600 hover:text-red-700"
                >
                  {clearCartMutation.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Cart Item Component
interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isUpdating: boolean;
}

function CartItemComponent({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemComponentProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  const itemTotal = (parseFloat(item.product_price) * item.quantity).toFixed(2);
  const hasDiscount = item.product_original_price && 
    parseFloat(item.product_original_price) > parseFloat(item.product_price);

  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={item.product_image}
          alt={item.product_name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">
          {item.product_name}
        </h4>
        
        {item.category_name && (
          <Badge variant="secondary" className="text-xs mb-2">
            {item.category_name}
          </Badge>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-green-600">
              R{item.product_price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                R{item.product_original_price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity Controls */}
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={isUpdating || quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
                {quantity}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isUpdating || quantity >= item.product_stock_count}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={() => onRemove(item.id)}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stock warning */}
        {!item.product_in_stock && (
          <div className="mt-2 text-xs text-red-600">
            Out of stock
          </div>
        )}
        
        {item.product_stock_count < 5 && item.product_in_stock && (
          <div className="mt-2 text-xs text-orange-600">
            Only {item.product_stock_count} left in stock
          </div>
        )}

        {/* Item total */}
        <div className="mt-2 text-sm font-semibold text-right">
          Total: R{itemTotal}
        </div>
      </div>
    </div>
  );
}