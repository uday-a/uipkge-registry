"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// RangeBarChart
// ─────────────────────────────────────────────────────────────────────────

export interface RangeDatum {
  label: string;
  low: number;
  high: number;
}

export interface RangeBarChartProps {
  data: RangeDatum[];
  /** 'vertical' columns or 'horizontal' bars. Default 'vertical'. */
  orientation?: "vertical" | "horizontal";
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const RangeBarChart = React.forwardRef<
  HTMLDivElement,
  RangeBarChartProps
>(
  (
    {
      data,
      orientation = "vertical",
      height = 300,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();
    const horizontal = orientation === "horizontal";

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          name: "base",
          type: "bar",
          stack: "range",
          itemStyle: { borderColor: "transparent", color: "transparent" },
          emphasis: {
            itemStyle: { borderColor: "transparent", color: "transparent" },
          },
          data: data.map((d) => d.low),
        },
        {
          name: "range",
          type: "bar",
          stack: "range",
          barMaxWidth: 30,
          itemStyle: { color: theme.colors[0], borderRadius: 5 },
          label: {
            show: true,
            position: horizontal ? "right" : "top",
            color: theme.textColor,
            fontSize: 10,
            formatter: (p: any) => {
              const d = data[p.dataIndex];
              return d ? `${d.low}–${d.high}` : "";
            },
          },
          data: data.map((d) => d.high - d.low),
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
      const catAxis = {
        type: "category" as const,
        data: data.map((d) => d.label),
        axisLine: { lineStyle: { color: theme.axisColor } },
        axisLabel: { color: theme.textColor, fontSize: 11 },
        axisTick: { show: false },
      };
      const valAxis = {
        type: "value" as const,
        splitLine: { lineStyle: { color: theme.splitLineColor } },
        axisLabel: { color: theme.textColor, fontSize: 11 },
      };
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
            formatter: (ps: any[]) => {
              const d = data[ps[0]?.dataIndex];
              return d ? `${d.label}<br/>${d.low} – ${d.high}` : "";
            },
          },
          userTooltip,
        ),
        legend: { show: false },
        xAxis: mergeOptionBlock(horizontal ? valAxis : catAxis, userXAxis),
        yAxis: mergeOptionBlock(horizontal ? catAxis : valAxis, userYAxis),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, horizontal, option, theme]);

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={className}
        ariaLabel={ariaLabel || "Range bar chart"}
      >
        <EChart option={mergedOption} />
      </ChartFrame>
    );
  },
);
RangeBarChart.displayName = "RangeBarChart";
