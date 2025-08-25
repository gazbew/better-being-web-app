import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

// Mock icon for testing
const TestIcon = () => (
  <svg data-testid="test-icon" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="4" />
  </svg>
);

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bb-button');
    });

    it('renders children correctly', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-bb-orange', 'text-white');
    });

    it('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-bb-champagne', 'text-bb-orange', 'border-bb-orange');
    });

    it('renders tertiary variant correctly', () => {
      render(<Button variant="tertiary">Tertiary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent', 'text-bb-orange');
    });

    it('renders destructive variant correctly', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-bb-error', 'text-white');
    });

    it('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent', 'text-bb-secondary');
    });

    it('renders link variant correctly', () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent', 'text-bb-orange', 'underline-offset-4');
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-bb-6', 'py-bb-3');
    });

    it('renders small size correctly', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-bb-3', 'py-bb-2', 'text-bb-sm');
    });

    it('renders large size correctly', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'px-bb-8', 'py-bb-4', 'text-bb-lg');
    });

    it('renders extra large size correctly', () => {
      render(<Button size="xl">Extra Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-14', 'px-bb-10', 'py-bb-5', 'text-bb-xl');
    });

    it('renders icon size correctly', () => {
      render(<Button size="icon" aria-label="Icon button"><TestIcon /></Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10', 'p-0');
    });

    it('renders small icon size correctly', () => {
      render(<Button size="icon-sm" aria-label="Small icon button"><TestIcon /></Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'w-8', 'p-0');
    });

    it('renders large icon size correctly', () => {
      render(<Button size="icon-lg" aria-label="Large icon button"><TestIcon /></Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'w-12', 'p-0');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(<Button loading>Loading Button</Button>);
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('disables button when loading', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('cursor-wait');
    });

    it('hides icon when loading', () => {
      render(
        <Button loading icon={<TestIcon />}>
          Loading with Icon
        </Button>
      );
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });

    it('shows loading spinner instead of icon', () => {
      render(
        <Button loading icon={<TestIcon />}>
          Loading
        </Button>
      );
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('Icon Support', () => {
    it('renders icon on the left by default', () => {
      render(
        <Button icon={<TestIcon />}>
          Button with Icon
        </Button>
      );
      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');
      const text = screen.getByText('Button with Icon');
      
      expect(icon).toBeInTheDocument();
      expect(button.firstChild).toBe(icon.parentElement);
    });

    it('renders icon on the right when specified', () => {
      render(
        <Button icon={<TestIcon />} iconPosition="right">
          Button with Icon
        </Button>
      );
      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');
      const text = screen.getByText('Button with Icon');
      
      expect(icon).toBeInTheDocument();
      expect(button.lastChild).toBe(icon.parentElement);
    });

    it('renders icon-only button correctly', () => {
      render(
        <Button icon={<TestIcon />} size="icon" aria-label="Icon only">
        </Button>
      );
      const icon = screen.getByTestId('test-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Full Width', () => {
    it('applies full width class when fullWidth is true', () => {
      render(<Button fullWidth>Full Width Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('does not apply full width class by default', () => {
      render(<Button>Normal Button</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    it('disables button when loading', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Event Handling', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} loading>Loading</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('AsChild Prop', () => {
    it('renders as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveClass('bb-button');
    });
  });

  describe('Brand Compliance', () => {
    it('applies brand typography classes', () => {
      render(<Button>Brand Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'font-bb-secondary',
        'font-bb-semibold',
        'tracking-bb-wide',
        'uppercase'
      );
    });

    it('applies brand focus styles', () => {
      render(<Button>Focus Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'focus-visible:ring-2',
        'focus-visible:ring-bb-orange',
        'focus-visible:ring-offset-2'
      );
    });

    it('applies brand transition styles', () => {
      render(<Button>Transition Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all', 'duration-200', 'ease-in-out');
    });

    it('applies brand spacing for gaps', () => {
      render(<Button icon={<TestIcon />}>Spaced Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('gap-bb-2');
    });
  });

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('supports aria-label for icon buttons', () => {
      render(
        <Button size="icon" aria-label="Close dialog">
          <TestIcon />
        </Button>
      );
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    it('is keyboard accessible', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyUp(button, { key: 'Enter' });
      
      expect(handleClick).toHaveBeenCalled();
    });

    it('has proper disabled state for screen readers', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards HTML button attributes', () => {
      render(
        <Button 
          type="submit" 
          form="test-form" 
          name="test-button"
          value="test-value"
        >
          Form Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('form', 'test-form');
      expect(button).toHaveAttribute('name', 'test-button');
      expect(button).toHaveAttribute('value', 'test-value');
    });
  });
});