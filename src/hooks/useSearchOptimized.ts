import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
  maxResults?: number;
}

export interface UseSearchResult<T extends SearchableItem> {
  filteredItems: T[];
  searchQuery: string;
  filters: ProductFilters;
  isLoading: boolean;
  totalCount: number;
  resultCount: number;
  handleSearchChange: (query: string) => void;
  handleFiltersChange: (filters: ProductFilters) => void;
  clearSearch: () => void;
  clearFilters: () => void;
  clearAll: () => void;
}

// Optimized search hook with performance improvements
export function useSearchOptimized<T extends SearchableItem>({
  items,
  searchFields = ['name', 'description', 'tags'] as (keyof T)[],
  debounceMs = 150, // Reduced debounce for better UX
  caseSensitive = false,
  maxResults = 100, // Limit results for better performance
}: UseSearchOptions<T>): UseSearchResult<T> {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for performance optimization
  const searchIndexRef = useRef<Map<string, T[]>>(new Map());
  const lastItemsHashRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create search index for better performance
  const createSearchIndex = useCallback((items: T[]) => {
    const index = new Map<string, T[]>();
    
    items.forEach(item => {
      searchFields.forEach(field => {
        const value = item[field];
        if (typeof value === 'string') {
          const words = (caseSensitive ? value : value.toLowerCase())
            .split(/\s+/)
            .filter(word => word.length > 0);
          
          words.forEach(word => {
            if (!index.has(word)) {
              index.set(word, []);
            }
            index.get(word)!.push(item);
          });
        } else if (Array.isArray(value)) {
          value.forEach(v => {
            const word = caseSensitive ? String(v) : String(v).toLowerCase();
            if (!index.has(word)) {
              index.set(word, []);
            }
            index.get(word)!.push(item);
          });
        }
      });
    });
    
    return index;
  }, [searchFields, caseSensitive]);

  // Update search index when items change
  useEffect(() => {
    const itemsHash = JSON.stringify(items.map(item => item.id));
    if (itemsHash !== lastItemsHashRef.current) {
      searchIndexRef.current = createSearchIndex(items);
      lastItemsHashRef.current = itemsHash;
    }
  }, [items, createSearchIndex]);

  // Optimized debounce with abort controller
  useEffect(() => {
    // Cancel previous search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Don't show loading on initial render when query is empty
    if (searchQuery !== debouncedQuery && searchQuery.trim()) {
      setIsLoading(true);
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(() => {
      if (!controller.signal.aborted) {
        setDebouncedQuery(searchQuery);
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
      setIsLoading(false);
    };
  }, [searchQuery, debounceMs, debouncedQuery]);

  // Optimized filtering with memoization and early returns
  const filteredItems = useMemo(() => {
    let result = items;

    // Early return if no filters or search
    const hasSearch = debouncedQuery.trim().length > 0;
    const hasFilters = Object.keys(filters).some(key => {
      const value = filters[key as keyof ProductFilters];
      return value !== undefined && value !== null && value !== '';
    });

    if (!hasSearch && !hasFilters) {
      return result.slice(0, maxResults);
    }

    // Apply text search using index for better performance
    if (hasSearch) {
      const query = caseSensitive ? debouncedQuery : debouncedQuery.toLowerCase();
      const terms = query.split(/\s+/).filter(term => term.length > 0);
      
      if (terms.length === 0) {
        result = items;
      } else {
        // Use search index for first term, then filter
        const firstTerm = terms[0];
        const candidateItems = searchIndexRef.current.get(firstTerm) || [];
        
        if (candidateItems.length === 0) {
          result = [];
        } else {
          // Create a Set for faster lookup
          const candidateIds = new Set(candidateItems.map(item => item.id));
          result = items.filter(item => candidateIds.has(item.id));
          
          // Apply remaining terms
          if (terms.length > 1) {
            const remainingTerms = terms.slice(1);
            result = result.filter(item => {
              return remainingTerms.every(term => {
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
        }
      }
    }

    // Apply filters with early exit optimization
    if (hasFilters) {
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
    }

    // Apply sorting with optimized comparisons
    if (filters.sortBy) {
      result = [...result].sort((a, b) => {
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

    // Limit results for better performance
    return result.slice(0, maxResults);
  }, [items, debouncedQuery, filters, searchFields, caseSensitive, maxResults]);

  // Optimized callbacks with useCallback
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters(prevFilters => {
      // Only update if filters actually changed
      const filtersChanged = Object.keys({...prevFilters, ...newFilters}).some(key => {
        const prevValue = prevFilters[key as keyof ProductFilters];
        const newValue = newFilters[key as keyof ProductFilters];
        return prevValue !== newValue;
      });
      
      return filtersChanged ? newFilters : prevFilters;
    });
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
    resultCount: filteredItems.length,
    handleSearchChange,
    handleFiltersChange,
    clearSearch,
    clearFilters,
    clearAll,
  };
}

// Helper hook for extracting unique values from items with memoization
export function useSearchMetadataOptimized<T extends SearchableItem>(items: T[]) {
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    items.forEach(item => {
      if (item.category) {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
      }
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count for better UX
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

  const stats = useMemo(() => ({
    total: items.length,
    inStock: items.filter(item => item.inStock).length,
    featured: items.filter(item => item.featured).length,
    avgRating: items.reduce((sum, item) => sum + (item.rating || 0), 0) / items.length
  }), [items]);

  return {
    categories,
    brands,
    priceRange,
    stats
  };
}