"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { GanttTask } from "./types";

export interface GanttBarProps extends React.HTMLAttributes<HTMLDivElement> {
  task: GanttTask;
  left: number;
  width: number;
  top: number;
  height: number;
  onTaskClick?: (task: GanttTask) => void;
}

const statusColors: Record<string, string> = {
  done: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40",
  "in-progress": "bg-primary/20 text-primary border-primary/40",
  "at-risk":
    "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40",
  todo: "bg-muted/80 text-muted-foreground border-border",
  blocked: "bg-destructive/20 text-destructive border-destructive/40",
};

const progressColors: Record<string, string> = {
  done: "bg-emerald-500/40",
  "in-progress": "bg-primary/40",
  "at-risk": "bg-amber-500/40",
  todo: "bg-muted-foreground/20",
  blocked: "bg-destructive/40",
};

export const GanttBar = React.forwardRef<HTMLDivElement, GanttBarProps>(
  (
    { className, task, left, width, top, height, onTaskClick, ...props },
    ref,
  ) => {
    if (task.isGroup) {
      return (
        <div
          ref={ref}
          data-uipkge=""
          data-slot="gantt-group-bar"
          style={{
            left: `${left}px`,
            width: `${Math.max(24, width)}px`,
            top: `${top + 4}px`,
            height: `${height - 8}px`,
          }}
          className={cn(
            "group/bar bg-foreground/80 text-background hover:bg-foreground absolute z-10 flex cursor-pointer items-center justify-between rounded-xs px-2 text-xs font-semibold shadow-xs select-none",
            className,
          )}
          onClick={() => onTaskClick?.(task)}
          {...props}
        >
          <span className="truncate">{task.name}</span>
          {task.progress != null ? (
            <span className="font-mono text-xs opacity-80">
              {task.progress}%
            </span>
          ) : null}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="gantt-bar"
        style={{
          left: `${left}px`,
          width: `${Math.max(24, width)}px`,
          top: `${top}px`,
          height: `${height}px`,
        }}
        className={cn(
          "group/bar absolute z-10 flex cursor-pointer items-center overflow-hidden rounded-md border text-xs font-medium shadow-xs transition-[box-shadow,transform] select-none hover:scale-[1.01] hover:shadow-md",
          task.color ? task.color : statusColors[task.status ?? "in-progress"],
          className,
        )}
        onClick={() => onTaskClick?.(task)}
        {...props}
      >
        {task.progress != null && task.progress > 0 ? (
          <div
            style={{ width: `${task.progress}%` }}
            className={cn(
              "absolute inset-y-0 left-0 transition-[left]",
              progressColors[task.status ?? "in-progress"],
            )}
          />
        ) : null}

        <div className="relative z-10 flex w-full min-w-0 items-center justify-between px-2">
          <span className="truncate font-medium">{task.name}</span>
          {task.progress != null ? (
            <span className="ml-1 shrink-0 font-mono text-xs opacity-80">
              {task.progress}%
            </span>
          ) : null}
        </div>

        <div
          aria-hidden="true"
          className="bg-foreground/20 absolute inset-y-0 left-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
        />
        <div
          aria-hidden="true"
          className="bg-foreground/20 absolute inset-y-0 right-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
        />
      </div>
    );
  },
);

GanttBar.displayName = "GanttBar";
