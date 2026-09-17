import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so `Card.vue` can `import { cardVariants } from './card.variants'`
 * without creating a circular dependency back through the index. The circular
 * form caused intermittent `$setup.cardVariants is not a function` errors
 * during dev SSR when several `<Card>` instances rendered in a v-for before
 * the module graph had fully resolved.
 */
export const cardVariants = cva(
  'bg-card text-card-foreground rounded-xl border shadow-sm transition-colors duration-150',
  {
    variants: {
      variant: {
        default: 'border-border',
        elevated: 'border-transparent shadow-md hover:shadow-md',
        outline: 'border-2',
        ghost: 'border-transparent shadow-none hover:bg-muted/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type CardVariants = VariantProps<typeof cardVariants>
