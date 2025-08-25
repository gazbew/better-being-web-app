import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './input';
import { Label } from './label';
import { FormField } from './form-field';

describe('Form Components', () => {
  describe('Input', () => {
    it('renders with default props', () => {
      render(<Input placeholder="Test input" />);
      const input = screen.getByPlaceholderText('Test input');
      expect(input).toHaveClass('bb-input', 'bg-bb-champagne');
    });

    it('applies error variant correctly', () => {
      render(<Input variant="error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-bb-error');
    });

    it('applies success variant correctly', () => {
      render(<Input variant="success" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-bb-success');
    });

    it('applies different sizes correctly', () => {
      const { rerender } = render(<Input size="sm" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('h-8', 'text-bb-sm');
      
      rerender(<Input size="lg" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('h-12', 'text-bb-lg');
    });
  });

  describe('Label', () => {
    it('renders with brand styling', () => {
      render(<Label>Test Label</Label>);
      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('bb-label', 'font-bb-secondary', 'uppercase');
    });

    it('applies error variant correctly', () => {
      render(<Label variant="error">Error Label</Label>);
      const label = screen.getByText('Error Label');
      expect(label).toHaveClass('text-bb-error');
    });
  });

  describe('FormField', () => {
    it('renders complete form field', () => {
      render(
        <FormField
          label="Email Address"
          description="Enter your email"
          inputProps={{ placeholder: "email@example.com" }}
        />
      );
      
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
    });

    it('shows required indicator', () => {
      render(<FormField label="Required Field" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('displays error state correctly', () => {
      render(
        <FormField
          label="Email"
          error="Invalid email address"
          inputProps={{ placeholder: "email" }}
        />
      );
      
      const input = screen.getByPlaceholderText('email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    it('displays success state correctly', () => {
      render(
        <FormField
          label="Email"
          success="Email is valid"
          inputProps={{ placeholder: "email" }}
        />
      );
      
      expect(screen.getByText('Email is valid')).toBeInTheDocument();
    });
  });
});