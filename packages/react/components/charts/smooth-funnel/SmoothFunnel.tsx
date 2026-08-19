"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function heightToStyle(height: number | string): string {
  return /^\d+$/.test(String(height)) ? `${height}px` : String(height);
}

// ─────────────────────────────────────────────────────────────────────────
// SmoothFunnel — pure SVG, no ECharts
// ─────────────────────────────────────────────────────────────────────────

interface FunnelStage {
  name: string;
  value: number;
  /** Optional override; defaults to chart-1..N from the registry palette. */
  color?: string;
}

export interface SmoothFunnelProps {
  data: FunnelStage[];
  /** Container height (px when numeric, raw CSS when string). Defaults to 240. */
  height?: number | string;
  /** Show the percent pill on each stage. Defaults to true. */
  showLabels?: boolean;
  /** Minimum segment height in px so tail stages stay visible at tiny percents. Default 18. */
  minHeight?: number;
  /** Optional fallback palette when `color` is omitted on a stage. */
  colors?: string[];
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

// SVG geometry. Width/height are virtual (the SVG fits to container
// via viewBox). The aspect ratio (W:H ≈ 4:1) matches the horizontal
// "flow" layout consumers typically want for a 4-6 stage funnel; if
// you need taller bands, override `height` and the curves stretch
// vertically without distorting horizontally.
const SF_W = 720;
const SF_H = 180;
const SF_CY = SF_H / 2;

export const SmoothFunnel = React.forwardRef<HTMLDivElement, SmoothFunnelProps>(
  (
    {
      data,
      height = 240,
      showLabels = true,
      minHeight = 18,
      colors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
      ],
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const segments = React.useMemo(() => {
      const stages = data;
      const n = stages.length;
      if (n === 0) return [];
      const segW = SF_W / n;
      const max = Math.max(...stages.map((s) => s.value));
      const pctOf = (v: number) => (max > 0 ? (v / max) * 100 : 0);
      const heightFor = (pct: number) =>
        Math.max((pct / 100) * SF_H, minHeight);

      return stages.map((s, i) => {
        const next = stages[i + 1] ?? s;
        const startPct = pctOf(s.value);
        const endPct = pctOf(next.value);
        const h0 = heightFor(startPct);
        const h1 = heightFor(endPct);
        const x0 = i * segW;
        const x1 = x0 + segW;
        const yTop0 = SF_CY - h0 / 2;
        const yTop1 = SF_CY - h1 / 2;
        const yBot0 = SF_CY + h0 / 2;
        const yBot1 = SF_CY + h1 / 2;

        // Cubic bezier control points at 38% / 62% of segment width produce
        // a soft S-curve transition between stages rather than the
        // trapezoidal default of an ECharts funnel.
        const cx1 = x0 + segW * 0.38;
        const cx2 = x0 + segW * 0.62;

        const d = [
          `M ${x0.toFixed(1)} ${yTop0.toFixed(1)}`,
          `C ${cx1.toFixed(1)} ${yTop0.toFixed(1)}, ${cx2.toFixed(1)} ${yTop1.toFixed(1)}, ${x1.toFixed(1)} ${yTop1.toFixed(1)}`,
          `L ${x1.toFixed(1)} ${yBot1.toFixed(1)}`,
          `C ${cx2.toFixed(1)} ${yBot1.toFixed(1)}, ${cx1.toFixed(1)} ${yBot0.toFixed(1)}, ${x0.toFixed(1)} ${yBot0.toFixed(1)}`,
          "Z",
        ].join(" ");

        return {
          d,
          color: s.color ?? colors[i % colors.length],
          percent: startPct,
          name: s.name,
          value: s.value,
          labelX: x0 + segW * 0.42,
          labelY: SF_CY,
        };
      });
    }, [data, minHeight, colors]);

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="smooth-funnel"
        tabIndex={0}
        style={{ height: heightToStyle(height) }}
        className={cn(
          "focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none",
          className,
        )}
      >
        <svg
          viewBox={`0 0 ${SF_W} ${SF_H}`}
          className="block h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label={ariaLabel || "Chart"}
        >
          {segments.map((seg, i) => (
            <g key={i}>
              <path d={seg.d} fill={seg.color} />
              {showLabels && (
                <foreignObject
                  x={seg.labelX - 28}
                  y={seg.labelY - 12}
                  width={56}
                  height={24}
                >
                  <div className="bg-background text-foreground inline-flex h-6 items-center rounded-full border px-2 text-xs font-semibold shadow-sm">
                    {Math.round(seg.percent * 10) / 10}%
                  </div>
                </foreignObject>
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  },
);
SmoothFunnel.displayName = "SmoothFunnel";
