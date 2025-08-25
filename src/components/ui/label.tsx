import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "bb-label font-bb-secondary font-bb-semibold text-bb-sm text-bb-secondary tracking-bb-wide leading-bb-normal uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-bb-secondary",
        error: "text-bb-error",
        success: "text-bb-success",
      },
      size: {
        sm: "text-bb-xs",
        md: "text-bb-sm", 
        lg: "text-bb-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, size, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, size }), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
