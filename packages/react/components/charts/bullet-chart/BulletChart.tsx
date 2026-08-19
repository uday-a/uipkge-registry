"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// BulletChart
// ─────────────────────────────────────────────────────────────────────────

export interface BulletDatum {
  label: string;
  /** Measured value (foreground bar). */
  actual: number;
  /** Target marker position. */
  target: number;
  /** [poor, satisfactory, good] upper bounds for the background bands. */
  ranges: [number, number, number];
}

export interface BulletChartProps {
  data: BulletDatum[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const BulletChart = React.forwardRef<HTMLDivElement, BulletChartProps>(
  ({ data, height = 300, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const labels = data.map((d) => d.label);
      const series = [
        {
          name: "poor",
          type: "bar",
          stack: "ranges",
          silent: true,
          barWidth: 18,
          itemStyle: { color: theme.splitLineColor },
          data: data.map((d) => d.ranges[0]),
        },
        {
          name: "ok",
          type: "bar",
          stack: "ranges",
          silent: true,
          itemStyle: { color: theme.axisColor, opacity: 0.85 },
          data: data.map((d) => d.ranges[1] - d.ranges[0]),
        },
        {
          name: "good",
          type: "bar",
          stack: "ranges",
          silent: true,
          itemStyle: { color: theme.colors[4], opacity: 0.35 },
          data: data.map((d) => d.ranges[2] - d.ranges[1]),
        },
        {
          name: "actual",
          type: "bar",
          barWidth: 7,
          barGap: "-90%",
          z: 3,
          itemStyle: { color: theme.colors[0], borderRadius: 3 },
          label: {
            show: true,
            position: "right",
            color: theme.textColor,
            fontSize: 11,
          },
          data: data.map((d) => d.actual),
        },
        {
          name: "target",
          type: "scatter",
          z: 4,
          symbol: "rect",
          symbolSize: [3, 24],
          itemStyle: { color: theme.textColor },
          data: data.map((d, i) => [d.target, i]),
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
          { left: 16, right: 48, top: 16, bottom: 24, containLabel: true },
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
            type: "value",
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "category",
            inverse: true,
            data: labels,
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisTick: { show: false },
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
  },
);
BulletChart.displayName = "BulletChart";
