"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { GanttScale, GanttTask } from "./types";

export interface GanttContextValue {
  scale: GanttScale;
  setScale: (scale: GanttScale) => void;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  columnWidth: number;
  rowHeight: number;
  headerHeight: number;
  treeWidth: number;
  tasks: GanttTask[];
  onTaskClick?: (task: GanttTask) => void;
  onTaskChange?: (task: GanttTask) => void;
}

export const GanttContext = React.createContext<GanttContextValue | null>(null);

export function useGantt() {
  const context = React.useContext(GanttContext);
  if (!context) {
    throw new Error("useGantt must be used within a <Gantt /> component");
  }
  return context;
}

export interface GanttProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: GanttTask[];
  scale?: GanttScale;
  onScaleChange?: (scale: GanttScale) => void;
  startDate?: string;
  endDate?: string;
  rowHeight?: number;
  headerHeight?: number;
  treeWidth?: number;
  onTaskClick?: (task: GanttTask) => void;
  onTaskChange?: (task: GanttTask) => void;
}

export const Gantt = React.forwardRef<HTMLDivElement, GanttProps>(
  (
    {
      className,
      tasks,
      scale: controlledScale,
      onScaleChange,
      startDate,
      endDate,
      rowHeight = 40,
      headerHeight = 48,
      treeWidth = 280,
      onTaskClick,
      onTaskChange,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalScale, setInternalScale] = React.useState<GanttScale>(
      controlledScale ?? "day",
    );
    const currentScale = controlledScale ?? internalScale;

    const handleSetScale = React.useCallback(
      (newScale: GanttScale) => {
        setInternalScale(newScale);
        onScaleChange?.(newScale);
      },
      [onScaleChange],
    );

    const resolvedStartDate = React.useMemo(() => {
      if (startDate) return new Date(startDate);
      if (tasks.length === 0) return new Date();
      const dates = tasks.map((t) => new Date(t.startDate).getTime());
      const min = Math.min(...dates);
      const d = new Date(min);
      d.setDate(d.getDate() - 3);
      return d;
    }, [startDate, tasks]);

    const resolvedEndDate = React.useMemo(() => {
      if (endDate) return new Date(endDate);
      if (tasks.length === 0) {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d;
      }
      const dates = tasks.map((t) => new Date(t.endDate).getTime());
      const max = Math.max(...dates);
      const d = new Date(max);
      d.setDate(d.getDate() + 7);
      return d;
    }, [endDate, tasks]);

    const totalDays = React.useMemo(() => {
      const diff = resolvedEndDate.getTime() - resolvedStartDate.getTime();
      return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }, [resolvedStartDate, resolvedEndDate]);

    const columnWidth = React.useMemo(() => {
      switch (currentScale) {
        case "day":
          return 44;
        case "week":
          return 120;
        case "month":
          return 180;
        case "year":
          return 240;
        default:
          return 44;
      }
    }, [currentScale]);

    const contextValue = React.useMemo<GanttContextValue>(
      () => ({
        scale: currentScale,
        setScale: handleSetScale,
        startDate: resolvedStartDate,
        endDate: resolvedEndDate,
        totalDays,
        columnWidth,
        rowHeight,
        headerHeight,
        treeWidth,
        tasks,
        onTaskClick,
        onTaskChange,
      }),
      [
        currentScale,
        handleSetScale,
        resolvedStartDate,
        resolvedEndDate,
        totalDays,
        columnWidth,
        rowHeight,
        headerHeight,
        treeWidth,
        tasks,
        onTaskClick,
        onTaskChange,
      ],
    );

    return (
      <GanttContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-uipkge=""
          data-slot="gantt"
          className={cn(
            "border-border bg-card text-card-foreground relative flex w-full flex-col overflow-hidden rounded-xl border shadow-xs",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </GanttContext.Provider>
    );
  },
);

Gantt.displayName = "Gantt";
