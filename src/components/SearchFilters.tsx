import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { cn } from '@/lib/utils';

export interface SearchFiltersProps {
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: ProductFilters) => void;
  categories?: Category[];
  brands?: string[];
  priceRange?: [number, number];
  className?: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: 'name' | 'price-low' | 'price-high' | 'rating' | 'popular';
}

interface Category {
  id: string;
  name: string;
  count?: number;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSearchChange,
  onFiltersChange,
  categories = [],
  brands = [],
  priceRange = [0, 200],
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [priceValues, setPriceValues] = useState<[number, number]>(priceRange);
  
  const isAdvancedSearchEnabled = useFeatureFlag('ADVANCED_SEARCH');

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  }, [onSearchChange]);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  }, [filters, onFiltersChange]);

  const clearFilters = () => {
    const clearedFilters: ProductFilters = {};
    setFilters(clearedFilters);
    setPriceValues(priceRange);
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(key => 
      filters[key as keyof ProductFilters] !== undefined
    ).length;
  }, [filters]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-12"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={() => handleSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Quick Sort */}
        <Select
          value={filters.sortBy || ''}
          onValueChange={(value: any) => updateFilters({ sortBy: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      {showFilters && isAdvancedSearchEnabled && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filters</CardTitle>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={filters.category === category.id}
                        onCheckedChange={(checked) =>
                          updateFilters({
                            category: checked ? category.id : undefined
                          })
                        }
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category.name}
                        {category.count && (
                          <span className="ml-2 text-muted-foreground">
                            ({category.count})
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Price Range */}
            <div>
              <h4 className="mb-3 text-sm font-medium">
                Price Range: ${priceValues[0]} - ${priceValues[1]}
              </h4>
              <Slider
                value={priceValues}
                onValueChange={(value: any) => setPriceValues(value)}
                onValueCommit={(value: any) => updateFilters({
                  priceMin: value[0],
                  priceMax: value[1]
                })}
                min={priceRange[0]}
                max={priceRange[1]}
                step={5}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Brands */}
            {brands.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium">Brands</h4>
                <Select
                  value={filters.brand || ''}
                  onValueChange={(value) => updateFilters({ 
                    brand: value === 'all' ? undefined : value 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            {/* Stock & Features */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Availability</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock || false}
                  onCheckedChange={(checked) =>
                    updateFilters({ inStock: checked || undefined })
                  }
                />
                <label
                  htmlFor="in-stock"
                  className="text-sm leading-none cursor-pointer"
                >
                  In Stock Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={filters.featured || false}
                  onCheckedChange={(checked) =>
                    updateFilters({ featured: checked || undefined })
                  }
                />
                <label
                  htmlFor="featured"
                  className="text-sm leading-none cursor-pointer"
                >
                  Featured Products
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (value === undefined) return null;
            
            let displayValue = String(value);
            if (key === 'category') {
              const category = categories.find(c => c.id === value);
              displayValue = category?.name || displayValue;
            }
            
            return (
              <Badge
                key={key}
                variant="secondary"
                className="gap-1"
              >
                {key}: {displayValue}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => updateFilters({ [key]: undefined })}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
