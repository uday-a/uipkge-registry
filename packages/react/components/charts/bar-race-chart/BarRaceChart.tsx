"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// BarRaceChart
// ─────────────────────────────────────────────────────────────────────────

export interface RaceFrame {
  /** Frame caption, e.g. a year. */
  label: string;
  values: { category: string; value: number }[];
}

export interface BarRaceChartProps {
  frames: RaceFrame[];
  /** Rows shown per frame. Default 8. */
  topN?: number;
  /** Auto-advance. Default true. */
  autoPlay?: boolean;
  /** ms per frame. Default 1400. */
  interval?: number;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const BarRaceChart = React.forwardRef<HTMLDivElement, BarRaceChartProps>(
  (
    {
      frames,
      topN = 8,
      autoPlay = true,
      interval = 1400,
      height = 380,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();
    const [cursor, setCursor] = React.useState(0);

    React.useEffect(() => {
      if (!autoPlay || frames.length < 2) return;
      const timer = setInterval(
        () => setCursor((c) => (c + 1) % frames.length),
        interval,
      );
      return () => clearInterval(timer);
    }, [autoPlay, frames.length, interval]);

    const mergedOption = React.useMemo(() => {
      const frame = frames[Math.min(cursor, frames.length - 1)] ?? {
        label: "",
        values: [],
      };
      const rows = [...frame.values]
        .sort((a, b) => b.value - a.value)
        .slice(0, topN)
        .reverse();
      const max = Math.max(...rows.map((r) => r.value), 1);
      const series = [
        {
          type: "bar",
          barWidth: 16,
          realtimeSort: true,
          itemStyle: { color: theme.colors[0], borderRadius: [6, 6, 6, 6] },
          label: {
            show: true,
            position: "right",
            color: theme.textColor,
            fontSize: 11,
            fontWeight: 600,
          },
          data: rows.map((r) => r.value),
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
        animationDurationUpdate: 900,
        animationEasingUpdate: "quinticInOut",
        graphic: {
          elements: [
            {
              type: "text",
              right: 16,
              bottom: 8,
              style: {
                text: frame.label,
                fontSize: 44,
                fontWeight: 800,
                fill: theme.axisColor,
              },
            },
          ],
        },
        grid: mergeOptionBlock(
          { left: 16, right: 64, top: 16, bottom: 24, containLabel: true },
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
            type: "value",
            max: max * 1.25,
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "category",
            inverse: true,
            data: rows.map((r) => r.category),
            axisLine: { show: false },
            axisLabel: {
              color: theme.textColor,
              fontSize: 11,
              fontWeight: 600,
            },
            axisTick: { show: false },
            animationDuration: 300,
            animationDurationUpdate: 300,
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [frames, cursor, topN, option, theme]);

    const frame = frames[Math.min(cursor, frames.length - 1)] ?? { label: "" };
    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={className}
        ariaLabel={ariaLabel || `Bar race chart, frame ${frame.label}`}
      >
        <EChart option={mergedOption} />
      </ChartFrame>
    );
  },
);
BarRaceChart.displayName = "BarRaceChart";
