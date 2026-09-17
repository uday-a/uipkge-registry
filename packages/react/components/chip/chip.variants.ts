import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */

export const chipVariants = cva(
  // text-overflow/ellipsis cannot apply to a flex container's anonymous text,
  // so truncation is opt-in via a child span (`<Chip><span class="truncate">
  // …</span></Chip>`); min-w-0 lets that span shrink inside the flex root.
  "inline-flex items-center justify-center gap-1 rounded-full text-xs font-medium w-fit max-w-full whitespace-nowrap shrink-0 [&>span]:min-w-0 transition-colors duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground hover:bg-muted/80",
        filled: "bg-primary text-primary-foreground hover:bg-primary/90",
        outlined: "border border-current bg-transparent hover:bg-accent",
        outline: "border border-current bg-transparent hover:bg-accent",
        elevated: "bg-primary/10 text-primary shadow-sm hover:bg-primary/20",
        success:
          "bg-success/10 text-success dark:text-success hover:bg-success/20",
        warning:
          "bg-warning/10 text-warning dark:text-warning hover:bg-warning/20",
        destructive:
          "bg-destructive/10 text-destructive dark:text-destructive hover:bg-destructive/20",
      },
      size: {
        sm: "h-6 px-2 text-xs",
        default: "h-7 px-2.5 text-xs",
        lg: "h-8 px-3 text-sm",
      },
      // Allow multi-line labels. rounded-lg + extra leading keeps a wrapped
      // chip readable instead of a cramped two-line stadium pill.
      wrap: {
        true: "whitespace-normal h-auto rounded-lg py-1 leading-snug",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ChipVariants = VariantProps<typeof chipVariants>;
