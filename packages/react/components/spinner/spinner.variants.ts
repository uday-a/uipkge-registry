import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */

// motion-safe: honor prefers-reduced-motion (static glyph when reduced).
export const spinnerVariants = cva(
  "motion-safe:animate-spin text-muted-foreground",
  {
    variants: {
      size: {
        default: "size-6",
        sm: "size-4",
        lg: "size-8",
        icon: "size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
