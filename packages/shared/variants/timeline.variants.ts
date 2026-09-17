import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */

export const timelineMediaVariants = cva(
  'relative z-10 flex shrink-0 items-center justify-center rounded-full ring-4 ring-background [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        dot: 'size-3',
        icon: 'size-8 [&>svg]:size-4',
        avatar: 'size-9 ring-2 [&>img]:size-full [&>img]:rounded-full [&>img]:object-cover',
      },
      status: {
        default: 'bg-primary text-primary-foreground',
        current: 'bg-primary text-primary-foreground ring-primary/25',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        error: 'bg-destructive text-destructive-foreground',
        info: 'bg-info text-info-foreground',
        muted: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'dot',
      status: 'default',
    },
  },
)

export type TimelineMediaVariantsProps = VariantProps<typeof timelineMediaVariants>
export type TimelineMediaVariant = 'dot' | 'icon' | 'avatar'
