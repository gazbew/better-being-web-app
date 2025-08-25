import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Percent, Tag, Flame, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Deals = () => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  const flashDeals = [
    {
      id: 1,
      name: 'Premium Multivitamin Complex',
      originalPrice: 399,
      salePrice: 239,
      discount: 40,
      image: '/api/placeholder/200/200',
      rating: 4.8,
      reviews: 156,
      stock: 23,
      totalStock: 100,
      category: 'Vitamins',
    },
    {
      id: 2,
      name: 'Organic Omega-3 Fish Oil',
      originalPrice: 299,
      salePrice: 179,
      discount: 40,
      image: '/api/placeholder/200/200',
      rating: 4.7,
      reviews: 89,
      stock: 45,
      totalStock: 80,
      category: 'Supplements',
    },
    {
      id: 3,
      name: 'Collagen Beauty Powder',
      originalPrice: 499,
      salePrice: 349,
      discount: 30,
      image: '/api/placeholder/200/200',
      rating: 4.9,
      reviews: 234,
      stock: 12,
      totalStock: 50,
      category: 'Beauty',
    },
  ];

  const weeklyDeals = [
    {
      id: 4,
      name: 'Probiotic Complex 50 Billion CFU',
      originalPrice: 349,
      salePrice: 279,
      discount: 20,
      image: '/api/placeholder/200/200',
      rating: 4.6,
      reviews: 67,
      category: 'Digestive Health',
    },
    {
      id: 5,
      name: 'Vitamin D3 + K2 Drops',
      originalPrice: 199,
      salePrice: 159,
      discount: 20,
      image: '/api/placeholder/200/200',
      rating: 4.8,
      reviews: 123,
      category: 'Vitamins',
    },
    {
      id: 6,
      name: 'Ashwagandha Root Extract',
      originalPrice: 249,
      salePrice: 199,
      discount: 20,
      image: '/api/placeholder/200/200',
      rating: 4.7,
      reviews: 89,
      category: 'Herbs',
    },
  ];

  const bundleDeals = [
    {
      id: 'bundle1',
      name: 'Complete Wellness Bundle',
      products: ['Multivitamin', 'Omega-3', 'Probiotic'],
      originalPrice: 897,
      bundlePrice: 599,
      savings: 298,
      image: '/api/placeholder/300/200',
    },
    {
      id: 'bundle2',
      name: 'Beauty & Glow Bundle',
      products: ['Collagen', 'Biotin', 'Vitamin C'],
      originalPrice: 747,
      bundlePrice: 499,
      savings: 248,
      image: '/api/placeholder/300/200',
    },
  ];

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart({
        productId,
        quantity: 1,
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔥 Hot Deals & Offers
            </h1>
            <p className="text-gray-600">Limited time offers on premium wellness products</p>
          </div>
        </div>

        {/* Flash Sale Timer */}
        <Card className="mb-12 bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 mr-2" />
              <h2 className="text-2xl font-bold">Flash Sale - Ends Soon!</h2>
            </div>
            <div className="flex items-center justify-center space-x-4 text-2xl font-mono">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="font-bold">{timeLeft.hours}</div>
                <div className="text-sm">Hours</div>
              </div>
              <div className="text-3xl">:</div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="font-bold">{timeLeft.minutes}</div>
                <div className="text-sm">Minutes</div>
              </div>
              <div className="text-3xl">:</div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="font-bold">{timeLeft.seconds}</div>
                <div className="text-sm">Seconds</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flash Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Flame className="w-6 h-6 mr-2 text-red-500" />
            Flash Deals - Up to 40% Off
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashDeals.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow relative overflow-hidden">
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-red-500 text-white">
                    -{product.discount}%
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Limited
                  </Badge>
                </div>
                
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {product.category}
                    </Badge>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{product.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <span className="text-xl font-bold text-red-600">
                        R{product.salePrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        R{product.originalPrice}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Stock: {product.stock} left</span>
                        <span>{Math.round((product.stock / product.totalStock) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(product.stock / product.totalStock) * 100} 
                        className="h-2"
                      />
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Weekly Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Percent className="w-6 h-6 mr-2 text-green-500" />
            Weekly Deals - 20% Off
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyDeals.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-square bg-gray-200">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                      -{product.discount}%
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {product.category}
                    </Badge>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{product.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-center mb-4">
                      <span className="text-xl font-bold text-green-600">
                        R{product.salePrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        R{product.originalPrice}
                      </span>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bundle Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Tag className="w-6 h-6 mr-2 text-blue-500" />
            Bundle Deals - Save More
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bundleDeals.map((bundle) => (
              <Card key={bundle.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img 
                        src={bundle.image} 
                        alt={bundle.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {bundle.name}
                      </h3>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {bundle.products.map((product, index) => (
                            <Badge key={index} variant="secondary">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">
                            R{bundle.bundlePrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through ml-2">
                            R{bundle.originalPrice}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Save R{bundle.savings}
                        </Badge>
                      </div>
                      <Button className="w-full">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add Bundle to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Never Miss a Deal!</h3>
            <p className="mb-6">Subscribe to get exclusive offers and early access to sales</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900"
              />
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deals;