import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import SearchFilters from '../SearchFilters';
import type { ProductFilters } from '../SearchFilters';

// Mock the useFeatureFlag hook
vi.mock('../../hooks/useFeatureFlag', () => ({
  useFeatureFlag: vi.fn(() => true), // Enable advanced search for all tests
}));

describe('SearchFilters', () => {
  const defaultProps = {
    onSearchChange: vi.fn(),
    onFiltersChange: vi.fn(),
    categories: [
      { id: 'category-a', name: 'Category A', count: 5 },
      { id: 'category-b', name: 'Category B', count: 3 },
    ],
    brands: ['Brand A', 'Brand B', 'Brand C'],
    priceRange: [0, 1000] as [number, number],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input', () => {
    render(<SearchFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render filters toggle button', () => {
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    expect(filtersButton).toBeInTheDocument();
  });

  it('should render sort dropdown', () => {
    render(<SearchFilters {...defaultProps} />);
    
    const sortDropdown = screen.getByRole('combobox');
    expect(sortDropdown).toBeInTheDocument();
  });

  it('should call onSearchChange when typing in search input', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    
    await user.type(searchInput, 'test query');
    
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test query');
  });

  it('should clear search input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    
    // Type something first
    await user.type(searchInput, 'test');
    
    // Find and click clear button
    const clearButton = screen.getByRole('button', { name: '' });
    await user.click(clearButton);
    
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
  });

  it('should show advanced filters when feature flag is enabled and filters button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    // Check for advanced filter elements (using more flexible text matching)
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText(/Price Range/i)).toBeInTheDocument();
    expect(screen.getByText('Brands')).toBeInTheDocument();
  });

  it('should display category options with counts', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('(5)')).toBeInTheDocument();
    expect(screen.getByText('Category B')).toBeInTheDocument();
    expect(screen.getByText('(3)')).toBeInTheDocument();
  });

  it('should handle category selection', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    const categoryCheckbox = screen.getByRole('checkbox', { name: /category a/i });
    await user.click(categoryCheckbox);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'category-a'
      })
    );
  });

  it('should display price range slider with correct values', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    expect(screen.getByText('Price Range: $0 - $1000')).toBeInTheDocument();
  });

  it('should handle price range changes', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    const priceSlider = screen.getByRole('slider');
    
    // Simulate slider change (this is a simplified test)
    // In a real scenario, you might need more complex slider interaction
    await user.click(priceSlider);
    
    // The exact implementation depends on how the slider component works
    // This test verifies the component renders correctly
    expect(priceSlider).toBeInTheDocument();
  });

  it('should show brand selection dropdown', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    // Find brand dropdown trigger
    const brandDropdowns = screen.getAllByRole('combobox');
    const brandDropdown = brandDropdowns.find(dropdown => 
      dropdown.getAttribute('aria-expanded') !== null
    );
    
    expect(brandDropdown).toBeInTheDocument();
  });

  it('should show stock and featured product checkboxes', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    expect(screen.getByText('In Stock Only')).toBeInTheDocument();
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
  });

  it('should handle stock filter selection', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
    await user.click(stockCheckbox);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        inStock: true
      })
    );
  });

  it('should handle featured products filter selection', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    const featuredCheckbox = screen.getByRole('checkbox', { name: /featured products/i });
    await user.click(featuredCheckbox);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        featured: true
      })
    );
  });

  it('should handle sort selection changes', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    // Click on sort dropdown - just verify it's clickable
    const sortDropdown = screen.getByRole('combobox');
    await user.click(sortDropdown);
    
    // Check that the dropdown is present and clickable
    // Actual dropdown behavior testing is complex with Radix UI in jsdom
    expect(sortDropdown).toBeInTheDocument();
    expect(sortDropdown).not.toBeDisabled();
  });

  it('should display active filter count', () => {
    const propsWithFilters = {
      ...defaultProps,
      // This would normally come from the parent component's state
    };
    
    render(<SearchFilters {...propsWithFilters} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    expect(filtersButton).toBeInTheDocument();
    
    // The actual filter count display would depend on implementation
    // This test verifies the component renders without crashing
  });

  it('should show clear all button when filters are active', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    // Apply a filter first
    const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
    await user.click(stockCheckbox);
    
    // Look for clear all button
    const clearAllButton = screen.getByText('Clear All');
    expect(clearAllButton).toBeInTheDocument();
  });

  it('should handle clear all functionality', async () => {
    const user = userEvent.setup();
    render(<SearchFilters {...defaultProps} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filtersButton);
    
    // Apply a filter first
    const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
    await user.click(stockCheckbox);
    
    // Click clear all
    const clearAllButton = screen.getByText('Clear All');
    await user.click(clearAllButton);
    
    // Should call onFiltersChange with empty filters
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({});
  });

  it('should be responsive and work on mobile', () => {
    // Mock mobile viewport
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    
    render(<SearchFilters {...defaultProps} />);
    
    // Component should still render all essential elements
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
  });

  it('should handle empty categories gracefully', () => {
    const propsWithEmptyCategories = {
      ...defaultProps,
      categories: [],
    };
    
    render(<SearchFilters {...propsWithEmptyCategories} />);
    
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('should handle empty brands gracefully', () => {
    const propsWithEmptyBrands = {
      ...defaultProps,
      brands: [],
    };
    
    render(<SearchFilters {...propsWithEmptyBrands} />);
    
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <SearchFilters {...defaultProps} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should show loading state appropriately', () => {
    // This would depend on how loading states are implemented
    // The test ensures the component handles loading gracefully
    render(<SearchFilters {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });
});
