import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-emerald-500/30 bg-emerald-950/40 text-emerald-300 shadow-sm",
        secondary:
          "border-slate-700 bg-slate-800 text-slate-300",
        destructive:
          "border-red-500/30 bg-red-950/40 text-red-300",
        outline: "text-foreground border-emerald-500/40",
        verified: "border-teal-500/40 bg-teal-950/60 text-teal-300 flex items-center gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
