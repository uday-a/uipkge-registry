"use client";

import * as React from "react";
import ReactECharts from "echarts-for-react/esm/core";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme } from "../useChartTheme";

// RadarChart
// ─────────────────────────────────────────────────────────────────────────

export interface RadarChartProps {
  indicators: { name: string; max: number }[];
  data: { name: string; value: number[] }[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const RadarChart = React.forwardRef<HTMLDivElement, RadarChartProps>(
  ({ indicators, data, height = 300, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          type: "radar",
          data: data.map((d, i) => ({
            ...d,
            itemStyle: { color: theme.colors[i % theme.colors.length] },
            areaStyle: { opacity: 0.15 },
            lineStyle: { width: 2 },
          })),
        },
      ];

      const userOption: any = option ?? {};
      const { series: userSeries, ...userRest } = userOption;
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series;

      return {
        color: theme.colors,
        tooltip: {
          trigger: "item",
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        legend: {
          bottom: 0,
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11 },
        },
        radar: {
          indicator: indicators,
          radius: "60%",
          center: ["50%", "45%"],
          axisName: { fontSize: 11 },
          splitArea: {
            areaStyle: {
              color: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.02)"],
            },
          },
        },
        series: mergedSeries,
        ...userRest,
      };
    }, [indicators, data, option, theme]);

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
RadarChart.displayName = "RadarChart";
