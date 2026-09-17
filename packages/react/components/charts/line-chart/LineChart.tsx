"use client";

import * as React from "react";
import ReactECharts from "echarts-for-react/esm/core";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// LineChart
// ─────────────────────────────────────────────────────────────────────────

export interface LineChartProps {
  data: Record<string, any>[];
  xField?: string;
  yField?: string | string[];
  /** Line interpolation. Default 'smooth'. */
  curve?: "smooth" | "linear" | "step" | "stepStart" | "stepEnd";
  /** Stack series cumulatively. Default false. */
  stacked?: boolean;
  /** Show point markers. Default true. */
  markers?: boolean;
  /** Dashed stroke on all series (forecast look). Default false. */
  dashed?: boolean;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      xField = "x",
      yField = "y",
      curve = "smooth",
      stacked = false,
      markers = true,
      dashed = false,
      height = 300,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const fields = Array.isArray(yField) ? yField : [yField];
      const xData = data.map((d) => d[xField]);

      const series = fields.map((field, i) => ({
        name: field,
        type: "line",
        smooth: curve === "smooth",
        step:
          curve === "step"
            ? "middle"
            : curve === "stepStart"
              ? "start"
              : curve === "stepEnd"
                ? "end"
                : false,
        stack: stacked ? "lines" : undefined,
        symbol: markers ? "circle" : "none",
        symbolSize: 6,
        lineStyle: { width: 2, type: dashed ? "dashed" : "solid" },
        itemStyle: { color: theme.colors[i % theme.colors.length] },
        data: data.map((d) => d[field]),
      }));

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

      const baseLegend =
        fields.length > 1
          ? {
              bottom: 0,
              icon: "circle",
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: theme.textColor },
            }
          : undefined;

      return {
        color: theme.colors,
        grid: mergeOptionBlock(
          {
            left: 16,
            right: 16,
            top: 24,
            bottom: fields.length > 1 ? 32 : 24,
            containLabel: true,
          },
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
        legend:
          userLegend?.show === false
            ? undefined
            : mergeOptionBlock(baseLegend ?? {}, userLegend),
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
        yAxis: mergeOptionBlock(
          {
            type: "value",
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisLine: { show: false },
            axisTick: { show: false },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, xField, yField, curve, stacked, markers, dashed, option, theme]);

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
LineChart.displayName = "LineChart";
