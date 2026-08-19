import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const passwordInputVariants = cva(
  "flex w-full items-center gap-1.5 overflow-hidden border transition-[color,box-shadow] outline-none rounded-md",
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        default: "h-9 text-base md:text-sm",
        lg: "h-11 text-base",
      },
      variant: {
        outlined: "border-input bg-transparent shadow-xs",
        filled: "border-transparent bg-muted/50 shadow-none",
        borderless: "border-transparent bg-transparent shadow-none",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "outlined",
    },
  },
);

export type PasswordInputVariants = VariantProps<typeof passwordInputVariants>;
