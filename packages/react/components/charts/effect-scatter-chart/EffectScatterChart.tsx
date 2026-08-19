"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// EffectScatterChart
// ─────────────────────────────────────────────────────────────────────────

export interface EffectScatterChartProps {
  data: Record<string, any>[];
  xField?: string;
  yField?: string;
  categoryField?: string;
  /** Ripple animation period in seconds. Default 4. */
  ripplePeriod?: number;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const EffectScatterChart = React.forwardRef<
  HTMLDivElement,
  EffectScatterChartProps
>(
  (
    {
      data,
      xField = "x",
      yField = "y",
      categoryField,
      ripplePeriod = 4,
      height = 300,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const categories = categoryField
        ? [...new Set(data.map((d) => d[categoryField]))]
        : ["default"];
      const series = categories.map((cat, i) => ({
        name: String(cat),
        type: "effectScatter",
        showEffectOn: "render",
        rippleEffect: { brushType: "stroke", period: ripplePeriod, scale: 3 },
        symbolSize: 12,
        itemStyle: {
          color: theme.colors[i % theme.colors.length],
          shadowBlur: 8,
          shadowColor: theme.colors[i % theme.colors.length],
        },
        data: (categoryField
          ? data.filter((d) => d[categoryField] === cat)
          : data
        ).map((d) => [d[xField], d[yField]]),
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
            bottom: categories.length > 1 ? 32 : 24,
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
          categories.length > 1
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
            scale: true,
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [data, xField, yField, categoryField, ripplePeriod, option, theme]);

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
EffectScatterChart.displayName = "EffectScatterChart";
