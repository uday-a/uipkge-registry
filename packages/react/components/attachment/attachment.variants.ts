import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */

export const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 rounded-xl border bg-card text-card-foreground transition-colors data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default: "gap-2 p-2 text-sm",
        sm: "gap-2 p-1.5 text-xs",
        xs: "gap-1.5 rounded-lg p-1 text-xs",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  },
);

export const attachmentMediaVariants = cva(
  "relative flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        default: "w-10",
        sm: "w-8",
        xs: 'w-7 rounded-md [&_svg:not([class*="size-"])]:size-3.5',
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type AttachmentVariants = VariantProps<typeof attachmentVariants>;
