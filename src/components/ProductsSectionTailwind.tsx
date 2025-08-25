import React from 'react';
import products from '@/data/products.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';

const featuredProducts = products.slice(0, 3).map((p: any, i: number) => ({
  id: i + 1,
  name: p.name,
  price: p.price,
  originalPrice: undefined,
  rating: 4.6,
  reviews: 10,
  image: p.images?.[0] || '/placeholder.svg',
  category: p.category || 'Products',
  featured: true
}));

export const ProductsSectionTailwind = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular wellness products, carefully selected for their 
            quality and effectiveness. Each product is backed by science and loved by customers.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                      Featured
                    </Badge>
                  )}
                    {product.originalPrice !== undefined && product.originalPrice > (product.price as any) && (
                    <Badge variant="destructive" className="absolute top-4 right-4">
                      Sale
                    </Badge>
                  )}
                </div>
                
                <div className="p-6">
                  <Badge variant="outline" className="mb-3 text-green-600 border-green-600">
                    {product.category}
                  </Badge>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(Number(product.rating))
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      {product.price}
                    </span>
                    {product.originalPrice !== undefined && product.originalPrice > (product.price as any) && (
                      <span className="text-lg text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white group">
                  Add to Cart
                  <ShoppingCart className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
            <Button 
            size="lg" 
            variant="ghost" 
            className="border-green-600 text-green-600 hover:bg-green-50 px-8"
            onClick={() => window.location.href = '/products'}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSectionTailwind;