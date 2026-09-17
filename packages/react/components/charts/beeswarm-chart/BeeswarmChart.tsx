"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// BeeswarmChart
// ─────────────────────────────────────────────────────────────────────────

function jitter(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 0.72;
}

export interface BeeswarmChartProps {
  data: Record<string, any>[];
  valueField?: string;
  groupField?: string;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const BeeswarmChart = React.forwardRef<
  HTMLDivElement,
  BeeswarmChartProps
>(
  (
    {
      data,
      valueField = "value",
      groupField = "group",
      height = 300,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const groups = [...new Set(data.map((d) => String(d[groupField])))];
      const series = groups.map((g, gi) => ({
        name: g,
        type: "scatter",
        symbolSize: 9,
        itemStyle: {
          color: theme.colors[gi % theme.colors.length],
          opacity: 0.8,
        },
        data: data
          .map((d, i) => ({ d, i }))
          .filter(({ d }) => String(d[groupField]) === g)
          .map(({ d, i }) => [d[valueField], gi + jitter(i, gi)]),
      }));
      const userOption: any = option ?? {};
      const {
        series: userSeries,
        xAxis: userXAxis,
        yAxis: userYAxis,
        grid: userGrid,
        tooltip: userTooltip,
        legend: userLegend,
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
            bottom: groups.length > 1 ? 32 : 24,
            containLabel: true,
          },
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
        legend:
          groups.length > 1
            ? mergeOptionBlock(
                {
                  bottom: 0,
                  icon: "circle",
                  itemWidth: 8,
                  itemHeight: 8,
                  textStyle: { fontSize: 11, color: theme.textColor },
                },
                userLegend,
              )
            : undefined,
        xAxis: mergeOptionBlock(
          {
            type: "value",
            scale: true,
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisLine: { lineStyle: { color: theme.axisColor } },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "value",
            min: -0.6,
            max: groups.length - 0.4,
            interval: 1,
            axisLabel: {
              color: theme.textColor,
              fontSize: 11,
              formatter: (v: number) => groups[Math.round(v)] ?? "",
            },
            splitLine: { show: false },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, valueField, groupField, option, theme]);

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
BeeswarmChart.displayName = "BeeswarmChart";
