import React, { useState, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, Users, Heart, ShoppingBag, 
  Clock, Zap, RefreshCw, ChevronLeft, ChevronRight,
  Brain, Target, Gift, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  discount?: number;
  inStock: boolean;
}

interface RecommendationReason {
  type: 'purchase_history' | 'browsing' | 'trending' | 'similar' | 'personalized' | 'deal';
  message: string;
  confidence: number;
}

interface Recommendation {
  product: Product;
  reason: RecommendationReason;
  score: number;
}

interface RecommendationEngineProps {
  currentProductId?: string;
  userId?: string;
  context?: 'homepage' | 'product' | 'cart' | 'checkout';
}

// Product Card Component
const RecommendationCard: React.FC<{
  recommendation: Recommendation;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}> = ({ recommendation, onAddToCart, onAddToWishlist }) => {
  const { product, reason } = recommendation;
  const [isHovered, setIsHovered] = useState(false);

  const getReasonIcon = () => {
    switch (reason.type) {
      case 'purchase_history':
        return <ShoppingBag className="w-3 h-3" />;
      case 'browsing':
        return <Clock className="w-3 h-3" />;
      case 'trending':
        return <TrendingUp className="w-3 h-3" />;
      case 'similar':
        return <Users className="w-3 h-3" />;
      case 'personalized':
        return <Brain className="w-3 h-3" />;
      case 'deal':
        return <Zap className="w-3 h-3" />;
      default:
        return <Sparkles className="w-3 h-3" />;
    }
  };

  const getReasonColor = () => {
    switch (reason.type) {
      case 'purchase_history':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'browsing':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'trending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'similar':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'personalized':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'deal':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card 
      className="group relative overflow-hidden hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Confidence Indicator */}
      {reason.confidence > 0.8 && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
            <Target className="w-3 h-3 mr-1" />
            Perfect Match
          </Badge>
        </div>
      )}

      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="destructive" className="font-bold">
            -{product.discount}%
          </Badge>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300",
            isHovered && "scale-110"
          )}
        />
        
        {/* Quick Actions Overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white hover:bg-gray-100"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white hover:bg-gray-100"
            onClick={() => onAddToWishlist(product)}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Recommendation Reason */}
        <div className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2 border",
          getReasonColor()
        )}>
          {getReasonIcon()}
          <span>{reason.message}</span>
        </div>

        {/* Product Info */}
        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">R{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              R{product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {!product.inStock && (
          <Badge variant="outline" className="mt-2 text-xs">
            Out of Stock
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

// Recommendation Section Component
const RecommendationSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  recommendations: Recommendation[];
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  showNavigation?: boolean;
}> = ({ 
  title, 
  icon, 
  recommendations, 
  onAddToCart, 
  onAddToWishlist,
  showNavigation = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleRecommendations = recommendations.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-xl font-bold">{title}</h3>
          <Badge variant="secondary">{recommendations.length} items</Badge>
        </div>
        
        {showNavigation && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={currentIndex === totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleRecommendations.map((rec, index) => (
          <RecommendationCard
            key={`${rec.product.id}-${index}`}
            recommendation={rec}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </div>
    </div>
  );
};

// Main Recommendation Engine Component
export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  currentProductId,
  userId,
  context = 'homepage'
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<{
    personalized: Recommendation[];
    trending: Recommendation[];
    deals: Recommendation[];
    similar: Recommendation[];
    recentlyViewed: Recommendation[];
  }>({
    personalized: [],
    trending: [],
    deals: [],
    similar: [],
    recentlyViewed: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');

  useEffect(() => {
    fetchRecommendations();
  }, [currentProductId, userId, context]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual AI recommendation API
      const mockRecommendations = {
        personalized: [
          {
            product: {
              id: '1',
              name: 'Premium Multivitamin Complex',
              price: 599,
              originalPrice: 799,
              image: '/api/placeholder/300/300',
              category: 'Vitamins',
              rating: 4.8,
              reviews: 234,
              discount: 25,
              inStock: true
            },
            reason: {
              type: 'personalized' as const,
              message: 'Based on your wellness goals',
              confidence: 0.92
            },
            score: 0.92
          },
          {
            product: {
              id: '2',
              name: 'Organic Omega-3 Fish Oil',
              price: 449,
              image: '/api/placeholder/300/300',
              category: 'Supplements',
              rating: 4.6,
              reviews: 189,
              inStock: true
            },
            reason: {
              type: 'purchase_history' as const,
              message: 'Customers also bought',
              confidence: 0.85
            },
            score: 0.85
          }
        ],
        trending: [
          {
            product: {
              id: '3',
              name: 'Immunity Booster Pack',
              price: 899,
              originalPrice: 1199,
              image: '/api/placeholder/300/300',
              category: 'Bundles',
              rating: 4.9,
              reviews: 567,
              badge: 'Bestseller',
              discount: 25,
              inStock: true
            },
            reason: {
              type: 'trending' as const,
              message: 'Trending this week',
              confidence: 0.78
            },
            score: 0.78
          }
        ],
        deals: [
          {
            product: {
              id: '4',
              name: 'Vitamin C 1000mg',
              price: 199,
              originalPrice: 399,
              image: '/api/placeholder/300/300',
              category: 'Vitamins',
              rating: 4.5,
              reviews: 123,
              discount: 50,
              inStock: true
            },
            reason: {
              type: 'deal' as const,
              message: 'Limited time offer',
              confidence: 0.95
            },
            score: 0.95
          }
        ],
        similar: [],
        recentlyViewed: []
      };

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  };

  const handleAddToWishlist = async (product: Product) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ productId: product.id })
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleRefresh = () => {
    fetchRecommendations();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Personalizing recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Recommendations</h2>
            <p className="text-sm text-muted-foreground">
              Personalized picks powered by machine learning
            </p>
          </div>
        </div>
        
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Recommendation Stats */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {recommendations.personalized.length}
                </div>
                <p className="text-xs text-muted-foreground">Personalized</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {recommendations.trending.length}
                </div>
                <p className="text-xs text-muted-foreground">Trending</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {recommendations.deals.length}
                </div>
                <p className="text-xs text-muted-foreground">Deals</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  85%
                </div>
                <p className="text-xs text-muted-foreground">Match Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabbed Recommendations */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="for-you">
            <Sparkles className="w-4 h-4 mr-2" />
            For You
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="deals">
            <Zap className="w-4 h-4 mr-2" />
            Deals
          </TabsTrigger>
          <TabsTrigger value="bundles">
            <Gift className="w-4 h-4 mr-2" />
            Bundles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="for-you" className="space-y-8 mt-6">
          {recommendations.personalized.length > 0 && (
            <RecommendationSection
              title="Picked For You"
              icon={<Brain className="w-5 h-5 text-primary" />}
              recommendations={recommendations.personalized}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              showNavigation
            />
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-8 mt-6">
          {recommendations.trending.length > 0 && (
            <RecommendationSection
              title="Trending Now"
              icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
              recommendations={recommendations.trending}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              showNavigation
            />
          )}
        </TabsContent>

        <TabsContent value="deals" className="space-y-8 mt-6">
          {recommendations.deals.length > 0 && (
            <RecommendationSection
              title="Today's Deals"
              icon={<Zap className="w-5 h-5 text-red-500" />}
              recommendations={recommendations.deals}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              showNavigation
            />
          )}
        </TabsContent>

        <TabsContent value="bundles" className="mt-6">
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Bundle Deals Coming Soon</h3>
            <p className="text-muted-foreground">
              Save more with our curated wellness bundles
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Frequently Bought Together */}
      {context === 'product' && currentProductId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Frequently Bought Together
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {/* Bundle visualization would go here */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg" />
                  <span className="text-2xl">+</span>
                  <div className="w-20 h-20 bg-gray-100 rounded-lg" />
                  <span className="text-2xl">+</span>
                  <div className="w-20 h-20 bg-gray-100 rounded-lg" />
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-bold">R1,247</span>
                  <Badge variant="secondary" className="ml-2">Save R150</Badge>
                </div>
                <Button className="w-full max-w-xs">
                  Add Bundle to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
