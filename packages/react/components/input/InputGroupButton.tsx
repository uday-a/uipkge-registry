"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputGroupButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline";
}

const variantClasses: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  outline: "border-l border-input hover:bg-accent hover:text-accent-foreground",
};

export const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(
  (
    {
      className,
      variant = "ghost",
      disabled,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        data-uipkge=""
        data-slot="input-group-button"
        disabled={disabled}
        className={cn(
          "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 px-3 text-sm font-medium transition-colors select-none",
          "first:rounded-l-[calc(var(--radius)-1px)] last:rounded-r-[calc(var(--radius)-1px)]",
          "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

InputGroupButton.displayName = "InputGroupButton";
