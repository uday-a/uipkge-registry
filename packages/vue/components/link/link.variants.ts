import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const linkVariants = cva(
  "inline-flex items-center gap-1.5 font-medium transition-colors duration-200 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      underline: {
        none: "no-underline",
        always: "underline underline-offset-4",
        hover: "no-underline hover:underline hover:underline-offset-4",
      },
      color: {
        default: "text-foreground hover:text-foreground/80",
        primary: "text-primary hover:text-primary/80",
        muted: "text-muted-foreground hover:text-foreground",
      },
      size: {
        sm: "text-xs gap-1",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      underline: "hover",
      color: "primary",
      size: "default",
    },
  },
);

export type LinkVariants = VariantProps<typeof linkVariants>;
