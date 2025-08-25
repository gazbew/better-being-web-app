import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category: string;
    inStock: boolean;
  };
  dateAdded: string;
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate loading wishlist items
    setTimeout(() => {
      setWishlistItems([
        {
          id: 1,
          product: {
            id: 1,
            name: 'Premium Multivitamin Complex',
            price: 299,
            originalPrice: 399,
            category: 'Vitamins',
            inStock: true,
          },
          dateAdded: '2025-01-15',
        },
        {
          id: 2,
          product: {
            id: 2,
            name: 'Organic Omega-3 Fish Oil',
            price: 249,
            category: 'Supplements',
            inStock: true,
          },
          dateAdded: '2025-01-10',
        },
        {
          id: 3,
          product: {
            id: 3,
            name: 'Collagen Beauty Powder',
            price: 399,
            category: 'Beauty',
            inStock: false,
          },
          dateAdded: '2025-01-08',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      await addToCart({
        productId: item.product.id,
        quantity: 1,
      });
      toast.success(`${item.product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleRemoveFromWishlist = (itemId: number) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId));
    toast.success('Item removed from wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Better Being Wishlist',
        text: 'Check out my wishlist on Better Being!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Wishlist link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8">Save items you love for later by clicking the heart icon.</p>
            <div className="space-y-4">
              <Link to="/products">
                <Button size="lg">
                  Discover Products
                </Button>
              </Link>
              <div>
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">{wishlistItems.length} items saved</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Wishlist
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-square bg-gray-200 rounded-t-lg">
                    {item.product.image ? (
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-t-lg flex items-center justify-center">
                        <Heart className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  {!item.product.inStock && (
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {item.product.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.product.name}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-lg font-bold text-green-600">
                      R{item.product.price}
                    </span>
                    {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        R{item.product.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {item.product.inStock ? 'Add to Cart' : 'Notify Me'}
                    </Button>
                    <Link to={`/products/${item.product.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;