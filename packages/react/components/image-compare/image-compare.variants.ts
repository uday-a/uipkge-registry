import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const imageCompareVariants = cva(
  "bg-muted relative overflow-hidden rounded-lg border select-none",
  {
    variants: {
      orientation: {
        horizontal: "cursor-ew-resize",
        vertical: "cursor-ns-resize",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export type ImageCompareVariants = VariantProps<typeof imageCompareVariants>;
