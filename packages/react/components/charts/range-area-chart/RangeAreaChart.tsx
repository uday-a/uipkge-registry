"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock, toRgba } from "../useChartTheme";

// RangeAreaChart
// ─────────────────────────────────────────────────────────────────────────

export interface RangeAreaChartProps {
  data: Record<string, any>[];
  xField?: string;
  minField?: string;
  maxField?: string;
  avgField?: string;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const RangeAreaChart = React.forwardRef<
  HTMLDivElement,
  RangeAreaChartProps
>(
  (
    {
      data,
      xField = "x",
      minField = "min",
      maxField = "max",
      avgField = "avg",
      height = 320,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const band = theme.colors[0];
      const avg = theme.colors[3];
      const xData = data.map((d) => d[xField]);
      const series = [
        {
          name: "min",
          type: "line",
          stack: "band",
          silent: true,
          symbol: "none",
          lineStyle: { opacity: 0 },
          itemStyle: { opacity: 0 },
          data: data.map((d) => d[minField]),
        },
        {
          name: "range",
          type: "line",
          stack: "band",
          silent: true,
          symbol: "none",
          lineStyle: { opacity: 0 },
          areaStyle: { color: toRgba(band, 0.22) },
          data: data.map((d) => (d[maxField] ?? 0) - (d[minField] ?? 0)),
        },
        {
          name: avgField,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 2, color: avg },
          itemStyle: { color: avg },
          data: data.map((d) => d[avgField]),
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
            data: [avgField, "range"],
          },
          userLegend,
        ),
        xAxis: mergeOptionBlock(
          {
            type: "category",
            boundaryGap: false,
            data: xData,
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
    }, [data, xField, minField, maxField, avgField, option, theme]);

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
RangeAreaChart.displayName = "RangeAreaChart";
