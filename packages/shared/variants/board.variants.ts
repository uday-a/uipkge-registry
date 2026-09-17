import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file so consuming SFCs avoid the
 * circular-dep trap when importing from `index.ts`. Same pattern as
 * `timeline.variants.ts` / `card.variants.ts`.
 */

export const boardLaneVariants = cva(
  "flex min-h-0 flex-col gap-3 rounded-xl border p-3 motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]",
  {
    variants: {
      tone: {
        default: "bg-muted/30",
        plain: "bg-transparent",
      },
      // Visual weight of `over` and `rejecting` deliberately matches so
      // the eye reads them as the same kind of signal (drop intent),
      // differing only in tone (primary = OK, destructive = NO).
      state: {
        idle: "",
        over: "border-primary/60 bg-primary/5 ring-2 ring-primary/30 ring-offset-1 ring-offset-background",
        rejecting:
          "border-destructive/40 bg-destructive/5 ring-2 ring-destructive/30 ring-offset-1 ring-offset-background",
      },
    },
    defaultVariants: { tone: "default", state: "idle" },
  },
);

export const boardCardVariants = cva(
  "bg-card hover:border-primary/40 group block w-full cursor-grab rounded-md border p-2 text-left outline-none motion-safe:transition-[transform,box-shadow,opacity,border-color] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30 active:cursor-grabbing",
  {
    variants: {
      state: {
        idle: "shadow-sm motion-safe:hover:-translate-y-1 hover:shadow-md",
        dragging: "scale-95 opacity-40 shadow-none",
        moved:
          "shadow-sm ring-2 ring-primary/50 ring-offset-1 ring-offset-background",
      },
    },
    defaultVariants: { state: "idle" },
  },
);

export type BoardLaneVariantsProps = VariantProps<typeof boardLaneVariants>;
export type BoardCardVariantsProps = VariantProps<typeof boardCardVariants>;
