"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChartFrame } from "../shared";

// WordCloudChart — dependency-free frequency-sized words
// ─────────────────────────────────────────────────────────────────────────

export interface WordDatum {
  name: string;
  value: number;
}

export interface WordCloudChartProps {
  data: WordDatum[];
  height?: number | string;
  /** Optional palette override. Defaults to chart-1..5 tokens. */
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

export const WordCloudChart = React.forwardRef<
  HTMLDivElement,
  WordCloudChartProps
>(
  (
    { data, height = 280, colors = DEFAULT_COLORS, className, ariaLabel },
    ref,
  ) => {
    const words = React.useMemo(() => {
      if (!data.length) return [];
      const vals = data.map((d) => d.value);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const span = Math.max(1, max - min);
      return [...data]
        .sort((a, b) => b.value - a.value)
        .map((d, i) => ({
          ...d,
          size: 14 + ((d.value - min) / span) * 30,
          color: colors[i % colors.length],
          weight:
            d.value === max ? 700 : d.value >= min + span * 0.66 ? 600 : 500,
          opacity: 0.55 + ((d.value - min) / span) * 0.45,
        }));
    }, [data, colors]);

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={cn("overflow-hidden", className)}
        ariaLabel={ariaLabel}
      >
        <div className="flex h-full w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 p-4">
          {words.map((w) => (
            <span
              key={w.name}
              title={`${w.name}: ${w.value}`}
              style={{
                fontSize: `${Math.round(w.size)}px`,
                color: w.color,
                fontWeight: w.weight,
                opacity: w.opacity,
                lineHeight: 1.15,
              }}
              className="cursor-default transition-transform duration-150 hover:scale-110"
            >
              {w.name}
            </span>
          ))}
        </div>
      </ChartFrame>
    );
  },
);
WordCloudChart.displayName = "WordCloudChart";
