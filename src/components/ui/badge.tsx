/**
 * Badge Component - Brutalist Neo Theme
 *
 * @theme brutalist-neo
 * @version 1.0.0
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ============================================
   Badge Variants
   ============================================ */

const badgeVariants = cva(
  // Base styles
  `inline-flex items-center
   border-2
   px-2.5 py-0.5
   text-xs font-semibold font-mono
   transition-colors
   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`,
  {
    variants: {
      variant: {
        default: `
          border-primary bg-primary text-primary-foreground
          shadow-xs
        `,
        secondary: `
          border-secondary bg-secondary text-secondary-foreground
        `,
        destructive: `
          border-destructive bg-destructive text-destructive-foreground
          shadow-xs
        `,
        outline: `
          border-border bg-transparent text-foreground
        `,
        success: `
          border-success bg-success text-success-foreground
          shadow-xs
        `,
        warning: `
          border-warning bg-warning text-warning-foreground
          shadow-xs
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/* ============================================
   Badge Component
   ============================================ */

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
