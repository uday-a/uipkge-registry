"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// HistogramChart
// ─────────────────────────────────────────────────────────────────────────

export interface HistogramChartProps {
  /** Pre-binned data. Pass raw numbers via `values` + `bins` instead. */
  data?: { bin: string; count: number }[];
  /** Raw values to bin automatically. Ignored when `data` is set. */
  values?: number[];
  /** Bin count for auto-binning. Default 12. */
  bins?: number;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const HistogramChart = React.forwardRef<
  HTMLDivElement,
  HistogramChartProps
>(
  (
    { data, values, bins = 12, height = 300, option, className, ariaLabel },
    ref,
  ) => {
    const theme = useChartTheme();

    const binned = React.useMemo(() => {
      if (data?.length) return data;
      const vals = values ?? [];
      if (!vals.length) return [];
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const span = max - min || 1;
      const n = Math.max(1, bins);
      const counts: number[] = Array(n).fill(0);
      for (const v of vals)
        counts[Math.min(n - 1, Math.floor(((v - min) / span) * n))]++;
      return counts.map((count, i) => ({
        bin: `${(min + (span * i) / n).toFixed(1)}–${(min + (span * (i + 1)) / n).toFixed(1)}`,
        count,
      }));
    }, [data, values, bins]);

    const mergedOption = React.useMemo(() => {
      const peak = binned.reduce(
        (m, d, i) => (d.count > (binned[m]?.count ?? -1) ? i : m),
        0,
      );
      const series = [
        {
          type: "bar",
          barCategoryGap: "2%",
          itemStyle: {
            color: (p: any) =>
              p.dataIndex === peak ? theme.colors[0] : theme.colors[2],
            borderRadius: [3, 3, 3, 3],
          },
          data: binned.map((d) => d.count),
        },
      ];
      const userOption: any = option ?? {};
      const {
        series: userSeries,
        xAxis: userXAxis,
        yAxis: userYAxis,
        grid: userGrid,
        tooltip: userTooltip,
        ...userRest
      } = userOption;
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series;
      return {
        color: theme.colors,
        grid: mergeOptionBlock(
          { left: 16, right: 16, top: 24, bottom: 24, containLabel: true },
          userGrid,
        ),
        tooltip: mergeOptionBlock(
          {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
          },
          userTooltip,
        ),
        legend: { show: false },
        xAxis: mergeOptionBlock(
          {
            type: "category",
            data: binned.map((d) => d.bin),
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 10, rotate: 30 },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "value",
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [binned, option, theme]);

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
HistogramChart.displayName = "HistogramChart";
