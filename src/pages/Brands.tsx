import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Star, Award, Leaf, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Brands = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const brands = [
    {
      id: 1,
      name: 'Nature\'s Way',
      logo: '/api/placeholder/120/60',
      description: 'Premium natural supplements since 1969',
      rating: 4.8,
      productCount: 156,
      categories: ['Vitamins', 'Herbs', 'Probiotics'],
      featured: true,
      organic: true,
    },
    {
      id: 2,
      name: 'Garden of Life',
      logo: '/api/placeholder/120/60',
      description: 'Whole food nutrition and organic supplements',
      rating: 4.7,
      productCount: 89,
      categories: ['Organic', 'Probiotics', 'Protein'],
      featured: true,
      organic: true,
    },
    {
      id: 3,
      name: 'NOW Foods',
      logo: '/api/placeholder/120/60',
      description: 'Quality natural products since 1968',
      rating: 4.6,
      productCount: 234,
      categories: ['Vitamins', 'Sports', 'Essential Oils'],
      featured: false,
      organic: false,
    },
    {
      id: 4,
      name: 'Solgar',
      logo: '/api/placeholder/120/60',
      description: 'Gold standard in nutritional supplements',
      rating: 4.9,
      productCount: 178,
      categories: ['Vitamins', 'Minerals', 'Specialty'],
      featured: true,
      organic: false,
    },
    {
      id: 5,
      name: 'Nordic Naturals',
      logo: '/api/placeholder/120/60',
      description: 'Pure omega-3 fish oils and supplements',
      rating: 4.8,
      productCount: 67,
      categories: ['Omega-3', 'Fish Oil', 'Kids'],
      featured: false,
      organic: false,
    },
    {
      id: 6,
      name: 'Thorne Health',
      logo: '/api/placeholder/120/60',
      description: 'Science-based nutritional supplements',
      rating: 4.9,
      productCount: 145,
      categories: ['Clinical', 'Testing', 'Personalized'],
      featured: true,
      organic: false,
    },
  ];

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredBrands = brands.filter(brand => brand.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Brands</h1>
              <p className="text-gray-600 mt-2">Discover trusted wellness brands we partner with</p>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Brands */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Brands</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBrands.map((brand) => (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow group">
                  <CardHeader className="text-center">
                    <div className="w-32 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center border">
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2">
                      {brand.name}
                      {brand.organic && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Leaf className="w-3 h-3 mr-1" />
                          Organic
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      {brand.description}
                    </p>
                    
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{brand.rating}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({brand.productCount} products)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4 justify-center">
                      {brand.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>

                    <Link to={`/products?brand=${brand.id}`}>
                      <Button className="w-full group-hover:bg-primary-600">
                        View Products
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Brands */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchQuery ? `Search Results (${filteredBrands.length})` : 'All Brands'}
          </h2>
          
          {filteredBrands.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or browse all brands.
              </p>
              <Button onClick={() => setSearchQuery('')} variant="outline">
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand) => (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-8 bg-white rounded border flex items-center justify-center flex-shrink-0">
                        <img 
                          src={brand.logo} 
                          alt={brand.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {brand.name}
                          </h3>
                          {brand.featured && (
                            <Award className="w-4 h-4 text-yellow-500" />
                          )}
                          {brand.organic && (
                            <Leaf className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {brand.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="ml-1 text-xs text-gray-600">{brand.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {brand.productCount} products
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Link to={`/products?brand=${brand.id}`}>
                        <Button size="sm" className="w-full">
                          View Products
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Brand Partnership Info */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8 text-center">
              <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Partner with Better Being
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Are you a wellness brand looking to reach more customers? Join our curated marketplace 
                and connect with health-conscious consumers across South Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button>Become a Partner</Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Brands;