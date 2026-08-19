"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// PolarBarChart
// ─────────────────────────────────────────────────────────────────────────

export interface PolarBarChartProps {
  data: { category: string; value: number }[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const PolarBarChart = React.forwardRef<
  HTMLDivElement,
  PolarBarChartProps
>(({ data, height = 320, option, className, ariaLabel }, ref) => {
  const theme = useChartTheme();

  const mergedOption = React.useMemo(() => {
    const series = [
      {
        type: "bar",
        coordinateSystem: "polar",
        data: data.map((d) => d.value),
        colorBy: "data",
        roundCap: true,
        itemStyle: { borderRadius: 6 },
      },
    ];
    const userOption: any = option ?? {};
    const {
      series: userSeries,
      polar: userPolar,
      angleAxis: userAngle,
      radiusAxis: userRadius,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption;
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series;

    return {
      color: theme.colors,
      polar: mergeOptionBlock({ radius: ["18%", "78%"] }, userPolar),
      angleAxis: mergeOptionBlock(
        {
          type: "value",
          startAngle: 90,
          axisLabel: { color: theme.textColor, fontSize: 10 },
        },
        userAngle,
      ),
      radiusAxis: mergeOptionBlock(
        {
          type: "category",
          data: data.map((d) => d.category),
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userRadius,
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
      legend:
        userLegend?.show === false
          ? undefined
          : mergeOptionBlock({ show: false }, userLegend),
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
});
PolarBarChart.displayName = "PolarBarChart";
