# Coding Standards - Better Being Ecosystem

## General Principles

### Code Quality Pillars
1. **Readability** - Code should be self-documenting and easy to understand
2. **Consistency** - Follow established patterns and conventions
3. **Maintainability** - Write code that's easy to modify and extend
4. **Performance** - Consider performance implications of code decisions
5. **Security** - Follow secure coding practices

### Development Philosophy
- **Progressive Enhancement** - Build from a solid foundation upward
- **Mobile-First** - Design and develop for mobile devices first
- **Accessibility-First** - Ensure inclusive design and development
- **Type Safety** - Leverage TypeScript for better code reliability
- **Testing Culture** - Write testable code and comprehensive tests

## TypeScript Standards

### Type Definitions
```typescript
// ✅ Good - Explicit and descriptive types
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  preferences: UserPreferences;
}

// ❌ Bad - Generic or unclear types
interface User {
  data: any;
  info: object;
}
```

### Naming Conventions
```typescript
// ✅ Good - Clear, descriptive names
const calculateTotalOrderAmount = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// ❌ Bad - Unclear abbreviations
const calcTot = (itms: any[]): number => {
  return itms.reduce((t, i) => t + (i.p * i.q), 0);
};
```

### Interface vs Type
```typescript
// ✅ Use interfaces for object shapes
interface Product {
  id: string;
  name: string;
  price: number;
}

// ✅ Use types for unions, primitives, and computed types
type ProductStatus = 'active' | 'inactive' | 'discontinued';
type ProductWithStatus = Product & { status: ProductStatus };
```

## React Component Standards

### Component Structure
```tsx
// ✅ Good - Well-structured component
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  className?: string;
}

export const ProductCard = ({ 
  product, 
  onAddToCart, 
  className 
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product.id);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("product-card", className)}>
      {/* Component JSX */}
    </div>
  );
};
```

### Component Naming
```tsx
// ✅ Good - PascalCase for components
const UserProfileCard = () => { /* */ };
const ShoppingCartIcon = () => { /* */ };
const OrderSummaryModal = () => { /* */ };

// ✅ Good - camelCase for functions and variables
const calculateOrderTotal = () => { /* */ };
const isUserLoggedIn = true;
const selectedProducts = [];
```

### Props and State
```tsx
// ✅ Good - Destructured props with types
interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({ children, variant, disabled = false, onClick }: ButtonProps) => {
  // Component implementation
};

// ✅ Good - Clear state naming
const [isModalOpen, setIsModalOpen] = useState(false);
const [products, setProducts] = useState<Product[]>([]);
const [searchQuery, setSearchQuery] = useState('');
```

## File and Folder Structure

### File Naming
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx              # ✅ PascalCase for components
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── ProductCard.tsx             # ✅ PascalCase for components
│   └── Header.tsx
├── hooks/
│   ├── useAuth.ts                  # ✅ camelCase with 'use' prefix
│   ├── useCart.ts
│   └── useLocalStorage.ts
├── pages/
│   ├── ProductsPage.tsx            # ✅ PascalCase with 'Page' suffix
│   ├── CheckoutPage.tsx
│   └── HomePage.tsx
├── services/
│   ├── api.ts                      # ✅ camelCase for utilities
│   ├── auth.service.ts             # ✅ camelCase with '.service' suffix
│   └── cart.service.ts
├── types/
│   ├── api.types.ts                # ✅ camelCase with '.types' suffix
│   ├── user.types.ts
│   └── product.types.ts
└── utils/
    ├── helpers.ts                  # ✅ camelCase for utilities
    ├── validation.ts
    └── constants.ts
```

### Component Organization
```tsx
// ✅ Good - Organized component file
import React from 'react';
import { cn } from '@/lib/utils';

// Types first
interface ProductCardProps {
  product: Product;
  className?: string;
}

// Constants (if any)
const DEFAULT_IMAGE = '/placeholder-product.jpg';

// Helper functions (if small and component-specific)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(price);
};

// Main component
export const ProductCard = ({ product, className }: ProductCardProps) => {
  // Component implementation
};

// Default export at the end
export default ProductCard;
```

## State Management

### Context API Usage
```tsx
// ✅ Good - Well-structured context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### TanStack Query Usage
```tsx
// ✅ Good - Query key factory pattern
const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// ✅ Good - Custom hook for queries
export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## API and Service Layer

### API Client Structure
```typescript
// ✅ Good - Consistent API service structure
class ProductService {
  private readonly baseUrl = '/api/products';

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json();
  }
}

export const productService = new ProductService();
```

### Error Handling
```typescript
// ✅ Good - Structured error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ✅ Good - Error handling in API calls
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      errorData?.message || 'An error occurred',
      response.status,
      errorData?.code
    );
  }
  return response.json();
};
```

## CSS and Styling

### Tailwind CSS Conventions
```tsx
// ✅ Good - Organized Tailwind classes with cn utility
const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        
        // Variant styles
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
        },
        
        // Size styles
        {
          "h-10 px-4 py-2 text-sm": size === "default",
          "h-9 rounded-md px-3 text-xs": size === "sm",
          "h-11 rounded-md px-8 text-base": size === "lg",
        },
        
        className
      )}
      {...props}
    />
  );
};
```

### CSS Custom Properties
```css
/* ✅ Good - Semantic CSS custom properties */
:root {
  --color-primary: hsl(221.2 84% 69.4%);
  --color-primary-foreground: hsl(210 20% 98%);
  --color-secondary: hsl(210 40% 96%);
  --color-secondary-foreground: hsl(222.2 84% 4.9%);
  
  --radius: 0.5rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

## Testing Standards

### Unit Testing
```tsx
// ✅ Good - Comprehensive component test
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductCard } from './ProductCard';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  image: '/test-image.jpg',
  description: 'A test product'
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('R29.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when add to cart button is clicked', async () => {
    const mockOnAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct.id);
    });
  });
});
```

### API Testing
```typescript
// ✅ Good - API service test
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productService } from './product.service';

// Mock fetch
global.fetch = vi.fn();

describe('ProductService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches products successfully', async () => {
    const mockProducts = [{ id: '1', name: 'Test Product' }];
    
    (fetch as vi.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    } as Response);

    const result = await productService.getProducts();
    
    expect(fetch).toHaveBeenCalledWith('/api/products?');
    expect(result).toEqual(mockProducts);
  });
});
```

## Security Standards

### Input Validation
```typescript
// ✅ Good - Zod schema validation
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

### Secure API Calls
```typescript
// ✅ Good - Secure API configuration
const createSecureApiClient = (baseURL: string, token?: string) => {
  return {
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${baseURL}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'same-origin', // Secure cookie handling
      });

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}`, response.status);
      }

      return response.json();
    }
  };
};
```

## Performance Standards

### Component Optimization
```tsx
// ✅ Good - Optimized component with memoization
import { memo, useMemo, useCallback } from 'react';

interface ProductListProps {
  products: Product[];
  onProductSelect: (productId: string) => void;
}

export const ProductList = memo(({ products, onProductSelect }: ProductListProps) => {
  // Memoize expensive calculations
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  // Memoize callback functions
  const handleProductSelect = useCallback((productId: string) => {
    onProductSelect(productId);
  }, [onProductSelect]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={handleProductSelect}
        />
      ))}
    </div>
  );
});

ProductList.displayName = 'ProductList';
```

### Bundle Optimization
```tsx
// ✅ Good - Lazy loading for code splitting
import { lazy, Suspense } from 'react';

const ProductDetailModal = lazy(() => import('./ProductDetailModal'));
const CheckoutForm = lazy(() => import('./CheckoutForm'));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/checkout" element={<CheckoutForm />} />
        {/* Other routes */}
      </Routes>
    </Suspense>
  );
};
```

## Documentation Standards

### Code Comments
```typescript
/**
 * Calculates the total price including tax and discounts
 * @param items - Array of cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.15 for 15%)
 * @param discountCode - Optional discount code
 * @returns Promise that resolves to the total price
 */
const calculateTotal = async (
  items: CartItem[],
  taxRate: number,
  discountCode?: string
): Promise<number> => {
  // Implementation
};

// ✅ Good - Explain complex business logic
// Calculate discount based on user tier and purchase history
// Premium users get 10% off, returning customers get 5% off
const getDiscountRate = (user: User): number => {
  if (user.tier === 'premium') return 0.1;
  if (user.purchaseCount > 0) return 0.05;
  return 0;
};
```

### README and Documentation
```markdown
# Component Name

## Purpose
Brief description of what this component does and why it exists.

## Usage
```tsx
<ComponentName 
  prop1="value"
  prop2={42}
  onAction={handleAction}
/>
```

## Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | string | Yes | - | Description of prop1 |
| prop2 | number | No | 0 | Description of prop2 |

## Examples
Include code examples showing different use cases.
```

---

*These coding standards ensure consistency, maintainability, and quality across the Better Being ecosystem codebase.*