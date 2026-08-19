"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// DonutChart
// ─────────────────────────────────────────────────────────────────────────

export interface DonutChartProps {
  data: { name: string; value: number }[];
  /** 'full' ring or 'half' semicircle gauge. Default 'full'. */
  type?: "full" | "half";
  /** Ring thickness as a fraction of the outer radius (0 = filled pie). Default 0.32. */
  thickness?: number;
  /** Segment corner rounding in px. Default 6. */
  rounded?: number;
  /** Gap between segments in degrees. Default 2. */
  gap?: number;
  /** Show the summed total in the centre. Default true. */
  showTotal?: boolean;
  /** Centre label override (replaces the auto total). */
  centerLabel?: string;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data,
      type = "full",
      thickness = 0.32,
      rounded = 6,
      gap = 2,
      showTotal = true,
      centerLabel,
      height = 300,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const total = React.useMemo(
      () => data.reduce((s, d) => s + d.value, 0),
      [data],
    );
    const summary = centerLabel ?? String(total);

    const mergedOption = React.useMemo(() => {
      const half = type === "half";
      const outer = half ? 82 : 78;
      const inner = Math.max(
        0,
        +(outer * (1 - Math.max(0, Math.min(0.95, thickness)))).toFixed(1),
      );
      const series = [
        {
          type: "pie",
          radius: [`${inner}%`, `${outer}%`],
          center: half ? ["50%", "68%"] : ["50%", "46%"],
          startAngle: half ? 180 : 90,
          endAngle: half ? 360 : undefined,
          padAngle: gap,
          itemStyle: {
            borderRadius: rounded,
            borderColor: theme.tooltipBg,
            borderWidth: 2,
          },
          label: { show: !half, color: theme.textColor, fontSize: 11 },
          labelLine: { show: !half, lineStyle: { color: theme.textColor } },
          emphasis: { scale: true, scaleSize: 3 },
          data,
        },
      ];
      const userOption: any = option ?? {};
      const {
        series: userSeries,
        tooltip: userTooltip,
        legend: userLegend,
        title: userTitle,
        ...userRest
      } = userOption;
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series;
      return {
        color: theme.colors,
        title: showTotal
          ? mergeOptionBlock(
              {
                text: summary,
                left: "center",
                top: half ? "62%" : "42%",
                textStyle: {
                  fontSize: 26,
                  fontWeight: 700,
                  color: theme.textColor,
                },
              },
              userTitle,
            )
          : undefined,
        tooltip: mergeOptionBlock(
          {
            trigger: "item",
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
            valueFormatter: (v: any) =>
              `${v} (${((v / (total || 1)) * 100).toFixed(1)}%)`,
          },
          userTooltip,
        ),
        legend: mergeOptionBlock(
          {
            bottom: 0,
            icon: "circle",
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          },
          userLegend,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [
      data,
      type,
      thickness,
      rounded,
      gap,
      showTotal,
      summary,
      total,
      option,
      theme,
    ]);

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={className}
        ariaLabel={ariaLabel || `Donut chart, total ${total}`}
      >
        <EChart option={mergedOption} />
      </ChartFrame>
    );
  },
);
DonutChart.displayName = "DonutChart";
