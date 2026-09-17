import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariants } from "./button.variants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  /** Render the child element as the button (merging props/styles) instead of
   *  emitting a <button> — the React equivalent of reka-ui's as-child. Use it
   *  to give a Next.js <Link> or <a> full button styling. */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-uipkge=""
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size }), className)}
        // Default type="button" avoids accidental form submits. asChild leaves
        // type to the child (e.g. <a> / Next.js Link) and must not receive it.
        {...(asChild ? {} : { type })}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
