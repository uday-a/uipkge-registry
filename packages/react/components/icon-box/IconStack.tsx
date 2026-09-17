"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type IconStackVariant =
  "primary" | "muted" | "destructive" | "success" | "warning";
export type IconStackSize = "sm" | "md" | "lg" | "xl";

export interface IconStackProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  variant?: IconStackVariant;
  size?: IconStackSize;
  iconClass?: string;
}

const sizeMap: Record<
  IconStackSize,
  { root: string; base: string; icon: string }
> = {
  sm: { root: "size-10", base: "size-8 rounded-lg", icon: "size-4" },
  md: { root: "size-14", base: "size-11 rounded-xl", icon: "size-5" },
  lg: { root: "size-18", base: "size-14 rounded-2xl", icon: "size-7" },
  xl: { root: "size-24", base: "size-18 rounded-3xl", icon: "size-9" },
};

const variantMap: Record<
  IconStackVariant,
  { back: string; front: string; text: string }
> = {
  primary: {
    back: "bg-primary/20 border-primary/30",
    front: "bg-background border-primary/20 shadow-primary/10",
    text: "text-primary",
  },
  muted: {
    back: "bg-muted border-border",
    front: "bg-card border-border shadow-black/5",
    text: "text-muted-foreground",
  },
  destructive: {
    back: "bg-destructive/20 border-destructive/30",
    front: "bg-background border-destructive/20 shadow-destructive/10",
    text: "text-destructive",
  },
  success: {
    back: "bg-success/20 border-success/30",
    front: "bg-background border-success/20 shadow-success/10",
    text: "text-success",
  },
  warning: {
    back: "bg-warning/20 border-warning/30",
    front: "bg-background border-warning/20 shadow-warning/10",
    text: "text-warning",
  },
};

export const IconStack = React.forwardRef<HTMLDivElement, IconStackProps>(
  (
    {
      className,
      icon: Icon,
      variant = "primary",
      size = "md",
      iconClass,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="icon-stack"
        data-variant={variant}
        data-size={size}
        className={cn(
          "relative inline-flex items-center justify-center select-none",
          sizeMap[size].root,
          className,
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 m-auto rotate-6 border transition-transform duration-300",
            sizeMap[size].base,
            variantMap[variant].back,
          )}
        />
        <div
          className={cn(
            "relative z-10 flex items-center justify-center border shadow-md transition-transform duration-300 group-hover:-translate-y-0.5",
            sizeMap[size].base,
            variantMap[variant].front,
            variantMap[variant].text,
          )}
        >
          {children ? (
            children
          ) : Icon ? (
            <Icon
              className={cn(sizeMap[size].icon, iconClass)}
              aria-hidden="true"
            />
          ) : null}
        </div>
      </div>
    );
  },
);

IconStack.displayName = "IconStack";
