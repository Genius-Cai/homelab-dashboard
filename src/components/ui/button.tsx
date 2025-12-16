/**
 * Button Component - Brutalist Neo Theme
 *
 * @theme brutalist-neo
 * @version 1.0.0
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ============================================
   Button Variants
   ============================================ */

const buttonVariants = cva(
  // Base styles
  `inline-flex items-center justify-center gap-2 whitespace-nowrap
   text-sm font-medium font-mono
   transition-all duration-100
   disabled:pointer-events-none disabled:opacity-50
   [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4
   shrink-0 [&_svg]:shrink-0
   outline-none
   focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
   active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`,
  {
    variants: {
      variant: {
        // Primary: Solid purple with offset shadow
        default: `
          bg-primary text-primary-foreground
          border-2 border-primary
          shadow-sm
          hover:bg-primary/90
        `,

        // Secondary: White with purple border
        secondary: `
          bg-secondary text-secondary-foreground
          border-2 border-primary
          shadow-sm
          hover:bg-secondary/80
        `,

        // Destructive: Red for dangerous actions
        destructive: `
          bg-destructive text-destructive-foreground
          border-2 border-destructive
          shadow-sm
          hover:bg-destructive/90
        `,

        // Outline: Transparent with border
        outline: `
          bg-transparent text-foreground
          border-2 border-border
          shadow-sm
          hover:bg-accent hover:text-accent-foreground
        `,

        // Ghost: No background until hover
        ghost: `
          bg-transparent text-foreground
          border-2 border-transparent
          hover:bg-accent hover:text-accent-foreground
          hover:border-border
          active:shadow-none active:translate-x-0 active:translate-y-0
        `,

        // Link: Text only
        link: `
          text-primary underline-offset-4
          hover:underline
          active:shadow-none active:translate-x-0 active:translate-y-0
        `,
      },

      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/* ============================================
   Button Component
   ============================================ */

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
