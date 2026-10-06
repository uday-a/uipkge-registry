import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */

export const tabsListVariants = cva(
  // Scrollable when triggers overflow. Centering uses trigger auto margins
  // instead of justify-center so an overflowing list stays scrollable from its
  // start edge (justify-center + overflow makes leading items unreachable).
  // The scrollbar is hidden; scrolling still works via wheel/touch/keyboard.
  'inline-flex h-9 max-w-full items-center overflow-x-auto rounded-lg bg-muted p-1 text-muted-foreground overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>[data-slot=tabs-trigger]:first-child]:ml-auto [&>[data-slot=tabs-trigger]:last-child]:mr-auto',
  {
    variants: {
      variant: {
        // Solid muted track with rounded inset triggers — the default look.
        segmented: 'gap-1 rounded-lg bg-muted p-1',
        // Transparent track with rounded-full pill triggers.
        pill: 'h-auto gap-2 bg-transparent p-0',
        // Bottom-border bar (horizontal) or right-border bar (vertical), with
        // an underline on the active trigger.
        underline: 'h-auto gap-0 bg-transparent p-0',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'h-auto flex-col items-stretch',
      },
    },
    compoundVariants: [
      {
        variant: 'underline',
        orientation: 'horizontal',
        // Neutralize the base auto-margin centering; this variant aligns start.
        class:
          'w-full justify-start border-b border-border [&>[data-slot=tabs-trigger]:first-child]:ml-0 [&>[data-slot=tabs-trigger]:last-child]:mr-0',
      },
      {
        variant: 'underline',
        orientation: 'vertical',
        class: 'border-r border-border',
      },
    ],
    defaultVariants: {
      variant: 'segmented',
      orientation: 'horizontal',
    },
  },
)

export const tabsTriggerVariants = cva(
  // z-10 keeps label above the sliding indicator; active surface paints on the indicator
  // when the parent list has data-animated="true". Static active chrome restores when
  // data-animated="false" (see group-data variants below).
  'relative z-10 inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium ring-offset-background [&_svg]:shrink-0 transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Active bg/shadow live on TabsList indicator so it can slide between triggers.
        segmented:
          'rounded-md data-[state=active]:text-foreground group-data-[animated=false]/list:data-[state=active]:bg-background group-data-[animated=false]/list:data-[state=active]:shadow-xs',
        pill: 'rounded-full border border-border bg-transparent data-[state=active]:border-transparent data-[state=active]:text-primary-foreground group-data-[animated=false]/list:data-[state=active]:bg-primary group-data-[animated=false]/list:data-[state=active]:border-primary',
        // Underline bar slides on TabsList indicator; keep transparent border for layout stability.
        underline:
          'rounded-none border-b-2 border-transparent -mb-px data-[state=active]:text-foreground group-data-[animated=false]/list:data-[state=active]:border-foreground',
      },
      size: {
        default: 'h-7 px-3 text-sm',
        sm: 'h-6 px-2.5 text-xs',
        lg: 'h-8 px-4 text-sm',
      },
      orientation: {
        horizontal: '',
        vertical: 'w-full justify-start',
      },
    },
    compoundVariants: [
      {
        variant: 'underline',
        orientation: 'vertical',
        class: 'border-b-0 border-r-2 -mr-px group-data-[animated=false]/list:data-[state=active]:border-foreground',
      },
    ],
    defaultVariants: {
      variant: 'segmented',
      size: 'default',
      orientation: 'horizontal',
    },
  },
)

export type TabsListVariants = VariantProps<typeof tabsListVariants>

export type TabsTriggerVariants = VariantProps<typeof tabsTriggerVariants>
