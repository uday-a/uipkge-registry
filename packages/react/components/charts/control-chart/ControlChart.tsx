"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// ControlChart
// ─────────────────────────────────────────────────────────────────────────

export interface ControlChartProps {
  data: Record<string, any>[];
  xField?: string;
  yField?: string;
  /** Override computed centre line. Defaults to the data mean. */
  mean?: number;
  /** Override computed limits. Default mean ± 2σ. */
  ucl?: number;
  lcl?: number;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const ControlChart = React.forwardRef<HTMLDivElement, ControlChartProps>(
  (
    {
      data,
      xField = "x",
      yField = "value",
      mean: meanProp,
      ucl: uclProp,
      lcl: lclProp,
      height = 300,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const vals = data.map((d) => +d[yField] || 0);
      const mean =
        meanProp ?? vals.reduce((s, v) => s + v, 0) / Math.max(1, vals.length);
      const sd =
        Math.sqrt(
          vals.reduce((s, v) => s + (v - mean) ** 2, 0) /
            Math.max(1, vals.length),
        ) || 1;
      const ucl = uclProp ?? mean + 2 * sd;
      const lcl = lclProp ?? mean - 2 * sd;
      const line = theme.colors[0];
      const bad = theme.dangerColor;
      const series = [
        {
          type: "line",
          symbol: "circle",
          symbolSize: 7,
          lineStyle: { width: 2, color: line },
          itemStyle: {
            color: (p: any) => (p.value > ucl || p.value < lcl ? bad : line),
            borderColor: theme.tooltipBg,
            borderWidth: 1.5,
          },
          markLine: {
            silent: true,
            symbol: "none",
            label: { color: theme.textColor, fontSize: 10, formatter: "{b}" },
            lineStyle: { type: "dashed", width: 1 },
            data: [
              { name: "UCL", yAxis: ucl, lineStyle: { color: bad } },
              {
                name: "Mean",
                yAxis: mean,
                lineStyle: { color: theme.textColor },
              },
              { name: "LCL", yAxis: lcl, lineStyle: { color: bad } },
            ],
          },
          data: data.map((d) => d[yField]),
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
            data: data.map((d) => d[xField]),
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 10 },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "value",
            scale: true,
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, xField, yField, meanProp, uclProp, lclProp, option, theme]);

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
ControlChart.displayName = "ControlChart";
