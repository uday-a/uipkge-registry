"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// ComboChart
// ─────────────────────────────────────────────────────────────────────────

export interface ComboChartProps {
  data: Record<string, any>[];
  xField?: string;
  /** Bar series field(s) — left axis. */
  barField?: string | string[];
  /** Line series field(s) — right axis. */
  lineField?: string | string[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const ComboChart = React.forwardRef<HTMLDivElement, ComboChartProps>(
  (
    {
      data,
      xField = "x",
      barField = "bar",
      lineField = "line",
      height = 320,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const bars = Array.isArray(barField) ? barField : [barField];
      const lines = Array.isArray(lineField) ? lineField : [lineField];
      const xData = data.map((d) => d[xField]);

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

      const series = [
        ...bars.map((f, i) => {
          const u = Array.isArray(userSeries) ? userSeries[i] : undefined;
          const isStacked = Boolean(u?.stack);
          return {
            name: f,
            type: "bar",
            yAxisIndex: 0,
            barMaxWidth: 28,
            itemStyle: {
              color: theme.colors[i % theme.colors.length],
              borderRadius: [6, 6, 6, 6],
              ...(isStacked
                ? {
                    borderColor: theme.bgColor,
                    borderWidth: 1,
                  }
                : {}),
            },
            data: data.map((d) => d[f]),
          };
        }),
        ...lines.map((f, j) => ({
          name: f,
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          symbol: "circle",
          symbolSize: 7,
          lineStyle: {
            width: 2,
            color: theme.colors[(bars.length + j) % theme.colors.length],
          },
          itemStyle: {
            color: theme.colors[(bars.length + j) % theme.colors.length],
          },
          data: data.map((d) => d[f]),
        })),
      ];

      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({
            ...s,
            ...(userSeries[i] ?? {}),
            itemStyle: {
              ...s.itemStyle,
              ...(userSeries[i]?.itemStyle ?? {}),
            },
          }))
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
            data: xData,
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
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
                  splitLine: { show: false },
                  axisLabel: { color: theme.textColor, fontSize: 11 },
                },
                (userYAxis as any)?.[1],
              ),
            ],
        series: mergedSeries,
        ...userRest,
      };
    }, [data, xField, barField, lineField, option, theme]);

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
ComboChart.displayName = "ComboChart";
