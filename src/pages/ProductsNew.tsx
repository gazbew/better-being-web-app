import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart, 
  Grid3X3, 
  List, 
  ChevronDown,
  X,
  Loader2,
  Package,
  TrendingUp,
  Award
} from 'lucide-react';

import { NavigationPrimary } from '@/components/NavigationPrimary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

import { api } from '@/services/api';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  original_price?: string;
  rating: string;
  reviews_count: number;
  image_url: string;
  in_stock: boolean;
  stock_count: number;
  is_featured: boolean;
  is_popular: boolean;
  category_name?: string;
  category_slug?: string;
  subcategory_name?: string;
  benefits?: string[];
  ingredients?: string[];
  tags?: string[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  product_count: number;
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Alphabetical' },
];

export default function ProductsNew() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Get current filters from URL params
  const currentSort = searchParams.get('sort') || 'relevance';
  const currentCategory = searchParams.get('category');
  const currentPage = parseInt(searchParams.get('page') || '1');
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
  });

  // Fetch products
  const { data: productsResponse, isLoading, error } = useQuery({
    queryKey: [
      'products',
      searchQuery,
      currentSort,
      currentCategory,
      selectedCategories,
      priceRange,
      onlyInStock,
      onlyFeatured,
      minRating,
      offset,
      limit,
    ],
    queryFn: () => api.searchProducts({
      query: searchQuery || undefined,
      category: currentCategory || undefined,
      sort: currentSort as any,
      priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
      priceMax: priceRange[1] < 1000 ? priceRange[1] : undefined,
      inStock: onlyInStock || undefined,
      featured: onlyFeatured || undefined,
      rating: minRating > 0 ? minRating : undefined,
      limit,
      offset,
    }),
    keepPreviousData: true,
  });

  const categories: Category[] = categoriesResponse?.data?.categories || [];
  const products: Product[] = productsResponse?.data?.products || [];
  const totalProducts = productsResponse?.data?.total || 0;
  const hasMore = productsResponse?.data?.hasMore || false;

  // Update URL when search changes
  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Reset page when filters change
    if (!updates.page) {
      newParams.delete('page');
    }
    
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ query: searchQuery || undefined });
  };

  const handleSortChange = (sort: string) => {
    updateSearchParams({ sort });
  };

  const handleCategoryChange = (category: string) => {
    updateSearchParams({ category: category === currentCategory ? undefined : category });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setOnlyInStock(false);
    setOnlyFeatured(false);
    setMinRating(0);
    setSearchParams({});
  };

  const activeFiltersCount = [
    searchQuery,
    currentCategory,
    priceRange[0] > 0 || priceRange[1] < 1000,
    onlyInStock,
    onlyFeatured,
    minRating > 0,
  ].filter(Boolean).length;

  // Handle add to cart
  const handleAddToCart = async (productId: number) => {
    try {
      const response = await api.addToCart(productId, 1);
      if (response.success) {
        toast.success('Added to cart!');
      } else {
        toast.error(response.error || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">
      <NavigationPrimary />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Premium Wellness Products
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Discover our curated collection of natural supplements, superfoods, and wellness essentials
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-gray-900 bg-white"
                />
              </div>
              <Button type="submit" size="lg" variant="secondary">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear ({activeFiltersCount})
                  </Button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-medium">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.slug} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.slug}
                        checked={currentCategory === category.slug}
                        onCheckedChange={() => handleCategoryChange(category.slug)}
                      />
                      <label
                        htmlFor={category.slug}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                      >
                        {category.name}
                        <span className="text-gray-400 ml-1">({category.product_count})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="font-medium">Price Range</h4>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}+</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Additional Filters */}
              <div className="space-y-4">
                <h4 className="font-medium">Additional Filters</h4>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={onlyInStock}
                    onCheckedChange={setOnlyInStock}
                  />
                  <label htmlFor="in-stock" className="text-sm cursor-pointer">
                    In Stock Only
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={onlyFeatured}
                    onCheckedChange={setOnlyFeatured}
                  />
                  <label htmlFor="featured" className="text-sm cursor-pointer">
                    Featured Products
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Rating</label>
                  <Select value={minRating.toString()} onValueChange={(v) => setMinRating(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your product search
                  </SheetDescription>
                </SheetHeader>
                {/* Mobile filters content - same as desktop */}
                <div className="mt-6">
                  {/* Same filter content as desktop sidebar */}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
                </span>
                {searchQuery && (
                  <Badge variant="secondary">
                    "{searchQuery}"
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort Dropdown */}
                <Select value={currentSort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <Skeleton className="h-48 w-full" />
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Failed to load products. Please try again.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No products found matching your criteria.</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
              }>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalProducts > limit && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => updateSearchParams({ page: (currentPage - 1).toString() })}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.ceil(totalProducts / limit) }).map((_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;
                    
                    if (
                      page === 1 ||
                      page === Math.ceil(totalProducts / limit) ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={isActive ? "default" : "outline"}
                          onClick={() => updateSearchParams({ page: page.toString() })}
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}

                  <Button
                    variant="outline"
                    disabled={!hasMore}
                    onClick={() => updateSearchParams({ page: (currentPage + 1).toString() })}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (productId: number) => void;
}

function ProductCard({ product, viewMode, onAddToCart }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await onAddToCart(product.id);
    setIsAddingToCart(false);
  };

  const discountPercentage = product.original_price 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.original_price)) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="w-48 h-32 relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.in_stock && (
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
            {product.is_featured && (
              <Badge className="absolute top-2 left-2 bg-green-600">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link 
                  to={`/products/${product.id}`}
                  className="hover:text-green-600 transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">{product.rating}</span>
                    <span className="text-gray-400 text-sm ml-1">({product.reviews_count})</span>
                  </div>
                  
                  {product.category_name && (
                    <Badge variant="secondary">{product.category_name}</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      R{product.price}
                    </span>
                    {product.original_price && (
                      <>
                        <span className="text-gray-400 line-through">
                          R{product.original_price}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          -{discountPercentage}%
                        </Badge>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleAddToCart}
                      disabled={!product.in_stock || isAddingToCart}
                      className="min-w-[120px]"
                    >
                      {isAddingToCart ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {!product.in_stock && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <Badge className="bg-green-600">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {product.is_popular && (
            <Badge className="bg-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <Link 
          to={`/products/${product.id}`}
          className="hover:text-green-600 transition-colors"
        >
          <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm ml-1">{product.rating}</span>
          <span className="text-gray-400 text-sm ml-1">({product.reviews_count})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-green-600">
              R{product.price}
            </span>
            {product.original_price && (
              <span className="text-gray-400 line-through text-sm ml-2">
                R{product.original_price}
              </span>
            )}
          </div>
          
          {product.category_name && (
            <Badge variant="secondary" className="text-xs">
              {product.category_name}
            </Badge>
          )}
        </div>

        <Button 
          onClick={handleAddToCart}
          disabled={!product.in_stock || isAddingToCart}
          className="w-full"
        >
          {isAddingToCart ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ShoppingCart className="h-4 w-4 mr-2" />
          )}
          {!product.in_stock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
}