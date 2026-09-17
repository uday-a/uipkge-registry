import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { badgeVariants, type BadgeVariants } from "./badge.variants";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, BadgeVariants {
  /** Render the child element as the badge (e.g. an <a>) instead of a <span>. */
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, wrap, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        data-uipkge=""
        data-slot="badge"
        className={cn(badgeVariants({ variant, wrap }), className)}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge };
