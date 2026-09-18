import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than inline in the
 * SFC) so `ProgressLinear.vue` can import them without the cva runtime
 * coupling that breaks SSR when several `<ProgressLinear>` instances
 * render before the module graph fully resolves. Sibling pattern to
 * `card/card.variants.ts`.
 */
export const progressLinearVariants = cva('relative overflow-hidden w-full', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      default: 'rounded-full',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    color: {
      default: 'bg-primary',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      success: 'bg-success',
      warning: 'bg-warning',
      info: 'bg-info',
      error: 'bg-destructive',
    },
  },
  defaultVariants: {
    rounded: 'default',
    color: 'default',
  },
})

export type ProgressLinearVariants = VariantProps<typeof progressLinearVariants>
