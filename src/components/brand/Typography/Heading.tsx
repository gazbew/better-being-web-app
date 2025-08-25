import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Heading Component Types
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingVariant = 'display' | 'heading' | 'subheading';
export type HeadingColor = 'primary' | 'secondary' | 'muted' | 'orange' | 'green' | 'white';

/**
 * Heading Component Props
 */
export interface HeadingProps {
  /** Heading level (h1-h6) */
  level?: HeadingLevel;
  /** Visual variant style */
  variant?: HeadingVariant;
  /** Text color variant */
  color?: HeadingColor;
  /** Additional CSS classes */
  className?: string;
  /** Child content */
  children: React.ReactNode;
  /** HTML id attribute */
  id?: string;
}

/**
 * Heading size and style configurations
 */
const headingConfig = {
  1: {
    display: 'bb-h1 text-bb-6xl font-bb-primary font-bb-bold tracking-bb-brand leading-bb-tight',
    heading: 'bb-h1 text-bb-5xl font-bb-secondary font-bb-semibold tracking-bb-wide leading-bb-snug',
    subheading: 'bb-h1 text-bb-4xl font-bb-secondary font-bb-medium tracking-bb-normal leading-bb-normal'
  },
  2: {
    display: 'bb-h2 text-bb-5xl font-bb-primary font-bb-bold tracking-bb-brand leading-bb-tight',
    heading: 'bb-h2 text-bb-4xl font-bb-secondary font-bb-semibold tracking-bb-wide leading-bb-snug',
    subheading: 'bb-h2 text-bb-3xl font-bb-secondary font-bb-medium tracking-bb-normal leading-bb-normal'
  },
  3: {
    display: 'bb-h3 text-bb-4xl font-bb-primary font-bb-bold tracking-bb-brand leading-bb-tight',
    heading: 'bb-h3 text-bb-3xl font-bb-secondary font-bb-semibold tracking-bb-wide leading-bb-snug',
    subheading: 'bb-h3 text-bb-2xl font-bb-secondary font-bb-medium tracking-bb-normal leading-bb-normal'
  },
  4: {
    display: 'bb-h4 text-bb-3xl font-bb-primary font-bb-bold tracking-bb-brand leading-bb-tight',
    heading: 'bb-h4 text-bb-2xl font-bb-secondary font-bb-semibold tracking-bb-wide leading-bb-snug',
    subheading: 'bb-h4 text-bb-xl font-bb-secondary font-bb-medium tracking-bb-normal leading-bb-normal'
  },
  5: {
    display: 'bb-h5 text-bb-2xl font-bb-primary font-bb-bold tracking-bb-brand leading-bb-tight',
    heading: 'bb-h5 text-bb-xl font-bb-secondary font-bb-semibold tracking-bb-wide leading-bb-snug',
    subheading: 'bb-h5 text-bb-lg font-bb-secondary font-bb-medium tracking-bb-normal leading-bb-normal'
  },
  6: {
    display: 'bb-h6 text-bb-xl font-bb-primary font-bb-bold tracking-bb-brand leading-bb-tight',
    heading: 'bb-h6 text-bb-lg font-bb-secondary font-bb-semibold tracking-bb-wide leading-bb-snug',
    subheading: 'bb-h6 text-bb-base font-bb-secondary font-bb-medium tracking-bb-normal leading-bb-normal'
  }
};

/**
 * Color configurations
 */
const colorConfig = {
  primary: 'text-bb-primary',
  secondary: 'text-bb-secondary',
  muted: 'text-bb-tertiary',
  orange: 'text-bb-orange',
  green: 'text-bb-green',
  white: 'text-white'
};

/**
 * Heading Component
 * 
 * A flexible heading component that supports multiple levels, variants, and colors
 * following Better Being brand typography guidelines.
 * 
 * @example
 * ```tsx
 * // Display heading (hero sections)
 * <Heading level={1} variant="display" color="primary">
 *   Better Being Wellness
 * </Heading>
 * 
 * // Section heading
 * <Heading level={2} variant="heading" color="orange">
 *   Our Products
 * </Heading>
 * 
 * // Subheading
 * <Heading level={3} variant="subheading" color="secondary">
 *   Natural Solutions
 * </Heading>
 * ```
 */
export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  variant = 'heading',
  color = 'primary',
  className,
  children,
  id,
  ...props
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  const baseClasses = cn(
    'bb-heading',
    headingConfig[level][variant],
    colorConfig[color],
    {
      'uppercase': variant === 'heading' && level <= 3, // Uppercase for main section headings
    },
    className
  );

  return React.createElement(
    Component,
    {
      className: baseClasses,
      id,
      ...props
    },
    children
  );
};

/**
 * Predefined heading variants for common use cases
 */

export const DisplayHeading: React.FC<Omit<HeadingProps, 'variant'>> = (props) => (
  <Heading variant="display" {...props} />
);

export const SectionHeading: React.FC<Omit<HeadingProps, 'variant'>> = (props) => (
  <Heading variant="heading" {...props} />
);

export const SubHeading: React.FC<Omit<HeadingProps, 'variant'>> = (props) => (
  <Heading variant="subheading" {...props} />
);

/**
 * Semantic heading components
 */

export const H1: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level={1} {...props} />
);

export const H2: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level={2} {...props} />
);

export const H3: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level={3} {...props} />
);

export const H4: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level={4} {...props} />
);

export const H5: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level={5} {...props} />
);

export const H6: React.FC<Omit<HeadingProps, 'level'>> = (props) => (
  <Heading level={6} {...props} />
);

export default Heading;