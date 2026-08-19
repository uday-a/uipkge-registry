import * as React from "react";
import { cn } from "@/lib/utils";

export type IconBoxVariant =
  | "primary"
  | "muted"
  | "outline"
  | "solid"
  | "subtle"
  | "destructive"
  | "success"
  | "warning"
  | "ghost"
  | "custom";

export type IconBoxSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
export type IconBoxShape = "rounded" | "circle" | "square";

export interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional icon component rendered inside the box (e.g. a Lucide icon). */
  icon?: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  variant?: IconBoxVariant;
  shape?: IconBoxShape;
  size?: IconBoxSize;
  iconClass?: string;
  /** @deprecated Use `iconClass`. Kept for backwards compatibility. */
  iconClassName?: string;
}

const variantClasses: Record<IconBoxVariant, string> = {
  primary: "bg-primary/10 text-primary",
  muted: "bg-muted text-muted-foreground",
  outline: "border border-border bg-background text-foreground shadow-xs",
  solid: "bg-foreground text-background shadow-xs",
  subtle: "bg-accent text-accent-foreground",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
  custom: "",
};

const shapeClasses: Record<IconBoxShape, string> = {
  rounded: "rounded-lg",
  circle: "rounded-full",
  square: "rounded-none",
};

const sizeClasses: Record<IconBoxSize, string> = {
  "2xs": "size-6 p-1",
  xs: "size-7 p-1.5",
  sm: "size-8 p-1.5",
  md: "size-9 p-2",
  lg: "size-11 p-2.5",
  xl: "size-14 p-3.5",
};

const iconSizes: Record<IconBoxSize, string> = {
  "2xs": "size-3",
  xs: "size-3.5",
  sm: "size-4",
  md: "size-4.5",
  lg: "size-6",
  xl: "size-7",
};

const IconBox = React.forwardRef<HTMLDivElement, IconBoxProps>(
  (
    {
      className,
      icon: Icon,
      variant = "primary",
      shape = "rounded",
      size = "md",
      iconClass,
      iconClassName,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="icon-box"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(
        "inline-flex shrink-0 items-center justify-center transition-colors",
        variantClasses[variant],
        shapeClasses[shape],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children ? (
        children
      ) : Icon ? (
        <Icon
          className={cn(iconSizes[size], iconClass ?? iconClassName)}
          aria-hidden="true"
        />
      ) : null}
    </div>
  ),
);
IconBox.displayName = "IconBox";

export { IconBox };
