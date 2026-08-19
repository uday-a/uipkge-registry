"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// SlopeChart
// ─────────────────────────────────────────────────────────────────────────

export interface SlopeChartProps {
  /** One line per entry. Two values = slope chart, more = bump chart. */
  data: { label: string; values: number[] }[];
  /** Point labels, e.g. ['2024', '2025'] or quarterly ranks. */
  points: string[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const SlopeChart = React.forwardRef<HTMLDivElement, SlopeChartProps>(
  ({ data, points, height = 320, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const series = data.map((d, i) => ({
        name: d.label,
        type: "line",
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 2, color: theme.colors[i % theme.colors.length] },
        itemStyle: { color: theme.colors[i % theme.colors.length] },
        label: {
          show: true,
          position: i % 2 ? "right" : "left",
          color: theme.textColor,
          fontSize: 10,
          formatter: "{a}",
        },
        endLabel: {
          show: true,
          color: theme.textColor,
          fontSize: 10,
          formatter: "{a}",
        },
        data: d.values,
      }));
      const userOption: any = option ?? {};
      const {
        series: userSeries,
        xAxis: userXAxis,
        yAxis: userYAxis,
        grid: userGrid,
        tooltip: userTooltip,
        legend: userLegend,
        ...userRest
      } = userOption;
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series;
      return {
        color: theme.colors,
        grid: mergeOptionBlock(
          { left: 16, right: 64, top: 24, bottom: 24, containLabel: false },
          userGrid,
        ),
        tooltip: mergeOptionBlock(
          {
            trigger: "axis",
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
          },
          userTooltip,
        ),
        legend:
          userLegend?.show === false
            ? undefined
            : mergeOptionBlock({ show: false }, userLegend),
        xAxis: mergeOptionBlock(
          {
            type: "category",
            boundaryGap: false,
            data: points,
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: {
              color: theme.textColor,
              fontSize: 11,
              fontWeight: 600,
            },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          { type: "value", show: false, splitLine: { show: false } },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, points, option, theme]);

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={className}
        ariaLabel={ariaLabel}
      >
        <EChart option={mergedOption} />
      </ChartFrame>
    );
  },
);
SlopeChart.displayName = "SlopeChart";
