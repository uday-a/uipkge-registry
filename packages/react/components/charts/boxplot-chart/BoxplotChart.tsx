"use client";

import * as React from "react";
import ReactECharts from "echarts-for-react/esm/core";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// BoxplotChart
// ─────────────────────────────────────────────────────────────────────────

interface BoxRow {
  category: string;
  /** [min, Q1, median, Q3, max] */
  values: [number, number, number, number, number];
}

export interface BoxplotChartProps {
  data: BoxRow[];
  /** Render horizontally (categories on y-axis). Default false. */
  horizontal?: boolean;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const BoxplotChart = React.forwardRef<HTMLDivElement, BoxplotChartProps>(
  (
    { data, horizontal = false, height = 320, option, className, ariaLabel },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const cats = data.map((d) => d.category);
      const values = data.map((d) => d.values);

      const valueAxis = {
        type: "value" as const,
        scale: true,
        splitLine: { lineStyle: { color: theme.splitLineColor } },
        axisLabel: { color: theme.textColor, fontSize: 11 },
        axisLine: { lineStyle: { color: theme.axisColor } },
        axisTick: { show: false },
      };
      const catAxis = {
        type: "category" as const,
        data: cats,
        axisLine: { lineStyle: { color: theme.axisColor } },
        axisLabel: { color: theme.textColor, fontSize: 11 },
        axisTick: { show: false },
      };

      const series = [
        {
          type: "boxplot",
          data: values,
          itemStyle: { color: theme.colors[0], borderColor: theme.colors[1] },
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
            trigger: "item",
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
          },
          userTooltip,
        ),
        xAxis: mergeOptionBlock(horizontal ? valueAxis : catAxis, userXAxis),
        yAxis: mergeOptionBlock(horizontal ? catAxis : valueAxis, userYAxis),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, horizontal, option, theme]);

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={className}
        focusable={false}
        ariaLabel={ariaLabel}
      >
        <EChart option={mergedOption} />
      </ChartFrame>
    );
  },
);
BoxplotChart.displayName = "BoxplotChart";
