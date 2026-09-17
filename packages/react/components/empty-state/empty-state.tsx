import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lucide icon component rendered above the title. */
  icon?: LucideIcon;
  title?: string;
  description?: string;
  role?: "status" | "alert";
  headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon: Icon,
      title,
      description,
      role = "status",
      headingTag: Heading = "h3",
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center py-12 text-center", className)}
      role={role}
      aria-live={role === "alert" ? "assertive" : "polite"}
      {...props}
    >
      {Icon ? (
        <Icon
          className="text-muted-foreground mx-auto mb-3 size-10"
          aria-hidden="true"
        />
      ) : null}
      {title ? (
        <Heading className="text-foreground font-medium">{title}</Heading>
      ) : null}
      {description ? (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
