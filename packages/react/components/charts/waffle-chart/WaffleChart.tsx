"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChartFrame } from "../shared";

// WaffleChart — dependency-free SVG part-to-whole grid
// ─────────────────────────────────────────────────────────────────────────

export interface WaffleSlice {
  name: string;
  value: number;
  color?: string;
}

export interface WaffleChartProps {
  data: WaffleSlice[];
  height?: number | string;
  /** Cells per side (total = size²). Default 10. */
  size?: number;
  /** Cell corner radius. Default 2. */
  radius?: number;
  showLegend?: boolean;
  colors?: string[];
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const DEFAULT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export const WaffleChart = React.forwardRef<HTMLDivElement, WaffleChartProps>(
  (
    {
      data,
      height = 260,
      size = 10,
      radius = 2,
      showLegend = true,
      colors = DEFAULT_COLORS,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;

    const cells = React.useMemo(() => {
      const n = size * size;
      const counts = data.map((d) => Math.floor((d.value / total) * n));
      let rest = n - counts.reduce((s, c) => s + c, 0);
      const remainders = data
        .map((d, i) => ({ i, r: (d.value / total) * n - counts[i]! }))
        .sort((a, b) => b.r - a.r);
      for (const { i } of remainders) {
        if (rest <= 0) break;
        counts[i]!++;
        rest--;
      }
      const out: { color: string; name: string }[] = [];
      data.forEach((d, i) => {
        for (let k = 0; k < counts[i]!; k++)
          out.push({
            color: d.color ?? colors[i % colors.length]!,
            name: d.name,
          });
      });
      return out.reverse();
    }, [data, size, total, colors]);

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={cn("flex items-center justify-center gap-5", className)}
        ariaLabel={
          ariaLabel ||
          `Waffle chart: ${data.map((d) => `${d.name} ${Math.round((d.value / total) * 100)}%`).join(", ")}`
        }
      >
        <svg
          viewBox={`0 0 ${size * 12} ${size * 12}`}
          className="aspect-square h-full max-h-full"
          role="presentation"
        >
          {cells.map((c, i) => (
            <rect
              key={i}
              x={(i % size) * 12 + 1}
              y={Math.floor(i / size) * 12 + 1}
              width="10"
              height="10"
              rx={radius}
              fill={c.color}
            >
              <title>{c.name}</title>
            </rect>
          ))}
        </svg>
        {showLegend && (
          <ul className="space-y-1.5 text-xs">
            {data.map((d, i) => (
              <li key={d.name} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-[3px]"
                  style={{ background: d.color ?? colors[i % colors.length] }}
                />
                <span className="text-foreground font-medium">{d.name}</span>
                <span className="text-muted-foreground tabular-nums">
                  {Math.round((d.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </ChartFrame>
    );
  },
);
WaffleChart.displayName = "WaffleChart";
