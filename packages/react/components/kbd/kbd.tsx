import * as React from "react";
import { cn } from "@/lib/utils";

const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      data-uipkge=""
      data-slot="kbd"
      className={cn(
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded border px-1.5 font-mono text-xs font-medium select-none",
        className,
      )}
      {...props}
    />
  ),
);
Kbd.displayName = "Kbd";

export { Kbd };
