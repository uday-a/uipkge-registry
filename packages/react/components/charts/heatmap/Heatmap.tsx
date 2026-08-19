"use client";

import * as React from "react";
import ReactECharts from "echarts-for-react/esm/core";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme } from "../useChartTheme";

// Heatmap
// ─────────────────────────────────────────────────────────────────────────

export interface HeatmapProps {
  data: [number, number, number][]; // [xIndex, yIndex, value]
  xLabels: string[];
  yLabels: string[];
  height?: number | string;
  min?: number;
  max?: number;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      data,
      xLabels,
      yLabels,
      height = 300,
      min,
      max,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const values = data.map((d) => d[2]);
      const computedMin = min ?? Math.min(...values);
      const computedMax = max ?? Math.max(...values);

      return {
        grid: { left: 16, right: 16, top: 16, bottom: 16, containLabel: true },
        tooltip: {
          position: "top",
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (params: any) =>
            `${yLabels[params.value[1]]} / ${xLabels[params.value[0]]}: ${params.value[2]}`,
        },
        xAxis: {
          type: "category",
          data: xLabels,
          splitArea: { show: true },
          axisLabel: { fontSize: 11 },
          axisTick: { show: false },
        },
        yAxis: {
          type: "category",
          data: yLabels,
          splitArea: { show: true },
          axisLabel: { fontSize: 11 },
          axisTick: { show: false },
        },
        visualMap: {
          min: computedMin,
          max: computedMax,
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: 0,
          itemWidth: 12,
          itemHeight: 80,
          inRange: {
            color: [theme.colors[0]!, theme.colors[1]!, theme.colors[2]!],
          },
          textStyle: { fontSize: 10 },
        },
        series: (() => {
          const series = [
            {
              type: "heatmap",
              data,
              label: { show: false },
              itemStyle: { borderRadius: 2, borderWidth: 0 },
              emphasis: {
                itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.2)" },
              },
            },
          ];
          const userSeries = (option as any)?.series;
          return Array.isArray(userSeries)
            ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
            : series;
        })(),
        // visualMap / tooltip / axes overrides still spread on top -- strip
        // `series` so it doesn't clobber the merged result above.
        ...(() => {
          const { series: _, ...rest } = (option as any) ?? {};
          return rest;
        })(),
      };
    }, [data, xLabels, yLabels, min, max, option, theme]);

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
Heatmap.displayName = "Heatmap";
