"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { skeletonLoaderVariants } from "./skeleton.variants";

/* ------------------------------------------------------------------ */
/* Shimmer keyframes                                                   */
/* Ported from Skeleton.vue's <style scoped> block. Injected once so    */
/* the component ships self-contained (Tailwind has no equivalent      */
/* color-mix gradient sweep utility). Slow 1.8s sweep per NN/g.        */
/* ------------------------------------------------------------------ */
const shimmerCss = `
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--muted) 100%, transparent) 0%,
    color-mix(in srgb, var(--muted) 60%, var(--foreground) 8%) 50%,
    color-mix(in srgb, var(--muted) 100%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.8s linear infinite;
}
@keyframes skeleton-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer {
    animation: none;
    background: var(--muted);
  }
}
`;

function ShimmerStyle() {
  return <style dangerouslySetInnerHTML={{ __html: shimmerCss }} />;
}

/* ------------------------------------------------------------------ */
/* Skeleton                                                            */
/* ------------------------------------------------------------------ */

const skeletonVariantClasses: Record<
  NonNullable<SkeletonProps["variant"]>,
  string
> = {
  rectangular: "",
  rounded: "rounded-md",
  circular: "rounded-full",
  text: "rounded h-4 w-full",
  avatar: "rounded-full size-10",
  image: "rounded-lg size-24",
  card: "rounded-xl size-full min-h-[120px]",
  "table-row": "rounded h-10 w-full",
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "rectangular"
    | "rounded"
    | "circular"
    | "text"
    | "avatar"
    | "image"
    | "card"
    | "table-row";
  width?: string;
  height?: string;
  loading?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "rectangular",
      width,
      height,
      loading = true,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    if (!loading) return <>{children}</>;

    const variantStyle: React.CSSProperties = { ...style };
    if (width) variantStyle.width = width;
    if (height) variantStyle.height = height;

    return (
      <>
        <ShimmerStyle />
        <div
          ref={ref}
          data-uipkge=""
          data-slot="skeleton"
          aria-hidden="true"
          className={cn(
            "skeleton-shimmer",
            skeletonVariantClasses[variant ?? "rectangular"],
            className,
          )}
          style={variantStyle}
          {...props}
        />
      </>
    );
  },
);
Skeleton.displayName = "Skeleton";

/* ------------------------------------------------------------------ */
/* SkeletonGroup                                                       */
/* ------------------------------------------------------------------ */

export interface SkeletonGroupProps extends React.HTMLAttributes<HTMLElement> {
  tag?: keyof React.JSX.IntrinsicElements;
}

const SkeletonGroup = React.forwardRef<HTMLElement, SkeletonGroupProps>(
  ({ className, tag = "div", children, ...props }, ref) => {
    const Tag = tag as React.ElementType;
    return (
      <Tag
        ref={ref}
        data-uipkge=""
        data-slot="skeleton-group"
        className={cn("space-y-2", className)}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
SkeletonGroup.displayName = "SkeletonGroup";

/* ------------------------------------------------------------------ */
/* SkeletonText                                                        */
/* ------------------------------------------------------------------ */

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  lastLineWidth?: string;
  firstLineWidth?: string;
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    {
      className,
      lines = 3,
      lastLineWidth = "80%",
      firstLineWidth = "100%",
      ...props
    },
    ref,
  ) => {
    const lineWidths = Array.from({ length: lines }, (_, i) => {
      if (i === 0) return firstLineWidth;
      if (i === lines - 1) return lastLineWidth;
      return "100%";
    });

    return (
      <>
        <ShimmerStyle />
        <div
          ref={ref}
          data-uipkge=""
          data-slot="skeleton-text"
          aria-hidden="true"
          className={cn("space-y-2", className)}
          {...props}
        >
          {lineWidths.map((width, i) => (
            <div
              key={i}
              className="skeleton-shimmer h-4 rounded"
              style={{ width }}
            />
          ))}
        </div>
      </>
    );
  },
);
SkeletonText.displayName = "SkeletonText";

/* ------------------------------------------------------------------ */
/* SkeletonLoader                                                      */
/* ------------------------------------------------------------------ */

export interface SkeletonLoaderProps {
  className?: string;
  variant?:
    | "text"
    | "chip"
    | "chip-icon"
    | "article"
    | "avatar"
    | "avatar-small"
    | "avatar-large"
    | "heading"
    | "heading-medium"
    | "heading-small"
    | "image"
    | "image-small"
    | "image-large"
    | "card"
    | "card-avatar"
    | "actions"
    | "table"
    | "table-row"
    | "button"
    | "button-icon"
    | "badge"
    | "tab"
    | "date-picker"
    | "list-item"
    | "list-item-two-line"
    | "list-item-three-line";
  loading?: boolean;
  rows?: number;
  boilerplate?: boolean;
  children?: React.ReactNode;
}

function SkeletonLoader({
  className,
  variant = "text",
  loading = true,
  rows = 1,
  boilerplate = false,
  children,
}: SkeletonLoaderProps) {
  let body: React.ReactNode;

  if (rows === 1) {
    body = loading ? (
      <div className={cn(skeletonLoaderVariants({ variant }), className)} />
    ) : (
      children
    );
  } else if (!loading) {
    body = children;
  } else if (variant === "article") {
    body = (
      <>
        <div
          className={cn(skeletonLoaderVariants({ variant: "heading" }), "mb-4")}
        />
        <div
          className={cn(skeletonLoaderVariants({ variant: "text" }), "mb-2")}
        />
        <div
          className={cn(skeletonLoaderVariants({ variant: "text" }), "mb-2")}
        />
        <div
          className={cn(skeletonLoaderVariants({ variant: "text" }), "w-3/4")}
        />
      </>
    );
  } else if (variant === "card") {
    body = (
      <>
        <div
          className={cn(
            skeletonLoaderVariants({ variant: "image-large" }),
            "mb-4",
          )}
        />
        <div
          className={cn(
            skeletonLoaderVariants({ variant: "heading-small" }),
            "mb-2",
          )}
        />
        <div
          className={cn(skeletonLoaderVariants({ variant: "text" }), "mb-2")}
        />
        <div
          className={cn(skeletonLoaderVariants({ variant: "text" }), "w-1/2")}
        />
      </>
    );
  } else if (variant === "card-avatar") {
    body = (
      <div className="mb-4 flex items-center gap-4">
        <div
          className={cn(skeletonLoaderVariants({ variant: "avatar-large" }))}
        />
        <div className="flex-1 space-y-2">
          <div
            className={cn(skeletonLoaderVariants({ variant: "heading-small" }))}
          />
          <div
            className={cn(skeletonLoaderVariants({ variant: "text" }), "w-1/2")}
          />
        </div>
      </div>
    );
  } else if (variant === "actions") {
    body = (
      <div className="flex gap-2">
        <div className={cn(skeletonLoaderVariants({ variant: "button" }))} />
        <div className={cn(skeletonLoaderVariants({ variant: "button" }))} />
      </div>
    );
  } else if (variant === "table") {
    body = Array.from({ length: rows }, (_, i) => (
      <div
        key={i}
        className={cn(skeletonLoaderVariants({ variant: "table-row" }), "mb-2")}
      />
    ));
  } else if (variant === "list-item") {
    body = Array.from({ length: rows }, (_, i) => (
      <div key={i} className="mb-2 flex items-center gap-3">
        <div
          className={cn(skeletonLoaderVariants({ variant: "avatar-small" }))}
        />
        <div className="flex-1">
          <div className={cn(skeletonLoaderVariants({ variant: "text" }))} />
        </div>
      </div>
    ));
  } else if (variant === "list-item-two-line") {
    body = Array.from({ length: rows }, (_, i) => (
      <div key={i} className="mb-2 flex items-center gap-3">
        <div className={cn(skeletonLoaderVariants({ variant: "avatar" }))} />
        <div className="flex-1 space-y-2">
          <div className={cn(skeletonLoaderVariants({ variant: "text" }))} />
          <div
            className={cn(skeletonLoaderVariants({ variant: "text" }), "w-3/4")}
          />
        </div>
      </div>
    ));
  } else if (variant === "list-item-three-line") {
    body = Array.from({ length: rows }, (_, i) => (
      <div key={i} className="mb-2 flex items-start gap-3">
        <div className={cn(skeletonLoaderVariants({ variant: "avatar" }))} />
        <div className="flex-1 space-y-2">
          <div className={cn(skeletonLoaderVariants({ variant: "text" }))} />
          <div className={cn(skeletonLoaderVariants({ variant: "text" }))} />
          <div
            className={cn(skeletonLoaderVariants({ variant: "text" }), "w-2/3")}
          />
        </div>
      </div>
    ));
  } else {
    body = Array.from({ length: rows }, (_, i) => (
      <div
        key={i}
        className={cn(skeletonLoaderVariants({ variant }), "mb-2")}
      />
    ));
  }

  return (
    <div data-uipkge="" data-slot="skeleton-loader" className="space-y-2">
      {body}
      {boilerplate && !loading ? (
        <div className="bg-muted/50 absolute inset-0" />
      ) : null}
    </div>
  );
}
SkeletonLoader.displayName = "SkeletonLoader";

export { Skeleton, SkeletonGroup, SkeletonText, SkeletonLoader };
