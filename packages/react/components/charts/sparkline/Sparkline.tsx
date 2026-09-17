"use client";

import * as React from "react";
import ReactECharts from "echarts-for-react/esm/core";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, toRgba } from "../useChartTheme";

// Sparkline
// ─────────────────────────────────────────────────────────────────────────

export interface SparklineProps {
  data: number[];
  color?: string;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(
  (
    { data, color: colorProp, height = 40, option, className, ariaLabel },
    ref,
  ) => {
    const theme = useChartTheme();
    const color = colorProp ?? theme.colors[1];

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          type: "line",
          smooth: true,
          // Show a dot only at the last datapoint so the eye can find the
          // current value; intermediate dots clutter at sparkline density.
          showSymbol: false,
          showAllSymbol: false,
          symbol: "circle",
          symbolSize: 5,
          endLabel: { show: false },
          lineStyle: { width: 1.75, color },
          itemStyle: { color, borderColor: color, borderWidth: 0 },
          data: data.map((v, i) => ({
            value: v,
            symbol: i === data.length - 1 ? "circle" : "none",
            symbolSize: i === data.length - 1 ? 5 : 0,
          })),
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: toRgba(color!, 0.18) },
                { offset: 1, color: toRgba(color!, 0) },
              ],
            },
          },
        },
      ];

      const userOption: any = option ?? {};
      const { series: userSeries, ...userRest } = userOption;
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series;

      return {
        grid: { left: 0, right: 0, top: 2, bottom: 2 },
        xAxis: { type: "category", show: false, data: data.map((_, i) => i) },
        yAxis: {
          type: "value",
          show: false,
          min: (value: any) => value.min * 0.9,
        },
        tooltip: { show: false },
        series: mergedSeries,
        ...userRest,
      };
    }, [data, color, option]);

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
Sparkline.displayName = "Sparkline";
