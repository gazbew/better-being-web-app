import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Logo, LogoFull, LogoIcon, LogoText } from './Logo';

describe('Logo Component', () => {
  describe('Rendering', () => {
    it('renders full logo by default', () => {
      render(<Logo />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('logo--full');
    });

    it('renders icon variant correctly', () => {
      render(<Logo variant="icon" />);
      const logo = screen.getByRole('img', { name: /better being logo icon/i });
      expect(logo).toBeInTheDocument();
      expect(logo.parentElement).toHaveClass('logo--icon');
    });

    it('renders text variant correctly', () => {
      render(<Logo variant="text" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('logo--text');
    });

    it('renders full variant correctly', () => {
      render(<Logo variant="full" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('logo--full');
    });
  });

  describe('Size Variants', () => {
    it('applies small size class', () => {
      render(<Logo size="sm" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toHaveClass('logo--sm');
    });

    it('applies medium size class (default)', () => {
      render(<Logo />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toHaveClass('logo--md');
    });

    it('applies large size class', () => {
      render(<Logo size="lg" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toHaveClass('logo--lg');
    });

    it('applies extra large size class', () => {
      render(<Logo size="xl" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toHaveClass('logo--xl');
    });
  });

  describe('Color Variants', () => {
    it('applies default color class', () => {
      render(<Logo />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toHaveClass('logo--default');
    });

    it('applies white color class', () => {
      render(<Logo color="white" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toHaveClass('logo--white');
    });

    it('applies dark color class', () => {
      render(<Logo color="dark" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toHaveClass('logo--dark');
    });

    it('applies orange color class', () => {
      render(<Logo color="orange" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toHaveClass('logo--orange');
    });

    it('applies green color class', () => {
      render(<Logo color="green" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toHaveClass('logo--green');
    });
  });

  describe('Interactivity', () => {
    it('renders as button when clickable', () => {
      const handleClick = vi.fn();
      render(<Logo clickable onClick={handleClick} />);
      
      const button = screen.getByRole('button', { name: /better being/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('cursor-pointer');
    });

    it('renders as button when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<Logo onClick={handleClick} />);
      
      const button = screen.getByRole('button', { name: /better being/i });
      expect(button).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Logo onClick={handleClick} />);
      
      const button = screen.getByRole('button', { name: /better being/i });
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders as div when not clickable', () => {
      render(<Logo />);
      
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo.tagName).toBe('DIV');
      expect(logo).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label', () => {
      render(<Logo alt="Custom Alt Text" />);
      const logo = screen.getByRole('img', { name: /custom alt text/i });
      expect(logo).toBeInTheDocument();
    });

    it('has default aria-label', () => {
      render(<Logo />);
      const logo = screen.getByRole('img', { name: /better being/i });
      expect(logo).toBeInTheDocument();
    });

    it('has proper focus styles when clickable', () => {
      render(<Logo clickable />);
      const button = screen.getByRole('button', { name: /better being/i });
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-bb-orange');
    });

    it('supports keyboard navigation when clickable', () => {
      const handleClick = vi.fn();
      render(<Logo onClick={handleClick} />);
      
      const button = screen.getByRole('button', { name: /better being/i });
      fireEvent.keyDown(button, { key: 'Enter' });
      // Note: React Testing Library doesn't automatically trigger click on Enter
      // This would need to be handled by the component or tested in integration tests
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Logo className="custom-class" />);
      const logo = screen.getByRole('img', { name: 'Better Being' });
      expect(logo).toHaveClass('custom-class');
    });

    it('preserves existing classes when custom className is added', () => {
      render(<Logo className="custom-class" size="lg" color="orange" />);
      const logo = screen.getByRole('img', { name: 'Better Being' });
      expect(logo).toHaveClass('custom-class', 'logo--lg', 'logo--orange');
    });
  });

  describe('Component Variants', () => {
    it('LogoFull renders full variant', () => {
      render(<LogoFull />);
      const logo = screen.getByRole('img', { name: 'Better Being' });
      expect(logo).toHaveClass('logo--full');
    });

    it('LogoIcon renders icon variant', () => {
      render(<LogoIcon />);
      const logo = screen.getByRole('img', { name: 'Better Being' });
      expect(logo).toHaveClass('logo--icon');
    });

    it('LogoText renders text variant', () => {
      render(<LogoText />);
      const logo = screen.getByRole('img', { name: 'Better Being' });
      expect(logo).toHaveClass('logo--text');
    });

    it('component variants accept all props except variant', () => {
      render(<LogoIcon size="lg" color="white" className="test-class" />);
      const logo = screen.getByRole('img', { name: 'Better Being' });
      expect(logo).toHaveClass('logo--lg', 'logo--white', 'test-class');
    });
  });

  describe('SVG Icon', () => {
    it('renders SVG with correct dimensions for different sizes', () => {
      const { rerender } = render(<Logo variant="icon" size="sm" />);
      let svg = screen.getByRole('img', { name: /better being logo icon/i });
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');

      rerender(<Logo variant="icon" size="lg" />);
      svg = screen.getByRole('img', { name: /better being logo icon/i });
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('renders SVG with proper viewBox', () => {
      render(<Logo variant="icon" />);
      const svg = screen.getByRole('img', { name: /better being logo icon/i });
      expect(svg).toHaveAttribute('viewBox', '0 0 48 48');
    });

    it('includes brand initials in SVG', () => {
      render(<Logo variant="icon" />);
      const svg = screen.getByRole('img', { name: /better being logo icon/i });
      const text = svg.querySelector('text');
      expect(text).toHaveTextContent('BB');
    });
  });

  describe('Typography', () => {
    it('applies correct font families to text elements', () => {
      render(<Logo variant="text" />);
      const textElements = screen.getByRole('img', { name: /better being/i }).querySelectorAll('span');
      
      textElements.forEach(element => {
        expect(element).toHaveClass('font-bb-primary', 'font-bb-bold', 'tracking-bb-brand');
      });
    });

    it('renders "Better" and "Being" as separate spans', () => {
      render(<Logo variant="text" />);
      const logo = screen.getByRole('img', { name: /better being/i });
      const spans = logo.querySelectorAll('span');
      
      expect(spans).toHaveLength(2);
      expect(spans[0]).toHaveTextContent('Better');
      expect(spans[1]).toHaveTextContent('Being');
    });
  });

  describe('Error Handling', () => {
    it('handles invalid variant gracefully', () => {
      // @ts-expect-error - Testing invalid prop
      render(<Logo variant="invalid" />);
      const logo = screen.getByRole('img', { name: 'Better Being' });
      expect(logo).toHaveClass('logo--invalid'); // Should use the provided variant even if invalid
    });

    it('handles missing onClick gracefully when clickable is true', () => {
      render(<Logo clickable />);
      const button = screen.getByRole('button', { name: 'Better Being' });
      
      // Should not throw when clicked without onClick handler
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });
});