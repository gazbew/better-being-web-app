import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Input } from "./input"

export interface FormFieldProps {
  /** Field label */
  label?: string
  /** Field description/help text */
  description?: string
  /** Error message */
  error?: string
  /** Success message */
  success?: string
  /** Required field indicator */
  required?: boolean
  /** Field ID for accessibility */
  id?: string
  /** Additional CSS classes */
  className?: string
  /** Input props */
  inputProps?: React.ComponentProps<typeof Input>
  /** Children (for custom input components) */
  children?: React.ReactNode
}

/**
 * FormField Component
 * 
 * A complete form field with label, input, validation states, and help text
 * following Better Being brand guidelines.
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  description,
  error,
  success,
  required = false,
  id,
  className,
  inputProps,
  children,
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
  const descriptionId = description ? `${fieldId}-description` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const successId = success ? `${fieldId}-success` : undefined
  
  // Determine input variant based on validation state
  const inputVariant = error ? 'error' : success ? 'success' : 'default'
  const labelVariant = error ? 'error' : success ? 'success' : 'default'
  
  return (
    <div className={cn("bb-form-field space-y-bb-2", className)}>
      {/* Label */}
      {label && (
        <Label 
          htmlFor={fieldId}
          variant={labelVariant}
          className="flex items-center gap-bb-1"
        >
          {label}
          {required && (
            <span className="text-bb-error" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}
      
      {/* Description */}
      {description && (
        <p 
          id={descriptionId}
          className="bb-form-description text-bb-xs text-bb-tertiary leading-bb-normal"
        >
          {description}
        </p>
      )}
      
      {/* Input */}
      <div className="bb-form-input-wrapper">
        {children || (
          <Input
            id={fieldId}
            variant={inputVariant}
            aria-describedby={cn(
              descriptionId,
              errorId,
              successId
            ).trim() || undefined}
            aria-invalid={error ? 'true' : 'false'}
            {...inputProps}
          />
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p 
          id={errorId}
          className="bb-form-error text-bb-xs text-bb-error leading-bb-normal flex items-center gap-bb-1"
          role="alert"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0C2.686 0 0 2.686 0 6s2.686 6 6 6 6-2.686 6-6S9.314 0 6 0zM5 3h2v4H5V3zm0 5h2v1H5V8z"/>
          </svg>
          {error}
        </p>
      )}
      
      {/* Success Message */}
      {success && (
        <p 
          id={successId}
          className="bb-form-success text-bb-xs text-bb-success leading-bb-normal flex items-center gap-bb-1"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0C2.686 0 0 2.686 0 6s2.686 6 6 6 6-2.686 6-6S9.314 0 6 0zm2.293 4.707L5.5 7.5 3.707 5.707l.586-.586L5.5 6.328l2.207-2.207.586.586z"/>
          </svg>
          {success}
        </p>
      )}
    </div>
  )
}

export default FormField