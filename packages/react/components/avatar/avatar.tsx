"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { avatarVariants, avatarFallbackVariants } from "./avatar.variants";

/* ------------------------------------------------------------------ */
/* Avatar (Root)                                                       */
/* ------------------------------------------------------------------ */

export interface AvatarProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
  "color"
> {
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl";
  rounded?:
    "none" | "sm" | "default" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "error"
    | "muted";
  variant?: "default" | "outlined" | "soft";
  tile?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  (
    {
      className,
      size,
      rounded,
      color,
      variant,
      tile = false,
      disabled = false,
      loading = false,
      ...props
    },
    ref,
  ) => (
    <AvatarPrimitive.Root
      ref={ref}
      data-uipkge=""
      data-slot="avatar"
      className={cn(
        avatarVariants({ size, rounded, color, variant }),
        tile ? "rounded-none" : "",
        disabled ? "cursor-not-allowed opacity-50" : "",
        loading ? "animate-pulse" : "",
        className,
      )}
      {...props}
    />
  ),
);
Avatar.displayName = "Avatar";

/* ------------------------------------------------------------------ */
/* AvatarImage                                                         */
/* ------------------------------------------------------------------ */

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-uipkge=""
    data-slot="avatar-image"
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

/* ------------------------------------------------------------------ */
/* AvatarFallback                                                      */
/* ------------------------------------------------------------------ */

export interface AvatarFallbackProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
  "color"
> {
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "error"
    | "muted";
  text?: string;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(
  (
    {
      className,
      size = "default",
      color = "default",
      text,
      children,
      ...props
    },
    ref,
  ) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-uipkge=""
      data-slot="avatar-fallback"
      className={cn(avatarFallbackVariants({ size, color }), className)}
      {...props}
    >
      {text ?? children}
    </AvatarPrimitive.Fallback>
  ),
);
AvatarFallback.displayName = "AvatarFallback";

/* ------------------------------------------------------------------ */
/* AvatarGroup — custom layout wrapper (not a Radix primitive)         */
/* ------------------------------------------------------------------ */

const overflowSizeClasses: Record<
  NonNullable<AvatarGroupProps["size"]>,
  string
> = {
  xs: "size-4 text-xs",
  sm: "size-6 text-xs",
  default: "size-8 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
  "2xl": "size-20 text-xl",
};

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  overlap?: boolean;
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl";
  total?: number;
  /** Custom overflow indicator. Receives the hidden count; replaces the
   *  default `+N` badge when provided. */
  overflow?: (count: number) => React.ReactNode;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      max,
      overlap = true,
      size = "default",
      total,
      overflow,
      children,
      ...props
    },
    ref,
  ) => {
    const items = React.Children.toArray(children);
    const count = total ?? items.length;
    // When overflowing, reserve one slot for the +N chip so max includes the badge.
    const showOverflow = max != null && count > max;
    const visibleLimit = showOverflow ? Math.max(max - 1, 0) : items.length;
    const visible = items.slice(0, visibleLimit);
    const overflowCount = showOverflow ? count - visibleLimit : 0;

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="avatar-group"
        className={cn(
          "flex items-center",
          overlap ? "-space-x-2" : "gap-1",
          className,
        )}
        {...props}
      >
        {visible}
        {showOverflow ? (
          <div
            className={cn(
              "bg-muted ring-background relative flex shrink-0 overflow-hidden rounded-full ring-2",
              overflowSizeClasses[size],
            )}
          >
            {overflow ? (
              overflow(overflowCount)
            ) : (
              <span className="flex size-full items-center justify-center font-medium">
                +{overflowCount}
              </span>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
