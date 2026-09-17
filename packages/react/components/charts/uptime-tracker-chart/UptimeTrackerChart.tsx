"use client";

import * as React from "react";
import { ChartFrame } from "../shared";

// UptimeTrackerChart — dependency-free status bars
// ─────────────────────────────────────────────────────────────────────────

export type DayStatus = "up" | "degraded" | "down" | "unknown";

export interface StatusDay {
  date: string;
  status: DayStatus;
}

export interface UptimeTrackerChartProps {
  days: StatusDay[];
  height?: number | string;
  /** Gap between bars in px. Default 2. */
  gap?: number;
  /** Bar corner radius in px. Default 2. */
  rounded?: number;
  /** Show the legend row with the computed uptime %. Default true. */
  showLegend?: boolean;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const COLORS: Record<DayStatus, string> = {
  up: "var(--chart-2)",
  degraded: "var(--chart-4)",
  down: "var(--destructive)",
  unknown: "var(--border)",
};

export const UptimeTrackerChart = React.forwardRef<
  HTMLDivElement,
  UptimeTrackerChartProps
>(
  (
    {
      days,
      height = 48,
      gap = 2,
      rounded = 2,
      showLegend = true,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const uptime = days.length
      ? `${((days.filter((d) => d.status === "up").length / days.length) * 100).toFixed(1)}%`
      : "—";
    const summary = `${days.filter((d) => d.status === "up").length} up, ${days.filter((d) => d.status === "degraded").length} degraded, ${days.filter((d) => d.status === "down").length} down days`;

    return (
      <ChartFrame
        ref={ref}
        height="auto"
        focusable
        className={className}
        ariaLabel={ariaLabel || `Uptime tracker: ${summary}`}
      >
        <div
          className="flex min-h-6 w-full items-stretch"
          style={{
            height: typeof height === "number" ? `${height}px` : height,
            gap: `${gap}px`,
          }}
        >
          {days.map((d, i) => (
            <div
              key={`${d.date}-${i}`}
              className="min-w-0 flex-1"
              style={{
                background: COLORS[d.status],
                borderRadius: `${rounded}px`,
              }}
              title={`${d.date} — ${d.status}`}
            />
          ))}
        </div>
        {showLegend && (
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="text-foreground font-semibold tabular-nums">
              {uptime} uptime
            </span>
            <span className="text-muted-foreground">{days.length} days</span>
            <span className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span
                  className="size-2 rounded-[2px]"
                  style={{ background: COLORS.up }}
                />
                Up
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="size-2 rounded-[2px]"
                  style={{ background: COLORS.degraded }}
                />
                Degraded
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="size-2 rounded-[2px]"
                  style={{ background: COLORS.down }}
                />
                Down
              </span>
            </span>
          </div>
        )}
      </ChartFrame>
    );
  },
);
UptimeTrackerChart.displayName = "UptimeTrackerChart";
