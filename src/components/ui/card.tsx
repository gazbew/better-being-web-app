import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bb-card rounded-bb-lg border transition-all duration-200 ease-in-out overflow-hidden",
  {
    variants: {
      variant: {
        // Standard card - Clean white background with subtle shadow
        standard: "bg-bb-secondary border-bb-primary shadow-wellness-sm hover:shadow-wellness-md hover:border-bb-secondary",
        
        // Premium card - Champagne background with orange accent
        premium: "bg-bb-champagne border-bb-orange shadow-premium-sm hover:shadow-premium-lg relative before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-bb-orange before:content-['']",
        
        // Product card - Interactive card for product listings
        product: "bg-bb-secondary border-bb-secondary shadow-wellness-sm hover:shadow-premium-md hover:border-bb-orange group",
        
        // Testimonial card - Styled for customer testimonials
        testimonial: "bg-bb-champagne-100 border-bb-champagne-300 shadow-wellness-sm relative before:absolute before:top-bb-4 before:left-bb-4 before:text-6xl before:text-bb-orange before:content-['\"'] before:font-serif before:leading-none before:opacity-20",
      },
      padding: {
        sm: "p-bb-4",
        md: "p-bb-6", 
        lg: "p-bb-8",
        xl: "p-bb-12",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-wellness-sm",
        md: "shadow-premium-md",
        lg: "shadow-floating-lg",
      },
    },
    defaultVariants: {
      variant: "standard",
      padding: "md",
      shadow: "sm",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Enable hover effects */
  hoverable?: boolean
  /** Add border styling */
  border?: boolean
  /** Make card interactive (clickable) */
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    padding, 
    shadow,
    hoverable = true, 
    border = true,
    interactive = false,
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, padding, shadow }),
        {
          // Hover effects based on variant
          'hover:scale-[1.02]': hoverable && variant === 'product',
          'hover:-translate-y-1': hoverable && (variant === 'premium' || variant === 'standard'),
          'hover:bg-bb-champagne-50': hoverable && variant === 'testimonial',
          
          // Interactive states
          'cursor-pointer': interactive,
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bb-orange focus-visible:ring-offset-2': interactive,
          
          // Border control
          'border-0': !border,
        },
        className
      )}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("bb-card-header flex flex-col gap-bb-2 p-bb-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "bb-card-title font-semibold text-xl text-bb-primary leading-tight tracking-normal",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("bb-card-description text-sm text-bb-secondary leading-normal", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("bb-card-content p-bb-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("bb-card-footer flex items-center gap-bb-3 p-bb-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

/**
 * Card Image Component - Optimized for product cards
 */
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Image aspect ratio */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, aspectRatio = 'landscape', alt, ...props }, ref) => (
    <div className={cn(
      "relative overflow-hidden bg-bb-champagne-100",
      {
        'aspect-square': aspectRatio === 'square',
        'aspect-video': aspectRatio === 'video', 
        'aspect-[3/4]': aspectRatio === 'portrait',
        'aspect-[4/3]': aspectRatio === 'landscape',
      }
    )}>
      <img
        ref={ref}
        className={cn(
          "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
          className
        )}
        alt={alt}
        {...props}
      />
    </div>
  )
)
CardImage.displayName = "CardImage"

/**
 * Card Badge Component - For labels and tags
 */
export interface CardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'premium'
}

const CardBadge = React.forwardRef<HTMLSpanElement, CardBadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-bb-2 py-bb-1 rounded-bb text-xs font-semibold tracking-wide uppercase",
        {
          'bg-bb-champagne-200 text-bb-secondary': variant === 'default',
          'bg-bb-success text-white': variant === 'success',
          'bg-bb-warning text-white': variant === 'warning', 
          'bg-bb-error text-white': variant === 'error',
          'bg-bb-orange text-white': variant === 'premium',
        },
        className
      )}
      {...props}
    />
  )
)
CardBadge.displayName = "CardBadge"

/**
 * Card Price Component - For product pricing
 */
export interface CardPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current price */
  price: string | number
  /** Original price (for sale items) */
  originalPrice?: string | number
  /** Currency symbol */
  currency?: string
}

const CardPrice = React.forwardRef<HTMLDivElement, CardPriceProps>(
  ({ className, price, originalPrice, currency = '$', ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-baseline gap-bb-2", className)}
      {...props}
    >
      <span className="text-xl font-bold text-bb-orange">
        {currency}{price}
      </span>
      {originalPrice && (
        <span className="text-sm text-bb-tertiary line-through">
          {currency}{originalPrice}
        </span>
      )}
    </div>
  )
)
CardPrice.displayName = "CardPrice"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardImage,
  CardBadge,
  CardPrice,
  cardVariants 
}
