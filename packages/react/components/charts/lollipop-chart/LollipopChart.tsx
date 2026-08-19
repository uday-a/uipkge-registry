"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// LollipopChart
// ─────────────────────────────────────────────────────────────────────────

export interface LollipopChartProps {
  data: { category: string; value: number }[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const LollipopChart = React.forwardRef<
  HTMLDivElement,
  LollipopChartProps
>(({ data, height = 300, option, className, ariaLabel }, ref) => {
  const theme = useChartTheme();

  const mergedOption = React.useMemo(() => {
    const cats = data.map((d) => d.category);
    const vals = data.map((d) => d.value);
    const series = [
      {
        name: "stem",
        type: "bar",
        barWidth: 3,
        silent: true,
        itemStyle: { color: theme.axisColor },
        data: vals,
      },
      {
        name: "value",
        type: "scatter",
        symbolSize: 14,
        itemStyle: { color: theme.colors[0] },
        label: {
          show: true,
          position: "top",
          color: theme.textColor,
          fontSize: 11,
        },
        data: vals.map((v, i) => [cats[i], v]),
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
        { left: 16, right: 16, top: 32, bottom: 24, containLabel: true },
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
          data: cats,
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
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
  }, [data, option, theme]);

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
});
LollipopChart.displayName = "LollipopChart";
