"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// ErrorBarChart
// ─────────────────────────────────────────────────────────────────────────

export interface ErrorDatum {
  category: string;
  value: number;
  low: number;
  high: number;
}

export interface ErrorBarChartProps {
  data: ErrorDatum[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const ErrorBarChart = React.forwardRef<
  HTMLDivElement,
  ErrorBarChartProps
>(({ data, height = 300, option, className, ariaLabel }, ref) => {
  const theme = useChartTheme();

  const mergedOption = React.useMemo(() => {
    const series = [
      {
        name: "value",
        type: "bar",
        barMaxWidth: 30,
        itemStyle: { color: theme.colors[0], borderRadius: [6, 6, 6, 6] },
        data: data.map((d) => d.value),
      },
      {
        name: "interval",
        type: "custom",
        silent: true,
        renderItem: (params: any, api: any) => {
          const i: number = params.dataIndex;
          const d = data[i]!;
          const cx = api.coord([i, 0])[0];
          const yLow = api.coord([i, d.low])[1];
          const yHigh = api.coord([i, d.high])[1];
          const cap = 7;
          return {
            type: "group",
            children: [
              {
                type: "line",
                shape: { x1: cx, y1: yLow, x2: cx, y2: yHigh },
                style: { stroke: theme.textColor, lineWidth: 1.5 },
              },
              {
                type: "line",
                shape: { x1: cx - cap, y1: yLow, x2: cx + cap, y2: yLow },
                style: { stroke: theme.textColor, lineWidth: 1.5 },
              },
              {
                type: "line",
                shape: { x1: cx - cap, y1: yHigh, x2: cx + cap, y2: yHigh },
                style: { stroke: theme.textColor, lineWidth: 1.5 },
              },
            ],
          };
        },
        data: data.map((d) => [d.low, d.high]),
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
          formatter: (ps: any[]) => {
            const d = data[ps[0]?.dataIndex];
            return d
              ? `${d.category}<br/>${d.value} (CI ${d.low}–${d.high})`
              : "";
          },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: "category",
          data: data.map((d) => d.category),
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
      ariaLabel={ariaLabel || "Error bar chart"}
    >
      <EChart option={mergedOption} />
    </ChartFrame>
  );
});
ErrorBarChart.displayName = "ErrorBarChart";
