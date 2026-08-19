"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock, toRgba } from "../useChartTheme";

// StackedAreaChart
// ─────────────────────────────────────────────────────────────────────────

export interface StackedAreaChartProps {
  data: Record<string, any>[];
  xField?: string;
  yFields: string[];
  /** Render as 100% shares instead of absolute values. Default false. */
  percent?: boolean;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const StackedAreaChart = React.forwardRef<
  HTMLDivElement,
  StackedAreaChartProps
>(
  (
    {
      data,
      xField = "x",
      yFields,
      percent = false,
      height = 320,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const totals = data.map(
        (d) => yFields.reduce((s, f) => s + (d[f] ?? 0), 0) || 1,
      );
      const series = yFields.map((f, i) => {
        const c = theme.colors[i % theme.colors.length];
        return {
          name: f,
          type: "line",
          stack: "area",
          smooth: true,
          symbol: "none",
          lineStyle: { width: 1.5, color: c },
          areaStyle: { color: toRgba(c, 0.45) },
          emphasis: { focus: "series" },
          data: data.map((d, r) =>
            percent ? ((d[f] ?? 0) / totals[r]!) * 100 : d[f],
          ),
        };
      });
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
            valueFormatter: (v: any) => (percent ? `${(+v).toFixed(1)}%` : v),
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
            boundaryGap: false,
            data: data.map((d) => d[xField]),
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          percent
            ? {
                type: "value",
                max: 100,
                splitLine: { lineStyle: { color: theme.splitLineColor } },
                axisLabel: {
                  color: theme.textColor,
                  fontSize: 11,
                  formatter: "{value}%",
                },
              }
            : {
                type: "value",
                splitLine: { lineStyle: { color: theme.splitLineColor } },
                axisLabel: { color: theme.textColor, fontSize: 11 },
              },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, xField, yFields, percent, option, theme]);

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
StackedAreaChart.displayName = "StackedAreaChart";
