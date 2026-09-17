"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// ParetoChart
// ─────────────────────────────────────────────────────────────────────────

export interface ParetoChartProps {
  /** Unsorted is fine — rows sort descending by value automatically. */
  data: { category: string; value: number }[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const ParetoChart = React.forwardRef<HTMLDivElement, ParetoChartProps>(
  ({ data, height = 320, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const rows = [...data].sort((a, b) => b.value - a.value);
      const total = rows.reduce((s, r) => s + r.value, 0) || 1;
      let acc = 0;
      const cum = rows.map((r) => {
        acc += r.value;
        return +((acc / total) * 100).toFixed(1);
      });
      const series = [
        {
          name: "value",
          type: "bar",
          yAxisIndex: 0,
          barMaxWidth: 30,
          itemStyle: { color: theme.colors[0], borderRadius: [6, 6, 6, 6] },
          data: rows.map((r) => r.value),
        },
        {
          name: "cumulative %",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          symbol: "circle",
          symbolSize: 7,
          lineStyle: { width: 2, color: theme.colors[3] },
          itemStyle: { color: theme.colors[3] },
          data: cum,
        },
      ];
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
          { left: 16, right: 16, top: 24, bottom: 32, containLabel: true },
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
        xAxis: mergeOptionBlock(
          {
            type: "category",
            data: rows.map((r) => r.category),
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11, rotate: 20 },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: Array.isArray(userYAxis)
          ? userYAxis
          : [
              mergeOptionBlock(
                {
                  type: "value",
                  splitLine: { lineStyle: { color: theme.splitLineColor } },
                  axisLabel: { color: theme.textColor, fontSize: 11 },
                },
                (userYAxis as any)?.[0],
              ),
              mergeOptionBlock(
                {
                  type: "value",
                  max: 100,
                  splitLine: { show: false },
                  axisLabel: {
                    color: theme.textColor,
                    fontSize: 11,
                    formatter: "{value}%",
                  },
                },
                (userYAxis as any)?.[1],
              ),
            ],
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
  },
);
ParetoChart.displayName = "ParetoChart";
