"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// PopulationPyramidChart
// ─────────────────────────────────────────────────────────────────────────

export interface PopulationPyramidChartProps {
  /** One row per age band. */
  data: { band: string; left: number; right: number }[];
  /** Series names for [left, right]. Default ['Male', 'Female']. */
  names?: [string, string];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const PopulationPyramidChart = React.forwardRef<
  HTMLDivElement,
  PopulationPyramidChartProps
>(
  (
    {
      data,
      names = ["Male", "Female"],
      height = 340,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          name: names[0],
          type: "bar",
          stack: "pop",
          barWidth: 14,
          itemStyle: { color: theme.colors[2], borderRadius: [4, 4, 4, 4] },
          label: {
            show: true,
            position: "left",
            color: theme.textColor,
            fontSize: 10,
            formatter: (p: any) => Math.abs(p.value),
          },
          data: data.map((d) => -Math.abs(d.left)),
        },
        {
          name: names[1],
          type: "bar",
          stack: "pop",
          barWidth: 14,
          itemStyle: { color: theme.colors[0], borderRadius: [4, 4, 4, 4] },
          label: {
            show: true,
            position: "right",
            color: theme.textColor,
            fontSize: 10,
          },
          data: data.map((d) => Math.abs(d.right)),
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
            axisPointer: { type: "shadow" },
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
            valueFormatter: (v: any) => Math.abs(v),
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
            type: "value",
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: {
              color: theme.textColor,
              fontSize: 11,
              formatter: (v: number) => Math.abs(v),
            },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "category",
            inverse: true,
            data: data.map((d) => d.band),
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisTick: { show: false },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, names, option, theme]);

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
PopulationPyramidChart.displayName = "PopulationPyramidChart";
