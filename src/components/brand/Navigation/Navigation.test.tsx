import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavigationPrimary } from './NavigationPrimary';

const mockItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

describe('NavigationPrimary', () => {
  it('renders navigation items', () => {
    render(<NavigationPrimary items={mockItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    render(<NavigationPrimary items={mockItems} activePath="/products" />);
    
    const activeLink = screen.getByText('Products');
    expect(activeLink).toHaveClass('text-bb-orange', 'bg-bb-champagne-100');
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders mobile menu toggle button', () => {
    render(<NavigationPrimary items={mockItems} />);
    
    const toggleButton = screen.getByLabelText('Toggle mobile menu');
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<NavigationPrimary items={mockItems} />);
    
    const toggleButton = screen.getByLabelText('Toggle mobile menu');
    
    // Initially closed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click to close
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls external mobile menu toggle handler', () => {
    const mockToggle = vi.fn();
    render(
      <NavigationPrimary 
        items={mockItems} 
        mobileMenuOpen={false}
        onMobileMenuToggle={mockToggle}
      />
    );
    
    const toggleButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(toggleButton);
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('applies brand styling classes', () => {
    render(<NavigationPrimary items={mockItems} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bb-navigation-primary', 'bg-white', 'shadow-bb-wellness');
  });

  it('renders logo component', () => {
    render(<NavigationPrimary items={mockItems} />);
    
    // Logo should be present (assuming it renders some identifiable content)
    const logoContainer = screen.getByRole('navigation').querySelector('.flex-shrink-0');
    expect(logoContainer).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<NavigationPrimary items={mockItems} className="custom-nav" />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-nav');
  });

  describe('Accessibility', () => {
    it('has proper navigation role', () => {
      render(<NavigationPrimary items={mockItems} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('has proper aria-current for active links', () => {
      render(<NavigationPrimary items={mockItems} activePath="/about" />);
      
      const activeLink = screen.getByText('About');
      expect(activeLink).toHaveAttribute('aria-current', 'page');
    });

    it('has proper focus management', () => {
      render(<NavigationPrimary items={mockItems} />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-bb-orange');
      });
    });

    it('mobile menu button has proper aria attributes', () => {
      render(<NavigationPrimary items={mockItems} />);
      
      const toggleButton = screen.getByLabelText('Toggle mobile menu');
      expect(toggleButton).toHaveAttribute('aria-expanded');
      expect(toggleButton).toHaveAttribute('aria-label', 'Toggle mobile menu');
    });
  });

  describe('Responsive Behavior', () => {
    it('hides desktop navigation on mobile', () => {
      render(<NavigationPrimary items={mockItems} />);
      
      const desktopNav = screen.getByRole('navigation').querySelector('.hidden.md\\:block');
      expect(desktopNav).toBeInTheDocument();
    });

    it('shows mobile menu button only on mobile', () => {
      render(<NavigationPrimary items={mockItems} />);
      
      const mobileButton = screen.getByRole('navigation').querySelector('.md\\:hidden');
      expect(mobileButton).toBeInTheDocument();
    });
  });
});