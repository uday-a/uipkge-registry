import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabeledValueProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: string;
}

const LabeledValue = React.forwardRef<HTMLDivElement, LabeledValueProps>(
  ({ label, value, className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="labeled-value"
      className={cn(
        "flex items-center justify-between gap-3 text-sm",
        className,
      )}
      {...props}
    >
      <span
        data-slot="labeled-value-label"
        className="text-muted-foreground shrink-0"
      >
        {label}
      </span>
      {children ?? (
        <span
          data-slot="labeled-value-value"
          className="min-w-0 text-right font-medium"
        >
          {value}
        </span>
      )}
    </div>
  ),
);
LabeledValue.displayName = "LabeledValue";

export { LabeledValue };
