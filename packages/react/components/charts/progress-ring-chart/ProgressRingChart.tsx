"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChartFrame } from "../shared";

// ProgressRingChart — dependency-free SVG gauge
// ─────────────────────────────────────────────────────────────────────────

export interface ProgressRing {
  /** 0..100. */
  value: number;
  /** Defaults to chart-1..N tokens. */
  color?: string;
  label?: string;
}

export interface ProgressRingChartProps {
  rings: ProgressRing[];
  height?: number | string;
  /** Ring thickness in SVG units. Default 14. */
  stroke?: number;
  /** Show the centre label (first ring value or custom). Default true. */
  showLabel?: boolean;
  /** Centre label override. */
  centerLabel?: string;
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
const C = 2 * Math.PI * 80;

export const ProgressRingChart = React.forwardRef<
  HTMLDivElement,
  ProgressRingChartProps
>(
  (
    {
      rings,
      height = 220,
      stroke = 14,
      showLabel = true,
      centerLabel,
      colors = DEFAULT_COLORS,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const arcs = rings.map((r, i) => {
      const pct = Math.max(0, Math.min(100, r.value)) / 100;
      return {
        dash: `${(pct * C).toFixed(1)} ${C.toFixed(1)}`,
        color: r.color ?? colors[i % colors.length],
        r: 80 - i * (stroke + 6),
        value: r.value,
      };
    });
    const view = 200 + (rings.length - 1) * (stroke + 6) * 2;
    const center = view / 2;
    const summary =
      centerLabel ??
      (rings.length === 1
        ? `${Math.round(rings[0]?.value ?? 0)}%`
        : `${rings.length} rings`);

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={cn("flex items-center justify-center", className)}
        ariaLabel={
          ariaLabel ||
          `Progress ring chart: ${rings.map((r) => `${r.label ?? "value"} ${Math.round(r.value)}%`).join(", ")}`
        }
      >
        <svg
          viewBox={`0 0 ${view} ${view}`}
          className="aspect-square h-full max-h-full"
          role="presentation"
        >
          <g transform={`rotate(-90 ${center} ${center})`}>
            {arcs.map((a, i) => (
              <circle
                key={`t${i}`}
                cx={center}
                cy={center}
                r={a.r}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                className="text-border"
                opacity="0.35"
              />
            ))}
            {arcs.map((a, i) => (
              <circle
                key={`v${i}`}
                cx={center}
                cy={center}
                r={a.r}
                fill="none"
                stroke={a.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={a.dash}
              />
            ))}
          </g>
          {showLabel && (
            <text
              x={center}
              y={center}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground"
              fontSize="26"
              fontWeight="700"
            >
              {summary}
            </text>
          )}
        </svg>
      </ChartFrame>
    );
  },
);
ProgressRingChart.displayName = "ProgressRingChart";
