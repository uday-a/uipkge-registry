import * as React from "react";
import { cn } from "@/lib/utils";

export interface KpiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

const KpiGrid = React.forwardRef<HTMLDivElement, KpiGridProps>(
  ({ columns = 4, className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="kpi-grid"
      className={cn(
        "grid gap-4 md:grid-cols-2",
        columns === 3
          ? "lg:grid-cols-3"
          : columns === 2
            ? "lg:grid-cols-2"
            : "lg:grid-cols-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
KpiGrid.displayName = "KpiGrid";

export { KpiGrid };
