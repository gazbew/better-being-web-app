import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearch, useSearchMetadata } from '../useSearch';
import { createMockSearchableItems } from '../../test/test-utils';

// Shared mock data for both test suites
const mockItems = createMockSearchableItems(10);

describe('useSearch', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should return all items initially', () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
        debounceMs: 300,
      })
    );

    expect(result.current.filteredItems).toHaveLength(10);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.totalCount).toBe(10);
    expect(result.current.isLoading).toBe(false);
  });

  it('should filter items by search query', async () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
        debounceMs: 300,
      })
    );

    act(() => {
      result.current.handleSearchChange('Product 1');
    });

    expect(result.current.isLoading).toBe(true);

    // Fast-forward the debounce timer
    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.filteredItems).toHaveLength(2); // Product 1 and Product 10
    expect(result.current.searchQuery).toBe('Product 1');
  });

  it('should handle case-insensitive search', async () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
        debounceMs: 300,
        caseSensitive: false,
      })
    );

    act(() => {
      result.current.handleSearchChange('product 1');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.filteredItems).toHaveLength(2);
    });
  });

  it('should handle case-sensitive search', async () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
        debounceMs: 300,
        caseSensitive: true,
      })
    );

    act(() => {
      result.current.handleSearchChange('product 1'); // lowercase
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.filteredItems).toHaveLength(0); // No matches
    });

    act(() => {
      result.current.handleSearchChange('Product 1'); // correct case
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.filteredItems).toHaveLength(2);
    });
  });

  it('should filter by category', () => {
    const itemsWithCategories = mockItems.map((item, i) => ({
      ...item,
      category: i % 2 === 0 ? 'Category A' : 'Category B',
    }));

    const { result } = renderHook(() =>
      useSearch({
        items: itemsWithCategories,
      })
    );

    act(() => {
      result.current.handleFiltersChange({ category: 'Category A' });
    });

    expect(result.current.filteredItems).toHaveLength(5); // Half the items
    expect(result.current.filteredItems.every(item => item.category === 'Category A')).toBe(true);
  });

  it('should filter by price range', () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
      })
    );

    act(() => {
      result.current.handleFiltersChange({ 
        priceMin: 300, 
        priceMax: 400 
      });
    });

    const filtered = result.current.filteredItems;
    expect(filtered.every(item => item.price && item.price >= 300 && item.price <= 400)).toBe(true);
  });

  it('should filter by stock status', () => {
    const itemsWithStock = mockItems.map((item, i) => ({
      ...item,
      inStock: i % 3 !== 0, // Some items out of stock
    }));

    const { result } = renderHook(() =>
      useSearch({
        items: itemsWithStock,
      })
    );

    act(() => {
      result.current.handleFiltersChange({ inStock: true });
    });

    expect(result.current.filteredItems.every(item => item.inStock === true)).toBe(true);
  });

  it('should filter by featured status', () => {
    const itemsWithFeatured = mockItems.map((item, i) => ({
      ...item,
      featured: i % 4 === 0, // Every 4th item is featured
    }));

    const { result } = renderHook(() =>
      useSearch({
        items: itemsWithFeatured,
      })
    );

    act(() => {
      result.current.handleFiltersChange({ featured: true });
    });

    expect(result.current.filteredItems.every(item => item.featured === true)).toBe(true);
    expect(result.current.filteredItems).toHaveLength(3); // Items 0, 4, 8
  });

  it('should sort by name', () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
      })
    );

    act(() => {
      result.current.handleFiltersChange({ sortBy: 'name' });
    });

    const names = result.current.filteredItems.map(item => item.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it('should sort by price (low to high)', () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
      })
    );

    act(() => {
      result.current.handleFiltersChange({ sortBy: 'price-low' });
    });

    const prices = result.current.filteredItems.map(item => item.price || 0);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it('should sort by price (high to low)', () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
      })
    );

    act(() => {
      result.current.handleFiltersChange({ sortBy: 'price-high' });
    });

    const prices = result.current.filteredItems.map(item => item.price || 0);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  it('should sort by rating', () => {
    const itemsWithRatings = mockItems.map((item, i) => ({
      ...item,
      rating: 5 - (i % 5), // Ratings from 5 to 1
    }));

    const { result } = renderHook(() =>
      useSearch({
        items: itemsWithRatings,
      })
    );

    act(() => {
      result.current.handleFiltersChange({ sortBy: 'rating' });
    });

    const ratings = result.current.filteredItems.map(item => item.rating || 0);
    for (let i = 1; i < ratings.length; i++) {
      expect(ratings[i]).toBeLessThanOrEqual(ratings[i - 1]);
    }
  });

  it('should combine multiple filters', async () => {
    const complexItems = mockItems.map((item, i) => ({
      ...item,
      category: i % 2 === 0 ? 'Category A' : 'Category B',
      price: 200 + i * 50,
      inStock: i % 3 !== 0,
    }));

    const { result } = renderHook(() =>
      useSearch({
        items: complexItems,
        debounceMs: 300,
      })
    );

    act(() => {
      result.current.handleSearchChange('Product');
      result.current.handleFiltersChange({
        category: 'Category A',
        priceMin: 250,
        priceMax: 400,
        inStock: true,
      });
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const filtered = result.current.filteredItems;
    filtered.forEach(item => {
      expect(item.name).toContain('Product');
      expect(item.category).toBe('Category A');
      expect(item.price).toBeGreaterThanOrEqual(250);
      expect(item.price).toBeLessThanOrEqual(400);
      expect(item.inStock).toBe(true);
    });
  });

  it('should clear search', async () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
        debounceMs: 300,
      })
    );

    // First search
    act(() => {
      result.current.handleSearchChange('Product 1');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.filteredItems).toHaveLength(2);
    });

    // Clear search
    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.filteredItems).toHaveLength(10);
  });

  it('should clear filters', () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
      })
    );

    // Apply filters
    act(() => {
      result.current.handleFiltersChange({
        category: 'Category A',
        priceMin: 300,
        inStock: true,
      });
    });

    expect(Object.keys(result.current.filters)).toHaveLength(3);

    // Clear filters
    act(() => {
      result.current.clearFilters();
    });

    expect(Object.keys(result.current.filters)).toHaveLength(0);
    expect(result.current.filteredItems).toHaveLength(10);
  });

  it('should clear all (search and filters)', async () => {
    const { result } = renderHook(() =>
      useSearch({
        items: mockItems,
        debounceMs: 300,
      })
    );

    // Apply search and filters
    act(() => {
      result.current.handleSearchChange('Product 1');
      result.current.handleFiltersChange({ category: 'Category A' });
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.searchQuery).toBe('Product 1');
      expect(Object.keys(result.current.filters)).toHaveLength(1);
    });

    // Clear all
    act(() => {
      result.current.clearAll();
    });

    expect(result.current.searchQuery).toBe('');
    expect(Object.keys(result.current.filters)).toHaveLength(0);
    expect(result.current.filteredItems).toHaveLength(10);
  });
});

describe('useSearchMetadata', () => {
  it('should extract categories with counts', () => {
    const items = [
      { ...mockItems[0], category: 'Category A' },
      { ...mockItems[1], category: 'Category A' },
      { ...mockItems[2], category: 'Category B' },
      { ...mockItems[3], category: 'Category B' },
      { ...mockItems[4], category: 'Category B' },
    ];

    const { result } = renderHook(() => useSearchMetadata(items));

    expect(result.current.categories).toHaveLength(2);
    expect(result.current.categories.find(c => c.name === 'Category A')?.count).toBe(2);
    expect(result.current.categories.find(c => c.name === 'Category B')?.count).toBe(3);
  });

  it('should extract brands', () => {
    const items = [
      { ...mockItems[0], brand: 'Brand A' },
      { ...mockItems[1], brand: 'Brand B' },
      { ...mockItems[2], brand: 'Brand A' },
      { ...mockItems[3], brand: 'Brand C' },
    ];

    const { result } = renderHook(() => useSearchMetadata(items));

    expect(result.current.brands).toEqual(['Brand A', 'Brand B', 'Brand C']);
  });

  it('should calculate price range', () => {
    const items = [
      { ...mockItems[0], price: 100 },
      { ...mockItems[1], price: 500 },
      { ...mockItems[2], price: 200 },
      { ...mockItems[3], price: 800 },
    ];

    const { result } = renderHook(() => useSearchMetadata(items));

    expect(result.current.priceRange).toEqual([100, 800]);
  });

  it('should handle items without prices', () => {
    const items = [
      { ...mockItems[0], price: undefined },
      { ...mockItems[1], price: undefined },
    ];

    const { result } = renderHook(() => useSearchMetadata(items));

    expect(result.current.priceRange).toEqual([0, 100]);
  });

  it('should handle empty items array', () => {
    const { result } = renderHook(() => useSearchMetadata([]));

    expect(result.current.categories).toEqual([]);
    expect(result.current.brands).toEqual([]);
    expect(result.current.priceRange).toEqual([0, 100]);
  });
});
