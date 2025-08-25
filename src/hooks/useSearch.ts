import { useState, useCallback, useMemo, useEffect } from 'react';
import { ProductFilters } from '@/components/SearchFilters';

export interface SearchableItem {
  id: string;
  name: string;
  category?: string;
  brand?: string;
  price?: number;
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
  popularity?: number;
  description?: string;
  tags?: string[];
}

export interface UseSearchOptions<T extends SearchableItem> {
  items: T[];
  searchFields?: (keyof T)[];
  debounceMs?: number;
  caseSensitive?: boolean;
}

export interface UseSearchResult<T extends SearchableItem> {
  filteredItems: T[];
  searchQuery: string;
  filters: ProductFilters;
  isLoading: boolean;
  totalCount: number;
  handleSearchChange: (query: string) => void;
  handleFiltersChange: (filters: ProductFilters) => void;
  clearSearch: () => void;
  clearFilters: () => void;
  clearAll: () => void;
}

export function useSearch<T extends SearchableItem>({
  items,
  searchFields = ['name', 'description', 'tags'] as (keyof T)[],
  debounceMs = 300,
  caseSensitive = false,
}: UseSearchOptions<T>): UseSearchResult<T> {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    // Don't show loading on initial render when query is empty
    if (searchQuery !== debouncedQuery) {
      setIsLoading(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsLoading(false);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [searchQuery, debounceMs, debouncedQuery]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Apply text search
    if (debouncedQuery.trim()) {
      const query = caseSensitive ? debouncedQuery : debouncedQuery.toLowerCase();
      const terms = query.split(/\s+/).filter(term => term.length > 0);

      result = result.filter(item => {
        return terms.every(term => {
          return searchFields.some(field => {
            const value = item[field];
            if (typeof value === 'string') {
              const searchText = caseSensitive ? value : value.toLowerCase();
              return searchText.includes(term);
            }
            if (Array.isArray(value)) {
              return value.some(v => {
                const searchText = caseSensitive ? String(v) : String(v).toLowerCase();
                return searchText.includes(term);
              });
            }
            return false;
          });
        });
      });
    }

    // Apply filters
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }

    if (filters.brand) {
      result = result.filter(item => item.brand === filters.brand);
    }

    if (filters.priceMin !== undefined) {
      result = result.filter(item => 
        item.price !== undefined && item.price >= filters.priceMin!
      );
    }

    if (filters.priceMax !== undefined) {
      result = result.filter(item => 
        item.price !== undefined && item.price <= filters.priceMax!
      );
    }

    if (filters.inStock) {
      result = result.filter(item => item.inStock === true);
    }

    if (filters.featured) {
      result = result.filter(item => item.featured === true);
    }

    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'popular':
            return (b.popularity || 0) - (a.popularity || 0);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [items, debouncedQuery, filters, searchFields, caseSensitive]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const clearAll = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setFilters({});
  }, []);

  return {
    filteredItems,
    searchQuery,
    filters,
    isLoading,
    totalCount: items.length,
    handleSearchChange,
    handleFiltersChange,
    clearSearch,
    clearFilters,
    clearAll,
  };
}

// Helper hook for extracting unique values from items
export function useSearchMetadata<T extends SearchableItem>(items: T[]) {
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    items.forEach(item => {
      if (item.category) {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
      }
    });

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
    }));
  }, [items]);

  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    items.forEach(item => {
      if (item.brand) {
        brandSet.add(item.brand);
      }
    });
    return Array.from(brandSet).sort();
  }, [items]);

  const priceRange = useMemo((): [number, number] => {
    const prices = items
      .map(item => item.price)
      .filter((price): price is number => typeof price === 'number');
    
    if (prices.length === 0) {
      return [0, 100];
    }

    return [Math.min(...prices), Math.max(...prices)];
  }, [items]);

  return {
    categories,
    brands,
    priceRange,
  };
}
