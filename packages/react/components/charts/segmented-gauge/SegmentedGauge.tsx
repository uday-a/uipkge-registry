"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function heightToStyle(height: number | string): string {
  return /^\d+$/.test(String(height)) ? `${height}px` : String(height);
}

// ─────────────────────────────────────────────────────────────────────────
// SegmentedGauge — pure SVG, no ECharts
// ─────────────────────────────────────────────────────────────────────────

interface GaugeSegment {
  /** Relative size of the segment. Segments are normalised by their sum. */
  value: number;
  /** Optional override; defaults to chart-1..N from the registry palette. */
  color?: string;
  /** Optional label, surfaced via the `children` for consumers that want to
   *  render their own legend. */
  label?: string;
}

export interface SegmentedGaugeProps {
  segments: GaugeSegment[];
  /** Container height (px when numeric, raw CSS when string). Default 200. */
  height?: number | string;
  /** Stroke width of the arc in SVG units. Default 18. */
  stroke?: number;
  /** Angular gap between segments, in degrees. Default 4. */
  gap?: number;
  /** Optional fallback palette when `color` is omitted on a segment. */
  colors?: string[];
  /** Show a faint background track behind the arc. Default true. */
  showTrack?: boolean;
  className?: string;
  /** Rendered into the dish centre (the Vue `center` slot). */
  children?: React.ReactNode;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

// SVG geometry. The viewBox uses the centre + radius + stroke so the
// canvas grows with the stroke width and the centre content can sit
// underneath without overlapping the arc.
const SG_CX = 140;
const SG_CY = 124;
const SG_R = 100;

function sgPolar(angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [SG_CX + SG_R * Math.cos(a), SG_CY + SG_R * Math.sin(a)] as const;
}

function sgArcPath(startA: number, endA: number) {
  const [sx, sy] = sgPolar(startA);
  const [ex, ey] = sgPolar(endA);
  const largeArc = endA - startA > 180 ? 1 : 0;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${SG_R} ${SG_R} 0 ${largeArc} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

export const SegmentedGauge = React.forwardRef<
  HTMLDivElement,
  SegmentedGaugeProps
>(
  (
    {
      segments,
      height = 200,
      stroke = 18,
      gap = 4,
      colors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
      ],
      showTrack = true,
      className,
      children,
      ariaLabel,
    },
    ref,
  ) => {
    const startAngle = 180;
    const sweep = 180;

    const arcs = React.useMemo(() => {
      const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
      let cursor = startAngle;
      return segments.map((s, i) => {
        const span = (s.value / total) * sweep;
        const isLast = i === segments.length - 1;
        const segEnd = cursor + span - (isLast ? 0 : gap);
        const arc = {
          d: sgArcPath(cursor, segEnd),
          color: s.color ?? colors[i % colors.length],
        };
        cursor = cursor + span;
        return arc;
      });
    }, [segments, gap, colors]);

    const trackPath = sgArcPath(startAngle, startAngle + sweep);

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="segmented-gauge"
        tabIndex={0}
        style={{ height: heightToStyle(height) }}
        className={cn(
          "focus-visible:ring-ring relative w-full focus-visible:ring-2 focus-visible:outline-none",
          className,
        )}
      >
        <svg
          viewBox={`0 0 ${SG_CX * 2} ${SG_CY + stroke}`}
          className="block h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={ariaLabel || "Chart"}
        >
          {showTrack && (
            <path
              d={trackPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              className="text-muted/40"
              opacity="0.35"
            />
          )}
          {arcs.map((a, i) => (
            <path
              key={i}
              d={a.d}
              fill="none"
              stroke={a.color}
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          ))}
        </svg>
        {children != null && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[8%] flex flex-col items-center">
            {children}
          </div>
        )}
      </div>
    );
  },
);
SegmentedGauge.displayName = "SegmentedGauge";
