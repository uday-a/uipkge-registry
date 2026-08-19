"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// QuadrantChart
// ─────────────────────────────────────────────────────────────────────────

function median(vals: number[]) {
  const s = [...vals].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : ((s[m - 1] ?? 0) + (s[m] ?? 0)) / 2;
}

export interface QuadrantChartProps {
  data: { x: number; y: number; label?: string }[];
  /** Split lines. Default to the data medians. */
  xMid?: number;
  yMid?: number;
  /** Clockwise from top-right: [stars, question marks, dogs, cash cows]. */
  quadrantLabels?: [string, string, string, string];
  xName?: string;
  yName?: string;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const QuadrantChart = React.forwardRef<
  HTMLDivElement,
  QuadrantChartProps
>(
  (
    {
      data,
      xMid,
      yMid,
      quadrantLabels = ["Stars", "Question marks", "Dogs", "Cash cows"],
      xName,
      yName,
      height = 340,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const x = xMid ?? median(data.map((d) => d.x));
      const y = yMid ?? median(data.map((d) => d.y));
      const quad = (
        name: string,
        x0: number | string,
        x1: number | string,
        y0: number | string,
        y1: number | string,
      ) => [
        {
          xAxis: x0,
          yAxis: y0,
          itemStyle: { color: theme.colors[0], opacity: 0.05 },
          label: {
            show: true,
            position: "inside",
            color: theme.textColor,
            fontSize: 12,
            fontWeight: 700,
            formatter: name,
          },
        },
        { xAxis: x1, yAxis: y1 },
      ];
      const series = [
        {
          type: "scatter",
          symbolSize: 12,
          itemStyle: { color: theme.colors[0], opacity: 0.85 },
          label: {
            show: true,
            position: "top",
            color: theme.textColor,
            fontSize: 10,
            formatter: (p: any) => p.value[2] ?? "",
          },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { type: "dashed", color: theme.textColor, opacity: 0.6 },
            label: { show: false },
            data: [{ xAxis: x }, { yAxis: y }],
          },
          markArea: {
            silent: true,
            data: [
              quad(quadrantLabels[0], x, "max", y, "max"),
              quad(quadrantLabels[1], "min", x, y, "max"),
              quad(quadrantLabels[2], "min", x, "min", y),
              quad(quadrantLabels[3], x, "max", "min", y),
            ],
          },
          data: data.map((d) => [d.x, d.y, d.label ?? ""]),
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
      const xs = data.map((d) => d.x);
      const ys = data.map((d) => d.y);
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
        legend: { show: false },
        xAxis: mergeOptionBlock(
          {
            type: "value",
            name: xName,
            min: Math.min(...xs) - 1,
            max: Math.max(...xs) + 1,
            nameTextStyle: { color: theme.textColor, fontSize: 10 },
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "value",
            name: yName,
            min: Math.min(...ys) - 1,
            max: Math.max(...ys) + 1,
            nameTextStyle: { color: theme.textColor, fontSize: 10 },
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, xMid, yMid, quadrantLabels, xName, yName, option, theme]);

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
QuadrantChart.displayName = "QuadrantChart";
