import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const fabVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium shadow-lg transition-[color,background-color,box-shadow,transform,scale] duration-200 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] active:scale-95 touch-manipulation [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      },
      size: {
        mini: "size-10 [&_svg:not([class*='size-'])]:size-4",
        default: "size-14",
        large: "size-16 [&_svg:not([class*='size-'])]:size-7",
        extended: "h-14 px-5",
      },
      position: {
        "bottom-right": "fixed bottom-6 right-6",
        "bottom-left": "fixed bottom-6 left-6",
        "top-right": "fixed top-6 right-6",
        "top-left": "fixed top-6 left-6",
        "bottom-center": "fixed bottom-6 left-1/2 -translate-x-1/2",
        inline: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
    },
  },
);

export type FabVariants = VariantProps<typeof fabVariants>;
