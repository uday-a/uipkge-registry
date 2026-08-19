"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonGroup } from "@/components/ui/button";
import { useGantt } from "./Gantt";

export interface GanttHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  showScaleSwitcher?: boolean;
  actions?: React.ReactNode;
}

export const GanttHeader = React.forwardRef<HTMLDivElement, GanttHeaderProps>(
  (
    {
      className,
      title = "Project Timeline",
      showScaleSwitcher = true,
      actions,
      children,
      ...props
    },
    ref,
  ) => {
    const { scale, setScale } = useGantt();

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="gantt-header"
        className={cn(
          "border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2.5",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <Calendar className="text-primary size-4" />
          <span className="text-foreground text-sm font-semibold">{title}</span>
        </div>

        <div className="flex items-center gap-3">
          {actions}
          {children}

          {showScaleSwitcher ? (
            <ButtonGroup>
              <Button
                size="xs"
                variant={scale === "day" ? "default" : "outline"}
                onClick={() => setScale("day")}
              >
                Day
              </Button>
              <Button
                size="xs"
                variant={scale === "week" ? "default" : "outline"}
                onClick={() => setScale("week")}
              >
                Week
              </Button>
              <Button
                size="xs"
                variant={scale === "month" ? "default" : "outline"}
                onClick={() => setScale("month")}
              >
                Month
              </Button>
              <Button
                size="xs"
                variant={scale === "year" ? "default" : "outline"}
                onClick={() => setScale("year")}
              >
                Year
              </Button>
            </ButtonGroup>
          ) : null}
        </div>
      </div>
    );
  },
);

GanttHeader.displayName = "GanttHeader";
