import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */

export const accordionVariants = cva('w-full', {
  variants: {
    variant: {
      // Bottom-border between items (the classic shadcn look).
      default: '',
      // Each item is its own bordered card with a small gap between them.
      separated: 'space-y-2',
      // Borderless. Use when the parent container already provides framing.
      ghost: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: 'border-b border-border last:border-b-0',
      separated: 'rounded-md border border-border bg-card overflow-hidden',
      ghost: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const accordionTriggerVariants = cva(
  'group/accordion-trigger flex w-full items-center justify-between gap-3 text-sm font-medium text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 hover:text-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'py-4',
        separated: 'px-4 py-3 hover:bg-muted/50',
        ghost: 'py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type AccordionVariants = VariantProps<typeof accordionVariants>

export type AccordionItemVariants = VariantProps<typeof accordionItemVariants>

export type AccordionTriggerVariants = VariantProps<typeof accordionTriggerVariants>
