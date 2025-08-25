import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Logo Component Variants
 */
export type LogoVariant = 'full' | 'icon' | 'text';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoColor = 'default' | 'white' | 'dark' | 'orange' | 'green';

/**
 * Logo Component Props
 */
export interface LogoProps {
  /** Logo variant - full logo, icon only, or text only */
  variant?: LogoVariant;
  /** Size of the logo */
  size?: LogoSize;
  /** Color variant for different backgrounds */
  color?: LogoColor;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether the logo should be clickable */
  clickable?: boolean;
}

/**
 * Size configurations for different logo variants
 */
const sizeConfig = {
  sm: {
    full: { width: 120, height: 40 },
    icon: { width: 32, height: 32 },
    text: { fontSize: '1rem' }
  },
  md: {
    full: { width: 160, height: 54 },
    icon: { width: 40, height: 40 },
    text: { fontSize: '1.25rem' }
  },
  lg: {
    full: { width: 200, height: 68 },
    icon: { width: 48, height: 48 },
    text: { fontSize: '1.5rem' }
  },
  xl: {
    full: { width: 240, height: 80 },
    icon: { width: 64, height: 64 },
    text: { fontSize: '2rem' }
  }
};

/**
 * Color configurations for different backgrounds
 */
const colorConfig = {
  default: {
    primary: 'var(--bb-orange)',
    secondary: 'var(--bb-green)',
    text: 'var(--bb-text-primary)'
  },
  white: {
    primary: '#FFFFFF',
    secondary: '#F5F0E8',
    text: '#FFFFFF'
  },
  dark: {
    primary: 'var(--bb-orange)',
    secondary: 'var(--bb-green)',
    text: 'var(--bb-text-primary)'
  },
  orange: {
    primary: 'var(--bb-orange)',
    secondary: 'var(--bb-orange-600)',
    text: 'var(--bb-orange)'
  },
  green: {
    primary: 'var(--bb-green)',
    secondary: 'var(--bb-green-600)',
    text: 'var(--bb-green)'
  }
};

/**
 * Logo Icon Component - SVG representation of Better Being logo
 */
const LogoIconSVG: React.FC<{ size: LogoSize; color: LogoColor; className?: string }> = ({ 
  size, 
  color, 
  className 
}) => {
  const dimensions = sizeConfig[size].icon;
  const colors = colorConfig[color];

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('logo-icon', className)}
      role="img"
      aria-label="Better Being Logo Icon"
    >
      {/* Outer circle - represents wholeness and wellness */}
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Inner leaf design - represents natural wellness */}
      <path
        d="M16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24C32 28.4183 28.4183 32 24 32"
        stroke={colors.secondary}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Complementary leaf */}
      <path
        d="M32 24C32 28.4183 28.4183 32 24 32C19.5817 32 16 28.4183 16 24C16 19.5817 19.5817 16 24 16"
        stroke={colors.secondary}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      
      {/* Center dot - represents balance and focus */}
      <circle
        cx="24"
        cy="24"
        r="3"
        fill={colors.primary}
      />
      
      {/* Brand initials - subtle integration */}
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--bb-font-secondary)"
        fontWeight="600"
        fill={colors.text}
        opacity="0.8"
      >
        BB
      </text>
    </svg>
  );
};

/**
 * Logo Text Component - Typography-based logo
 */
const LogoTextSVG: React.FC<{ size: LogoSize; color: LogoColor; className?: string }> = ({ 
  size, 
  color, 
  className 
}) => {
  const fontSize = sizeConfig[size].text.fontSize;
  const colors = colorConfig[color];

  return (
    <div 
      className={cn('logo-text flex items-center', className)}
      style={{ fontSize }}
    >
      <span 
        className="font-bb-primary font-bb-bold tracking-bb-brand"
        style={{ color: colors.primary }}
      >
        Better
      </span>
      <span 
        className="font-bb-primary font-bb-bold tracking-bb-brand ml-1"
        style={{ color: colors.secondary }}
      >
        Being
      </span>
    </div>
  );
};

/**
 * Full Logo Component - Icon + Text combination
 */
const FullLogoSVG: React.FC<{ size: LogoSize; color: LogoColor; className?: string }> = ({ 
  size, 
  color, 
  className 
}) => {
  const dimensions = sizeConfig[size].full;

  return (
    <div 
      className={cn('logo-full flex items-center gap-3', className)}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height 
      }}
    >
      <LogoIconSVG size={size} color={color} />
      <LogoTextSVG size={size} color={color} />
    </div>
  );
};

/**
 * Main Logo Component
 * 
 * A flexible logo component that supports multiple variants, sizes, and color schemes
 * following Better Being brand guidelines.
 * 
 * @example
 * ```tsx
 * // Full logo with default styling
 * <Logo variant="full" size="md" />
 * 
 * // Icon only for compact spaces
 * <Logo variant="icon" size="sm" color="white" />
 * 
 * // Text only for headers
 * <Logo variant="text" size="lg" color="orange" />
 * 
 * // Clickable logo for navigation
 * <Logo variant="full" size="md" clickable onClick={() => navigate('/')} />
 * ```
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  color = 'default',
  className,
  alt = 'Better Being',
  onClick,
  clickable = false,
  ...props
}) => {
  const isClickable = clickable || !!onClick;
  
  const logoContent = () => {
    switch (variant) {
      case 'icon':
        return <LogoIconSVG size={size} color={color} />;
      case 'text':
        return <LogoTextSVG size={size} color={color} />;
      case 'full':
      default:
        return <FullLogoSVG size={size} color={color} />;
    }
  };

  const baseClasses = cn(
    'logo',
    `logo--${variant}`,
    `logo--${size}`,
    `logo--${color}`,
    {
      'cursor-pointer transition-transform duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-bb-orange focus:ring-offset-2': isClickable,
      'select-none': true
    },
    className
  );

  if (isClickable) {
    return (
      <button
        type="button"
        className={baseClasses}
        onClick={onClick}
        aria-label={alt}
        {...props}
      >
        {logoContent()}
      </button>
    );
  }

  return (
    <div 
      className={baseClasses}
      role="img"
      aria-label={alt}
      {...props}
    >
      {logoContent()}
    </div>
  );
};

/**
 * Logo component variants for easy access
 */
export const LogoFull: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <Logo variant="full" {...props} />
);

export const LogoIcon: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <Logo variant="icon" {...props} />
);

export const LogoText: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <Logo variant="text" {...props} />
);

export default Logo;