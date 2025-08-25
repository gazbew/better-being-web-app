import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardImage,
  CardBadge,
  CardPrice
} from './card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default props', () => {
      render(<Card data-testid="card">Card content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('bb-card');
    });

    it('applies standard variant by default', () => {
      render(<Card data-testid="card">Standard card</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-bb-secondary', 'border-bb-primary', 'shadow-wellness-sm');
    });

    it('applies premium variant correctly', () => {
      render(<Card variant="premium" data-testid="card">Premium card</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-bb-champagne', 'border-bb-orange', 'shadow-premium-sm');
    });

    it('applies product variant correctly', () => {
      render(<Card variant="product" data-testid="card">Product card</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-bb-secondary', 'border-bb-secondary', 'shadow-wellness-sm');
    });

    it('applies testimonial variant correctly', () => {
      render(<Card variant="testimonial" data-testid="card">Testimonial card</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-bb-champagne-100', 'border-bb-champagne-300');
    });

    it('applies different padding sizes', () => {
      const { rerender } = render(<Card padding="sm" data-testid="card">Small padding</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-bb-4');

      rerender(<Card padding="md" data-testid="card">Medium padding</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-bb-6');

      rerender(<Card padding="lg" data-testid="card">Large padding</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-bb-8');

      rerender(<Card padding="xl" data-testid="card">XL padding</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-bb-12');
    });

    it('applies different shadow sizes', () => {
      const { rerender } = render(<Card shadow="none" data-testid="card">No shadow</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow-none');

      rerender(<Card shadow="sm" data-testid="card">Small shadow</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow-wellness-sm');

      rerender(<Card shadow="md" data-testid="card">Medium shadow</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow-premium-md');

      rerender(<Card shadow="lg" data-testid="card">Large shadow</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow-floating-lg');
    });

    it('applies hover effects when hoverable', () => {
      render(<Card variant="product" hoverable data-testid="card">Hoverable card</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('hover:scale-[1.02]');
    });

    it('disables hover effects when not hoverable', () => {
      render(<Card variant="product" hoverable={false} data-testid="card">Non-hoverable card</Card>);
      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('hover:scale-[1.02]');
    });

    it('makes card interactive when interactive prop is true', () => {
      const handleClick = vi.fn();
      render(
        <Card interactive onClick={handleClick} data-testid="card">
          Interactive card
        </Card>
      );
      const card = screen.getByTestId('card');
      
      expect(card).toHaveClass('cursor-pointer');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('role', 'button');
      
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('removes border when border prop is false', () => {
      render(<Card border={false} data-testid="card">No border card</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-0');
    });
  });

  describe('CardHeader', () => {
    it('renders correctly', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>);
      const header = screen.getByTestId('header');
      expect(header).toHaveClass('bb-card-header', 'flex', 'flex-col', 'gap-bb-2');
    });
  });

  describe('CardTitle', () => {
    it('renders as h3 element', () => {
      render(<CardTitle>Card Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('bb-card-title', 'font-semibold', 'text-xl');
    });
  });

  describe('CardDescription', () => {
    it('renders correctly', () => {
      render(<CardDescription>Card description</CardDescription>);
      const description = screen.getByText('Card description');
      expect(description).toHaveClass('bb-card-description', 'text-sm', 'text-bb-secondary');
    });
  });

  describe('CardContent', () => {
    it('renders correctly', () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('bb-card-content', 'p-bb-6', 'pt-0');
    });
  });

  describe('CardFooter', () => {
    it('renders correctly', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('bb-card-footer', 'flex', 'items-center', 'gap-bb-3');
    });
  });

  describe('CardImage', () => {
    it('renders with default aspect ratio', () => {
      render(<CardImage src="/test-image.jpg" alt="Test image" />);
      const image = screen.getByAltText('Test image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('applies different aspect ratios', () => {
      const { rerender } = render(
        <CardImage src="/test.jpg" alt="Test" aspectRatio="square" />
      );
      let container = screen.getByAltText('Test').parentElement;
      expect(container).toHaveClass('aspect-square');

      rerender(<CardImage src="/test.jpg" alt="Test" aspectRatio="video" />);
      container = screen.getByAltText('Test').parentElement;
      expect(container).toHaveClass('aspect-video');

      rerender(<CardImage src="/test.jpg" alt="Test" aspectRatio="portrait" />);
      container = screen.getByAltText('Test').parentElement;
      expect(container).toHaveClass('aspect-[3/4]');

      rerender(<CardImage src="/test.jpg" alt="Test" aspectRatio="landscape" />);
      container = screen.getByAltText('Test').parentElement;
      expect(container).toHaveClass('aspect-[4/3]');
    });
  });

  describe('CardBadge', () => {
    it('renders with default variant', () => {
      render(<CardBadge>Default Badge</CardBadge>);
      const badge = screen.getByText('Default Badge');
      expect(badge).toHaveClass('bg-bb-champagne-200', 'text-bb-secondary');
    });

    it('applies different variants', () => {
      const { rerender } = render(<CardBadge variant="success">Success</CardBadge>);
      let badge = screen.getByText('Success');
      expect(badge).toHaveClass('bg-bb-success', 'text-white');

      rerender(<CardBadge variant="warning">Warning</CardBadge>);
      badge = screen.getByText('Warning');
      expect(badge).toHaveClass('bg-bb-warning', 'text-white');

      rerender(<CardBadge variant="error">Error</CardBadge>);
      badge = screen.getByText('Error');
      expect(badge).toHaveClass('bg-bb-error', 'text-white');

      rerender(<CardBadge variant="premium">Premium</CardBadge>);
      badge = screen.getByText('Premium');
      expect(badge).toHaveClass('bg-bb-orange', 'text-white');
    });
  });

  describe('CardPrice', () => {
    it('renders price with default currency', () => {
      render(<CardPrice price="29.99" />);
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('renders price with custom currency', () => {
      render(<CardPrice price="29.99" currency="€" />);
      expect(screen.getByText('€29.99')).toBeInTheDocument();
    });

    it('renders original price when provided', () => {
      render(<CardPrice price="19.99" originalPrice="29.99" />);
      expect(screen.getByText('$19.99')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      
      const originalPrice = screen.getByText('$29.99');
      expect(originalPrice).toHaveClass('line-through');
    });

    it('applies correct styling classes', () => {
      render(<CardPrice price="29.99" />);
      const price = screen.getByText('$29.99');
      expect(price).toHaveClass('text-xl', 'font-bold', 'text-bb-orange');
    });
  });

  describe('Complete Card', () => {
    it('renders full card structure', () => {
      render(
        <Card variant="standard">
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByRole('heading', { name: 'Test Card' })).toBeInTheDocument();
      expect(screen.getByText('This is a test card')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('renders product card with all components', () => {
      render(
        <Card variant="product" interactive>
          <CardImage src="/product.jpg" alt="Product" aspectRatio="square" />
          <CardHeader>
            <CardBadge variant="premium">Best Seller</CardBadge>
            <CardTitle>Premium Product</CardTitle>
            <CardDescription>High-quality wellness product</CardDescription>
          </CardHeader>
          <CardContent>
            <CardPrice price="49.99" originalPrice="69.99" />
          </CardContent>
          <CardFooter>
            <button>Add to Cart</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByAltText('Product')).toBeInTheDocument();
      expect(screen.getByText('Best Seller')).toBeInTheDocument();
      expect(screen.getByText('Premium Product')).toBeInTheDocument();
      expect(screen.getByText('High-quality wellness product')).toBeInTheDocument();
      expect(screen.getByText('$49.99')).toBeInTheDocument();
      expect(screen.getByText('$69.99')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
    });

    it('renders testimonial card with proper styling', () => {
      render(
        <Card variant="testimonial">
          <CardContent>
            <p>This product changed my life!</p>
            <div>
              <strong>John Doe</strong>
              <span>Verified Customer</span>
            </div>
          </CardContent>
        </Card>
      );

      const card = screen.getByText('This product changed my life!').closest('.bb-card');
      expect(card).toHaveClass('bg-bb-champagne-100', 'border-bb-champagne-300');
    });

    it('handles keyboard navigation for interactive cards', () => {
      const handleClick = vi.fn();
      render(
        <Card interactive onClick={handleClick} data-testid="interactive-card">
          Interactive Card
        </Card>
      );

      const card = screen.getByTestId('interactive-card');
      
      // Test Enter key
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
      
      // Test Space key
      fireEvent.keyDown(card, { key: ' ', code: 'Space' });
      
      // Card should be focusable
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });
});