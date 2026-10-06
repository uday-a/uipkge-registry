import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming components can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */
export const navigationMenuContentVariants = cva(
  'data-[motion^=from-]:motion-safe:animate-in data-[motion^=to-]:motion-safe:animate-out data-[motion^=from-]:motion-safe:fade-in data-[motion^=to-]:motion-safe:fade-out data-[motion=from-end]:motion-safe:slide-in-from-right-52 data-[motion=from-start]:motion-safe:slide-in-from-left-52 data-[motion=to-end]:motion-safe:slide-out-to-right-52 data-[motion=to-start]:motion-safe:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto',
)
