"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { GanttTask } from "./types";

export interface GanttMilestoneProps extends React.HTMLAttributes<HTMLDivElement> {
  task: GanttTask;
  left: number;
  top: number;
  size?: number;
  onTaskClick?: (task: GanttTask) => void;
}

export const GanttMilestone = React.forwardRef<
  HTMLDivElement,
  GanttMilestoneProps
>(({ className, task, left, top, size = 16, onTaskClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="gantt-milestone"
      style={{
        left: `${left - size / 2}px`,
        top: `${top - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      title={`${task.name} (${task.startDate})`}
      className={cn(
        "border-primary bg-primary absolute z-20 rotate-45 cursor-pointer rounded-xs border-2 shadow-sm transition-transform hover:scale-125",
        className,
      )}
      onClick={() => onTaskClick?.(task)}
      {...props}
    />
  );
});

GanttMilestone.displayName = "GanttMilestone";
