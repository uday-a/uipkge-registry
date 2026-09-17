"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// WaterfallChart
// ─────────────────────────────────────────────────────────────────────────

export interface WaterfallDatum {
  label: string;
  /** Signed delta. Positive builds up, negative draws down. */
  value: number;
}

export interface WaterfallChartProps {
  data: WaterfallDatum[];
  /** Append a computed Total bar. Default true. */
  showTotal?: boolean;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const WaterfallChart = React.forwardRef<
  HTMLDivElement,
  WaterfallChartProps
>(
  (
    { data, showTotal = true, height = 320, option, className, ariaLabel },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const labels: string[] = [];
      const base: number[] = [];
      const uplift: number[] = [];
      const styles: Record<number, string> = {};
      const up = theme.colors[1];
      const down = theme.colors[3];
      const totalColor = theme.colors[0];

      let cursor = 0;
      data.forEach((d, i) => {
        labels.push(d.label);
        if (d.value >= 0) {
          base.push(cursor);
          uplift.push(d.value);
          styles[i] = up;
        } else {
          base.push(cursor + d.value);
          uplift.push(-d.value);
          styles[i] = down;
        }
        cursor += d.value;
      });
      if (showTotal) {
        labels.push("Total");
        base.push(0);
        uplift.push(cursor);
        styles[labels.length - 1] = totalColor;
      }

      const series = [
        {
          name: "base",
          type: "bar",
          stack: "waterfall",
          itemStyle: { borderColor: "transparent", color: "transparent" },
          emphasis: {
            itemStyle: { borderColor: "transparent", color: "transparent" },
          },
          data: base,
        },
        {
          name: "value",
          type: "bar",
          stack: "waterfall",
          barMaxWidth: 36,
          label: {
            show: true,
            position: "top",
            color: theme.textColor,
            fontSize: 11,
          },
          itemStyle: {
            color: (p: any) => styles[p.dataIndex] ?? totalColor,
            borderRadius: [6, 6, 6, 6],
          },
          data: uplift,
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
          },
          userTooltip,
        ),
        legend: { show: false },
        xAxis: mergeOptionBlock(
          {
            type: "category",
            data: labels,
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
    }, [data, showTotal, option, theme]);

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
WaterfallChart.displayName = "WaterfallChart";
