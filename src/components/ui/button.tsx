import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles with Better Being brand compliance
  "bb-button inline-flex items-center justify-center gap-bb-2 whitespace-nowrap font-semibold tracking-wide uppercase transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bb-orange focus-visible:ring-offset-2 focus-visible:ring-offset-bb-bg-primary disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Better Being Orange
        primary: "bg-bb-orange text-white border-2 border-bb-orange hover:bg-bb-orange-600 hover:border-bb-orange-600 active:bg-bb-orange-700 active:border-bb-orange-700 shadow-wellness-sm hover:shadow-wellness-md",
        
        // Secondary - Champagne with Orange border
        secondary: "bg-bb-champagne text-bb-orange border-2 border-bb-orange hover:bg-bb-champagne-200 hover:text-bb-orange-600 active:bg-bb-champagne-300 active:text-bb-orange-700 shadow-wellness-sm hover:shadow-wellness-md",
        
        // Tertiary - Transparent with Orange text
        tertiary: "bg-transparent text-bb-orange border-2 border-transparent hover:bg-bb-champagne-100 hover:border-bb-champagne-200 active:bg-bb-champagne-200 active:border-bb-champagne-300",
        
        // Destructive - Error red
        destructive: "bg-bb-error text-white border-2 border-bb-error hover:bg-bb-error-600 hover:border-bb-error-600 active:bg-bb-error-700 active:border-bb-error-700 shadow-wellness-sm hover:shadow-wellness-md",
        
        // Ghost - Minimal styling
        ghost: "bg-transparent text-bb-secondary border-2 border-transparent hover:bg-bb-champagne-100 hover:text-bb-primary active:bg-bb-champagne-200",
        
        // Link - Text only
        link: "bg-transparent text-bb-orange border-none p-0 h-auto font-normal underline-offset-4 hover:underline hover:text-bb-orange-600 active:text-bb-orange-700",
      },
      size: {
        // Small - 32px height
        sm: "h-8 px-bb-3 py-bb-2 text-sm rounded-bb-md gap-bb-1 [&_svg]:size-3",
        
        // Medium - 40px height (default)
        md: "h-10 px-bb-6 py-bb-3 text-base rounded-bb-lg gap-bb-2 [&_svg]:size-4",
        
        // Large - 48px height
        lg: "h-12 px-bb-8 py-bb-4 text-lg rounded-bb-lg gap-bb-2 [&_svg]:size-5",
        
        // Extra Large - 56px height
        xl: "h-14 px-bb-10 py-bb-5 text-xl rounded-bb-xl gap-bb-3 [&_svg]:size-6",
        
        // Icon only - Square button
        icon: "h-10 w-10 p-0 rounded-bb-lg [&_svg]:size-4",
        
        // Icon small
        "icon-sm": "h-8 w-8 p-0 rounded-bb-md [&_svg]:size-3",
        
        // Icon large
        "icon-lg": "h-12 w-12 p-0 rounded-bb-lg [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Loading state - shows spinner and disables button */
  loading?: boolean
  /** Icon to display - positioned based on iconPosition */
  icon?: React.ReactNode
  /** Position of the icon relative to text */
  iconPosition?: 'left' | 'right'
  /** Make button full width */
  fullWidth?: boolean
}

/**
 * Loading Spinner Component
 */
const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Determine if button should be disabled
    const isDisabled = disabled || loading
    
    // Handle icon and loading state rendering
    const renderIcon = () => {
      if (loading) {
        return <LoadingSpinner className="[&_svg]:size-current" />
      }
      return icon
    }
    
    // Handle content rendering based on icon position
    const renderContent = () => {
      if (!icon && !loading) {
        return children
      }
      
      const iconElement = renderIcon()
      
      if (iconPosition === 'right') {
        return (
          <>
            {children}
            {iconElement}
          </>
        )
      }
      
      return (
        <>
          {iconElement}
          {children}
        </>
      )
    }
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          {
            'w-full': fullWidth,
            'cursor-wait': loading,
          },
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {renderContent()}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
