import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "bb-input flex w-full rounded-bb-md border-2 font-bb-body text-bb-base transition-all duration-200 ease-in-out file:border-0 file:bg-transparent file:font-bb-secondary file:font-bb-medium file:text-bb-secondary placeholder:text-bb-tertiary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-bb-champagne border-bb-champagne-300 text-bb-primary focus:border-bb-orange focus:bg-white focus:ring-2 focus:ring-bb-orange/20",
        error: "bg-bb-champagne border-bb-error text-bb-primary focus:border-bb-error focus:bg-white focus:ring-2 focus:ring-bb-error/20",
        success: "bg-bb-champagne border-bb-success text-bb-primary focus:border-bb-success focus:bg-white focus:ring-2 focus:ring-bb-success/20",
      },
      size: {
        sm: "h-8 px-bb-3 py-bb-2 text-bb-sm",
        md: "h-10 px-bb-4 py-bb-3 text-bb-base",
        lg: "h-12 px-bb-5 py-bb-4 text-bb-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
