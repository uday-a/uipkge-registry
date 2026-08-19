"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";
import { toggleVariants, type ToggleVariants } from "./toggle.variants";

export interface ToggleProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
      "asChild"
    >,
    ToggleVariants {
  /** Render the child element as the toggle (merging props/styles) instead of
   *  emitting a <button> — the React equivalent of reka-ui's as-child. */
  asChild?: boolean;
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    data-uipkge=""
    data-slot="toggle"
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
));
Toggle.displayName = "Toggle";

export { Toggle };
