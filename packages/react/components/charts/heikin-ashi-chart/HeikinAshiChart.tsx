"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// HeikinAshiChart
// ─────────────────────────────────────────────────────────────────────────

export interface HACandle {
  date: string;
  open: number;
  close: number;
  low: number;
  high: number;
}

export interface HeikinAshiChartProps {
  data: HACandle[];
  height?: number | string;
  /** Show the bottom data-zoom slider. Default false. */
  zoom?: boolean;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const HeikinAshiChart = React.forwardRef<
  HTMLDivElement,
  HeikinAshiChartProps
>(({ data, height = 320, zoom = false, option, className, ariaLabel }, ref) => {
  const theme = useChartTheme();

  const mergedOption = React.useMemo(() => {
    // Heikin-Ashi: each candle averages the previous one, filtering market
    // noise so trends read as uninterrupted bull/bear runs.
    let prevOpen = data[0]?.open ?? 0;
    let prevClose = data[0]?.close ?? 0;
    const ha = data.map((c) => {
      const haClose = (c.open + c.high + c.low + c.close) / 4;
      const haOpen = (prevOpen + prevClose) / 2;
      const haHigh = Math.max(c.high, haOpen, haClose);
      const haLow = Math.min(c.low, haOpen, haClose);
      prevOpen = haOpen;
      prevClose = haClose;
      return {
        date: c.date,
        open: +haOpen.toFixed(2),
        close: +haClose.toFixed(2),
        low: +haLow.toFixed(2),
        high: +haHigh.toFixed(2),
      };
    });

    const series = [
      {
        type: "candlestick",
        data: ha.map((c) => [c.open, c.close, c.low, c.high]),
        itemStyle: {
          color: theme.colors[1],
          color0: theme.colors[3],
          borderColor: theme.colors[1],
          borderColor0: theme.colors[3],
        },
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
        {
          left: 16,
          right: 16,
          top: 24,
          bottom: zoom ? 60 : 24,
          containLabel: true,
        },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: "axis",
          axisPointer: { type: "cross" },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        {
          type: "category",
          data: ha.map((c) => c.date),
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: "value",
          scale: true,
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userYAxis,
      ),
      dataZoom: zoom
        ? [{ type: "slider", bottom: 8, height: 18 }, { type: "inside" }]
        : undefined,
      series: mergedSeries,
      ...userRest,
    };
  }, [data, zoom, option, theme]);

  return (
    <ChartFrame
      ref={ref}
      height={height}
      className={className}
      ariaLabel={ariaLabel || "Heikin-Ashi chart"}
    >
      <EChart option={mergedOption} />
    </ChartFrame>
  );
});
HeikinAshiChart.displayName = "HeikinAshiChart";
