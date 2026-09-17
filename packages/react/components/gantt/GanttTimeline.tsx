"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useGantt } from "./Gantt";
import { GanttBar } from "./GanttBar";
import { GanttMilestone } from "./GanttMilestone";
import type { GanttTask } from "./types";

export interface GanttTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  showTodayLine?: boolean;
  showDependencies?: boolean;
  onTaskClick?: (task: GanttTask) => void;
}

export const GanttTimeline = React.forwardRef<
  HTMLDivElement,
  GanttTimelineProps
>(
  (
    {
      className,
      showTodayLine = true,
      showDependencies = true,
      onTaskClick: propOnTaskClick,
      ...props
    },
    ref,
  ) => {
    const {
      startDate,
      totalDays,
      columnWidth,
      headerHeight,
      rowHeight,
      tasks,
      onTaskClick: ctxOnTaskClick,
    } = useGantt();
    const handleTaskClick = propOnTaskClick ?? ctxOnTaskClick;

    const columns = React.useMemo(() => {
      const list: {
        date: Date;
        label: string;
        subLabel: string;
        isWeekend: boolean;
      }[] = [];
      const start = new Date(startDate);

      for (let i = 0; i < totalDays; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dayOfWeek = d.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        list.push({
          date: d,
          label: d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          subLabel: d.toLocaleDateString(undefined, { weekday: "narrow" }),
          isWeekend,
        });
      }
      return list;
    }, [startDate, totalDays]);

    const timelineWidth = columns.length * columnWidth;

    const getTaskCoordinates = React.useCallback(
      (task: GanttTask, index: number) => {
        const start = new Date(startDate).getTime();
        const taskStart = new Date(task.startDate).getTime();
        const taskEnd = new Date(task.endDate).getTime();
        const oneDay = 1000 * 60 * 60 * 24;

        const startDiffDays = Math.max(0, (taskStart - start) / oneDay);
        const durationDays = Math.max(1, (taskEnd - taskStart) / oneDay);

        const left = startDiffDays * columnWidth;
        const width = durationDays * columnWidth;
        const top = index * rowHeight + (rowHeight - 28) / 2;

        return { left, width, top, height: 28 };
      },
      [startDate, columnWidth, rowHeight],
    );

    const todayPosition = React.useMemo(() => {
      const start = new Date(startDate).getTime();
      const today = new Date().setHours(0, 0, 0, 0);
      const oneDay = 1000 * 60 * 60 * 24;
      const diffDays = (today - start) / oneDay;

      if (diffDays < 0 || diffDays > totalDays) return null;
      return diffDays * columnWidth + columnWidth / 2;
    }, [startDate, totalDays, columnWidth]);

    const dependencyPaths = React.useMemo(() => {
      if (!showDependencies) return [];
      const taskMap = new Map<string, { task: GanttTask; index: number }>();
      tasks.forEach((t, i) => taskMap.set(t.id, { task: t, index: i }));

      const paths: { d: string; fromId: string; toId: string }[] = [];

      tasks.forEach((toTask, toIdx) => {
        if (!toTask.dependencies || toTask.dependencies.length === 0) return;
        toTask.dependencies.forEach((fromId) => {
          const fromEntry = taskMap.get(fromId);
          if (!fromEntry) return;

          const fromCoords = getTaskCoordinates(
            fromEntry.task,
            fromEntry.index,
          );
          const toCoords = getTaskCoordinates(toTask, toIdx);

          const startX = fromEntry.task.isMilestone
            ? fromCoords.left
            : fromCoords.left + fromCoords.width;
          const startY = fromCoords.top + 14;

          const endX = toCoords.left;
          const endY = toCoords.top + 14;

          const deltaX = Math.max(16, (endX - startX) / 2);
          const d = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;
          paths.push({ d, fromId, toId: toTask.id });
        });
      });

      return paths;
    }, [showDependencies, tasks, getTaskCoordinates]);

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="gantt-timeline"
        className={cn(
          "bg-background relative flex-1 overflow-x-auto overflow-y-hidden select-none",
          className,
        )}
        {...props}
      >
        <div style={{ width: `${timelineWidth}px` }} className="relative">
          <div
            style={{ height: `${headerHeight}px` }}
            className="border-border bg-muted/10 sticky top-0 z-20 flex border-b"
          >
            {columns.map((col, i) => (
              <div
                key={i}
                style={{ width: `${columnWidth}px` }}
                className={cn(
                  "border-border/50 text-muted-foreground flex flex-col items-center justify-center border-r text-xs",
                  col.isWeekend && "bg-muted/20 text-muted-foreground/60",
                )}
              >
                <span className="text-foreground font-medium">{col.label}</span>
                <span className="text-xs">{col.subLabel}</span>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-0 flex">
              {columns.map((col, i) => (
                <div
                  key={i}
                  style={{ width: `${columnWidth}px` }}
                  className={cn(
                    "border-border/30 h-full border-r",
                    col.isWeekend && "bg-muted/15",
                  )}
                />
              ))}
            </div>

            {showTodayLine && todayPosition != null ? (
              <div
                style={{ left: `${todayPosition}px` }}
                className="pointer-events-none absolute inset-y-0 z-30 flex flex-col items-center"
              >
                <div className="bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 text-xs font-bold shadow-xs">
                  Today
                </div>
                <div className="bg-destructive/60 h-full w-[1.5px] border-r border-dashed" />
              </div>
            ) : null}

            {dependencyPaths.length > 0 ? (
              <svg
                width={timelineWidth}
                height={tasks.length * rowHeight}
                className="pointer-events-none absolute inset-0 z-10"
              >
                <defs>
                  <marker
                    id="gantt-arrow-react"
                    viewBox="0 0 6 6"
                    refX="5"
                    refY="3"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 6 3 L 0 6 z" className="fill-primary/60" />
                  </marker>
                </defs>
                {dependencyPaths.map((p, i) => (
                  <path
                    key={i}
                    d={p.d}
                    fill="none"
                    className="stroke-primary/50"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    markerEnd="url(#gantt-arrow-react)"
                  />
                ))}
              </svg>
            ) : null}

            {tasks.map((task, idx) => {
              const coords = getTaskCoordinates(task, idx);
              return (
                <div
                  key={task.id}
                  style={{ height: `${rowHeight}px` }}
                  className="border-border/40 hover:bg-muted/10 relative border-b transition-colors"
                >
                  {task.isMilestone ? (
                    <GanttMilestone
                      task={task}
                      left={coords.left}
                      top={rowHeight / 2}
                      onTaskClick={handleTaskClick}
                    />
                  ) : (
                    <GanttBar
                      task={task}
                      left={coords.left}
                      width={coords.width}
                      top={(coords.height - 28) / 2 + 6}
                      height={28}
                      onTaskClick={handleTaskClick}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

GanttTimeline.displayName = "GanttTimeline";
