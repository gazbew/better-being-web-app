import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/Logo/Logo';

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  children?: NavigationItem[];
}

export interface NavigationPrimaryProps {
  /** Navigation items */
  items: NavigationItem[];
  /** Current active path */
  activePath?: string;
  /** Logo props */
  logoProps?: React.ComponentProps<typeof Logo>;
  /** Additional CSS classes */
  className?: string;
  /** Mobile menu open state */
  mobileMenuOpen?: boolean;
  /** Mobile menu toggle handler */
  onMobileMenuToggle?: () => void;
}

/**
 * Primary Navigation Component
 * 
 * Brand-compliant navigation component following Better Being design guidelines
 */
export const NavigationPrimary: React.FC<NavigationPrimaryProps> = ({
  items,
  activePath,
  logoProps,
  className,
  mobileMenuOpen = false,
  onMobileMenuToggle,
}) => {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  
  const isMobileOpen = onMobileMenuToggle ? mobileMenuOpen : internalMobileOpen;
  const toggleMobile = onMobileMenuToggle || (() => setInternalMobileOpen(!internalMobileOpen));

  return (
    <nav className={cn("bb-navigation-primary bg-white border-b-2 border-bb-champagne-200 shadow-bb-wellness", className)}>
      <div className="bb-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant="full" size="md" {...logoProps} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline gap-bb-8">
              {items.map((item, index) => (
                <NavigationLink
                  key={index}
                  item={item}
                  activePath={activePath}
                />
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobile}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileOpen}
            >
              <svg
                className={cn("h-6 w-6 transition-transform", {
                  "rotate-90": isMobileOpen
                })}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-200 ease-in-out overflow-hidden",
          {
            "max-h-96 pb-bb-4": isMobileOpen,
            "max-h-0": !isMobileOpen
          }
        )}>
          <div className="px-bb-2 pt-bb-2 pb-bb-3 space-y-bb-1 border-t border-bb-champagne-200">
            {items.map((item, index) => (
              <MobileNavigationLink
                key={index}
                item={item}
                activePath={activePath}
                onClick={() => toggleMobile()}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * Desktop Navigation Link Component
 */
const NavigationLink: React.FC<{
  item: NavigationItem;
  activePath?: string;
}> = ({ item, activePath }) => {
  const isActive = activePath === item.href || item.active;

  return (
    <a
      href={item.href}
      className={cn(
        "bb-nav-link font-bb-secondary font-bb-medium text-bb-base tracking-bb-wide uppercase transition-all duration-200 ease-in-out px-bb-3 py-bb-2 rounded-bb-md hover:bg-bb-champagne-100 hover:text-bb-orange focus:outline-none focus:ring-2 focus:ring-bb-orange focus:ring-offset-2",
        {
          "text-bb-orange bg-bb-champagne-100": isActive,
          "text-bb-secondary": !isActive,
        }
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {item.label}
    </a>
  );
};

/**
 * Mobile Navigation Link Component
 */
const MobileNavigationLink: React.FC<{
  item: NavigationItem;
  activePath?: string;
  onClick?: () => void;
}> = ({ item, activePath, onClick }) => {
  const isActive = activePath === item.href || item.active;

  return (
    <a
      href={item.href}
      onClick={onClick}
      className={cn(
        "bb-nav-link-mobile block font-bb-secondary font-bb-medium text-bb-lg tracking-bb-wide uppercase transition-all duration-200 ease-in-out px-bb-3 py-bb-3 rounded-bb-md hover:bg-bb-champagne-100 hover:text-bb-orange focus:outline-none focus:ring-2 focus:ring-bb-orange focus:ring-offset-2",
        {
          "text-bb-orange bg-bb-champagne-100": isActive,
          "text-bb-secondary": !isActive,
        }
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {item.label}
    </a>
  );
};

export default NavigationPrimary;