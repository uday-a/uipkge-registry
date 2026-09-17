"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "inline" | "block";
}

export const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  InputGroupAddonProps
>(({ className, align = "inline", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="input-group-addon"
      className={cn(
        "text-muted-foreground flex shrink-0 items-center justify-center px-3 text-sm select-none",
        "border-input first:rounded-l-[calc(var(--radius)-1px)] last:rounded-r-[calc(var(--radius)-1px)]",
        "border-r first:border-l-0 last:border-r-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

InputGroupAddon.displayName = "InputGroupAddon";
