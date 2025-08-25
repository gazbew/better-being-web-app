import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data for testing
export const mockProduct = {
  id: 1,
  sku: 'TEST-001',
  name: 'Test Product',
  description: 'A test product for testing purposes',
  longDescription: 'This is a longer description for testing purposes',
  price: 'R299',
  originalPrice: 'R399',
  rating: 4.5,
  reviews: 123,
  benefits: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  usage: 'Take as directed',
  categoryId: 'wellness-essentials',
  image: '/test-image.jpg',
  popular: true,
  featured: false,
  inStock: true,
  stockCount: 50,
  tags: ['test', 'wellness', 'supplement'],
};

export const mockCategory = {
  id: 'wellness-essentials',
  name: 'Wellness Essentials',
  description: 'Core supplements for daily health',
  icon: 'Heart',
};

export const mockSearchableItem = {
  id: '1',
  name: 'Test Product',
  description: 'A test product for testing purposes',
  category: 'Wellness Essentials',
  price: 299,
  inStock: true,
  featured: false,
  rating: 4.5,
  popularity: 123,
  tags: ['test', 'wellness', 'supplement'],
};

// Helper functions for testing
export const createMockProducts = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockProduct,
    id: i + 1,
    name: `Test Product ${i + 1}`,
    price: `R${200 + i * 50}`,
    originalPrice: `R${300 + i * 50}`,
  }));
};

export const createMockSearchableItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockSearchableItem,
    id: (i + 1).toString(),
    name: `Test Product ${i + 1}`,
    price: 200 + i * 50,
  }));
};

// User event setup
export { default as userEvent } from '@testing-library/user-event';
