import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consumers can import without creating a circular
 * dependency through the index. The class string is the React
 * ContextMenuItem one verbatim: `variant` / `inset` are applied through
 * `data-variant` / `data-inset` selectors already in it, so the variant
 * keys add nothing (they exist so `contextMenuItemVariants({ variant })`
 * keeps working for callers of the earlier API).
 */
export const contextMenuItemVariants = cva(
  "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:[&>svg,&>lucide-icon>svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: { default: '', destructive: '' },
      inset: { true: '', false: '' },
    },
    defaultVariants: { variant: 'default', inset: false },
  },
)

export type ContextMenuItemVariants = VariantProps<typeof contextMenuItemVariants>
