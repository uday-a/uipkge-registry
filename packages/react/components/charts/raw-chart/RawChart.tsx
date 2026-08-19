"use client";

import * as React from "react";
import ReactECharts from "echarts-for-react/esm/core";
import { cn } from "@/lib/utils";
import { ChartFrame, echartsCoreModule, heightToStyle } from "../shared";

// RawChart
// ─────────────────────────────────────────────────────────────────────────

export interface RawChartProps {
  option: any;
  height?: number | string;
  /** Auto-resize on container width change. Default true. */
  autoresize?: boolean;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

/**
 * Raw escape hatch. The opinionated wrappers (AreaChart, BarChart,
 * FunnelChart, ...) cover the common cases with sensible defaults +
 * a `data` prop. When you need a chart type they don't wrap -- or a
 * level of customisation the wrappers can't expose without leaking
 * ECharts internals -- reach for this component and pass a complete
 * ECharts option object.
 *
 * Every chart type the registry wraps is already `use()`-registered by
 * importing this module, so you can pass any of them via `option`.
 * Theme tokens are available from `useChartTheme()` (and `toRgba`,
 * `mergeOptionBlock` from `./useChartTheme`) -- weave them into your
 * option for visual consistency with the rest of the registry's charts.
 */
export const RawChart = React.forwardRef<HTMLDivElement, RawChartProps>(
  ({ option, height = 300, autoresize = true, className, ariaLabel }, ref) => (
    <ChartFrame
      ref={ref}
      height={height}
      className={className}
      ariaLabel={ariaLabel}
    >
      <ReactECharts
        echarts={echartsCoreModule as any}
        option={option}
        notMerge
        lazyUpdate
        // ReactECharts resizes with its container by default; opt out by
        // disabling the resize observer when `autoresize` is false.
        opts={autoresize ? undefined : { width: "auto", height: "auto" }}
        style={{ width: "100%", height: "100%" }}
      />
    </ChartFrame>
  ),
);
RawChart.displayName = "RawChart";

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
        "#3b82f6",
        "#0ea5e9",
        "#34d399",
        "#facc15",
        "#fb7185",
        "#a855f7",
      ],
      showTrack = true,
      className,
      children,
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
          aria-label="Chart"
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
        "#3b82f6",
        "#a855f7",
        "#34d399",
        "#facc15",
        "#fb7185",
        "#06b6d4",
      ],
      className,
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
          aria-label="Chart"
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
