import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so components can import `backTopVariants` from './back-top.variants' without creating a circular dependency through the index.
 */
export const backTopVariants = cva(
  "inline-flex items-center justify-center rounded-full border bg-background text-foreground shadow-lg transition-[color,background-color,box-shadow] duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none cursor-pointer motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:zoom-out-95 [&_svg:not([class*=size-])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "size-8 [&_svg:not([class*=size-])]:size-4",
        default: "size-10",
        lg: "size-12 [&_svg:not([class*=size-])]:size-6",
      },
      position: {
        "bottom-right": "",
        "bottom-left": "",
        "top-right": "",
        "top-left": "",
      },
    },
    defaultVariants: {
      size: "default",
      position: "bottom-right",
    },
  },
);

export type BackTopVariants = VariantProps<typeof backTopVariants>;
