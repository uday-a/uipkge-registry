import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { fabVariants, type FabVariants } from "./fab.variants";

export interface FabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, FabVariants {
  /** Label text — renders an extended FAB. Use children for the icon. */
  label?: string;
  /** Render the child element as the FAB (merging props/styles) instead of
   *  emitting a <button> — the React equivalent of reka-ui's as-child. */
  asChild?: boolean;
  /** Use absolute instead of fixed positioning (for contained FABs). */
  absolute?: boolean;
  /** Accessible label. Defaults to the label prop or 'Floating action'. */
  ariaLabel?: string;
}

const Fab = React.forwardRef<HTMLButtonElement, FabProps>(
  (
    {
      className,
      label,
      asChild = false,
      variant,
      size,
      position,
      absolute = false,
      disabled,
      ariaLabel,
      "aria-label": ariaLabelAttr,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedSize = label ? "extended" : size;
    const finalAriaLabel =
      ariaLabelAttr || ariaLabel || label || "Floating action";
    return (
      <Comp
        data-uipkge=""
        data-slot="fab"
        data-variant={variant ?? undefined}
        data-size={resolvedSize ?? undefined}
        data-position={position ?? undefined}
        disabled={disabled}
        aria-label={finalAriaLabel}
        className={cn(
          fabVariants({ variant, size: resolvedSize, position }),
          absolute && position !== "inline" && "absolute",
          className,
        )}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
        }}
        ref={ref}
        {...props}
      >
        {children}
        {label ? <span className="pr-1">{label}</span> : null}
      </Comp>
    );
  },
);
Fab.displayName = "Fab";

export { Fab };
