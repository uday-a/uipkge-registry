"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// PictorialBarChart
// ─────────────────────────────────────────────────────────────────────────

export interface PictorialBarChartProps {
  data: { category: string; value: number }[];
  /** ECharts symbol for the repeated pictogram. Default 'rect'. */
  symbol?: string;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const PictorialBarChart = React.forwardRef<
  HTMLDivElement,
  PictorialBarChartProps
>(
  (
    { data, symbol = "rect", height = 300, option, className, ariaLabel },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const max = Math.max(...data.map((d) => d.value), 1);
      const series = [
        {
          type: "pictorialBar",
          symbol,
          symbolRepeat: true,
          symbolSize: [12, 8],
          symbolMargin: 2,
          symbolClip: true,
          itemStyle: { color: theme.colors[0] },
          data: data.map((d) => ({ value: d.value, symbolBoundingData: max })),
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
        xAxis: mergeOptionBlock(
          {
            type: "category",
            data: data.map((d) => d.category),
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "value",
            max,
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, symbol, option, theme]);

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
PictorialBarChart.displayName = "PictorialBarChart";
