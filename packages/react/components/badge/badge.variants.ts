import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */

export const badgeVariants = cva(
  // text-overflow/ellipsis cannot apply to a flex container's anonymous text,
  // so truncation is opt-in via a child span (`<Badge><span class="truncate">
  // …</span></Badge>`); min-w-0 lets that span shrink inside the flex root.
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit max-w-full whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:shrink-0 [&>span]:min-w-0 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-transparent bg-success/10 text-success dark:text-success [a&]:hover:bg-success/20",
        warning:
          "border-transparent bg-warning/10 text-warning dark:text-warning [a&]:hover:bg-warning/20",
        info: "border-transparent bg-info/10 text-info dark:text-info [a&]:hover:bg-info/20",
      },
      // Allow multi-line labels. rounded-lg + extra leading keeps a wrapped
      // badge readable instead of a cramped two-line stadium pill.
      wrap: {
        true: "whitespace-normal rounded-lg py-1 leading-snug",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
