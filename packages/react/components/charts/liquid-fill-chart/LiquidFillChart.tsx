"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChartFrame } from "../shared";

// LiquidFillChart — dependency-free SVG gauge
// ─────────────────────────────────────────────────────────────────────────

export interface LiquidFillChartProps {
  /** Fill 0..100. */
  value: number;
  height?: number | string;
  /** Wave colour. Defaults to chart-1 token. */
  color?: string;
  /** Show the % label in the centre. Default true. */
  showLabel?: boolean;
  unit?: string;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const LiquidFillChart = React.forwardRef<
  HTMLDivElement,
  LiquidFillChartProps
>(
  (
    {
      value,
      height = 220,
      color = "var(--chart-1)",
      showLabel = true,
      unit = "%",
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const pct = Math.max(0, Math.min(100, value));
    const level = 100 - pct * 0.72;
    const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={cn("flex items-center justify-center", className)}
        ariaLabel={
          ariaLabel || `Liquid fill chart at ${Math.round(pct)}${unit}`
        }
      >
        <svg
          viewBox="0 0 200 200"
          className="aspect-square h-full max-h-full"
          role="presentation"
        >
          <defs>
            <clipPath id={uid}>
              <circle cx="100" cy="100" r="84" />
            </clipPath>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-border"
          />
          <g clipPath={`url(#${uid})`}>
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              className="fill-muted/40"
            />
            <path
              d={`M 0 ${level} Q 25 ${level - 10}, 50 ${level} T 100 ${level} T 150 ${level} T 200 ${level} V 200 H 0 Z`}
              fill={color}
              opacity="0.55"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="-100 0"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d={`M 0 ${level + 6} Q 25 ${level - 4}, 50 ${level + 6} T 100 ${level + 6} T 150 ${level + 6} T 200 ${level + 6} V 200 H 0 Z`}
              fill={color}
              opacity="0.85"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="-100 0"
                to="0 0"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </g>
          {showLabel && (
            <text
              x="100"
              y="104"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground"
              fontSize="30"
              fontWeight="700"
            >
              {Math.round(pct)}
              {unit}
            </text>
          )}
        </svg>
      </ChartFrame>
    );
  },
);
LiquidFillChart.displayName = "LiquidFillChart";
