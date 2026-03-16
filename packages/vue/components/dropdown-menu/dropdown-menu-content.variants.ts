import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */
export const dropdownMenuContentVariants = cva(
  'z-50 max-h-(--reka-dropdown-menu-content-available-height) min-w-32 origin-(--reka-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  {
    variants: {
      side: {
        bottom: 'data-[side=bottom]:slide-in-from-top-2',
        left: 'data-[side=left]:slide-in-from-right-2',
        right: 'data-[side=right]:slide-in-from-left-2',
        top: 'data-[side=top]:slide-in-from-bottom-2',
      },
    },
  },
)

export type DropdownMenuContentVariants = VariantProps<typeof dropdownMenuContentVariants>
