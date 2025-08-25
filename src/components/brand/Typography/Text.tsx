import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Text Component Types
 */
export type TextVariant = 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'caption' | 'label' | 'button';
export type TextWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'muted' | 'orange' | 'green' | 'white' | 'success' | 'warning' | 'error' | 'info';
export type TextElement = 'p' | 'span' | 'div' | 'label' | 'small' | 'strong' | 'em';

/**
 * Text Component Props
 */
export interface TextProps {
  /** Text variant size and style */
  variant?: TextVariant;
  /** Font weight */
  weight?: TextWeight;
  /** Text color */
  color?: TextColor;
  /** HTML element to render */
  as?: TextElement;
  /** Additional CSS classes */
  className?: string;
  /** Child content */
  children: React.ReactNode;
  /** HTML id attribute */
  id?: string;
}

/**
 * Text variant configurations
 */
const variantConfig = {
  'body-xl': 'bb-body-xl text-bb-xl font-bb-body font-bb-normal tracking-bb-body leading-bb-relaxed',
  'body-lg': 'bb-body-lg text-bb-lg font-bb-body font-bb-normal tracking-bb-body leading-bb-relaxed',
  'body-md': 'bb-body-md text-bb-base font-bb-body font-bb-normal tracking-bb-body leading-bb-relaxed',
  'body-sm': 'bb-body-sm text-bb-sm font-bb-body font-bb-normal tracking-bb-body leading-bb-normal',
  'body-xs': 'bb-body-xs text-bb-xs font-bb-ui font-bb-normal tracking-bb-normal leading-bb-normal',
  'caption': 'bb-caption text-bb-xs font-bb-ui font-bb-normal tracking-bb-normal leading-bb-normal',
  'label': 'bb-label text-bb-sm font-bb-secondary font-bb-semibold tracking-bb-wide leading-bb-normal uppercase',
  'button': 'bb-button-text text-bb-base font-bb-secondary font-bb-semibold tracking-bb-wide leading-bb-normal uppercase'
};

/**
 * Weight configurations
 */
const weightConfig = {
  thin: 'font-bb-thin',
  extralight: 'font-bb-extralight',
  light: 'font-bb-light',
  normal: 'font-bb-normal',
  medium: 'font-bb-medium',
  semibold: 'font-bb-semibold',
  bold: 'font-bb-bold',
  extrabold: 'font-bb-extrabold',
  black: 'font-bb-black'
};

/**
 * Color configurations
 */
const colorConfig = {
  primary: 'text-bb-primary',
  secondary: 'text-bb-secondary',
  tertiary: 'text-bb-tertiary',
  muted: 'text-bb-tertiary',
  orange: 'text-bb-orange',
  green: 'text-bb-green',
  white: 'text-white',
  success: 'text-bb-success',
  warning: 'text-bb-warning',
  error: 'text-bb-error',
  info: 'text-bb-info'
};

/**
 * Default element mapping for variants
 */
const defaultElementMap: Record<TextVariant, TextElement> = {
  'body-xl': 'p',
  'body-lg': 'p',
  'body-md': 'p',
  'body-sm': 'p',
  'body-xs': 'small',
  'caption': 'small',
  'label': 'label',
  'button': 'span'
};

/**
 * Text Component
 * 
 * A flexible text component that supports multiple variants, weights, and colors
 * following Better Being brand typography guidelines.
 * 
 * @example
 * ```tsx
 * // Large body text
 * <Text variant="body-xl" color="primary">
 *   Welcome to Better Being, your natural wellness partner.
 * </Text>
 * 
 * // Small caption text
 * <Text variant="caption" color="muted">
 *   * Results may vary based on individual circumstances
 * </Text>
 * 
 * // Form label
 * <Text variant="label" color="secondary" as="label">
 *   Email Address
 * </Text>
 * 
 * // Custom styling
 * <Text variant="body-md" weight="semibold" color="orange">
 *   Featured Product
 * </Text>
 * ```
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body-md',
  weight,
  color = 'secondary',
  as,
  className,
  children,
  id,
  ...props
}) => {
  const Component = as || defaultElementMap[variant];
  
  const baseClasses = cn(
    'bb-text',
    variantConfig[variant],
    weight && weightConfig[weight],
    colorConfig[color],
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
 * Predefined text variants for common use cases
 */

export const BodyXL: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body-xl" {...props} />
);

export const BodyLG: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body-lg" {...props} />
);

export const BodyMD: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body-md" {...props} />
);

export const BodySM: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body-sm" {...props} />
);

export const BodyXS: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body-xs" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="label" {...props} />
);

export const ButtonText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="button" {...props} />
);

/**
 * Semantic text components
 */

export const Lead: React.FC<Omit<TextProps, 'variant' | 'weight'>> = (props) => (
  <Text variant="body-xl" weight="medium" {...props} />
);

export const Muted: React.FC<Omit<TextProps, 'color'>> = (props) => (
  <Text color="muted" {...props} />
);

export const Strong: React.FC<Omit<TextProps, 'weight' | 'as'>> = (props) => (
  <Text weight="semibold" as="strong" {...props} />
);

export const Emphasis: React.FC<Omit<TextProps, 'as'>> = (props) => (
  <Text as="em" className="bb-emphasis font-bb-primary italic text-bb-orange" {...props} />
);

/**
 * Quote Component - Special text styling for quotes
 */
export interface QuoteProps extends Omit<TextProps, 'variant' | 'as'> {
  /** Quote author */
  author?: string;
  /** Author title/role */
  authorTitle?: string;
}

export const Quote: React.FC<QuoteProps> = ({
  children,
  author,
  authorTitle,
  className,
  ...props
}) => {
  return (
    <blockquote className={cn('bb-quote', className)}>
      <Text 
        variant="body-lg" 
        as="p" 
        className="font-bb-primary italic leading-bb-relaxed text-bb-secondary border-l-4 border-bb-orange pl-bb-4 mb-bb-4"
        {...props}
      >
        "{children}"
      </Text>
      {(author || authorTitle) && (
        <footer className="text-bb-tertiary">
          <cite className="not-italic">
            {author && <span className="font-bb-semibold">{author}</span>}
            {author && authorTitle && <span>, </span>}
            {authorTitle && <span>{authorTitle}</span>}
          </cite>
        </footer>
      )}
    </blockquote>
  );
};

export default Text;