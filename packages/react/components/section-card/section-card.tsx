import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface SectionCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  /** Rendered top-right of the header — the React equivalent of the
   *  `header-action` named slot. */
  headerAction?: React.ReactNode;
  /** Rendered after the content, outside CardContent — the React
   *  equivalent of the `footer` named slot. */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const SectionCard = React.forwardRef<HTMLDivElement, SectionCardProps>(
  (
    {
      title,
      description,
      className,
      contentClassName,
      headerAction,
      footer,
      children,
      ...rest
    },
    ref,
  ) => (
    <Card ref={ref} className={cn("flex flex-col", className)} {...rest}>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-0.5">
                {description}
              </CardDescription>
            )}
          </div>
          {headerAction}
        </div>
      </CardHeader>
      <CardContent className={cn("flex-1", contentClassName)}>
        {children}
      </CardContent>
      {footer}
    </Card>
  ),
);
SectionCard.displayName = "SectionCard";

export { SectionCard };
