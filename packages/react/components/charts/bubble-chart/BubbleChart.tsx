"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// BubbleChart
// ─────────────────────────────────────────────────────────────────────────

export interface BubbleChartProps {
  data: Record<string, any>[];
  xField?: string;
  yField?: string;
  sizeField?: string;
  categoryField?: string;
  /** Bubble opacity. Default 0.75. */
  opacity?: number;
  /** Smallest bubble diameter in px. Default 8. */
  minSize?: number;
  /** Largest bubble diameter in px. Default 42. */
  maxSize?: number;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const BubbleChart = React.forwardRef<HTMLDivElement, BubbleChartProps>(
  (
    {
      data,
      xField = "x",
      yField = "y",
      sizeField = "size",
      categoryField,
      opacity = 0.75,
      minSize = 8,
      maxSize = 42,
      height = 320,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const cats = categoryField
        ? [...new Set(data.map((d) => String(d[categoryField])))]
        : ["default"];
      const maxSizeVal = Math.max(...data.map((d) => +d[sizeField] || 0), 1);
      const scale = (v: number) =>
        minSize + Math.sqrt(v / maxSizeVal) * (maxSize - minSize);
      const series = cats.map((cat, i) => ({
        name: String(cat),
        type: "scatter",
        symbolSize: (val: any[]) => scale(val[2]),
        itemStyle: { color: theme.colors[i % theme.colors.length], opacity },
        data: (categoryField
          ? data.filter((d) => String(d[categoryField]) === cat)
          : data
        ).map((d) => [d[xField], d[yField], +d[sizeField] || 0, d]),
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
            bottom: cats.length > 1 ? 32 : 24,
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
            formatter: (p: any) =>
              `${p.seriesName}<br/>${xField}: ${p.value[0]}<br/>${yField}: ${p.value[1]}<br/>${sizeField}: ${p.value[2]}`,
          },
          userTooltip,
        ),
        legend:
          cats.length > 1
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
    }, [
      data,
      xField,
      yField,
      sizeField,
      categoryField,
      opacity,
      minSize,
      maxSize,
      option,
      theme,
    ]);

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
BubbleChart.displayName = "BubbleChart";
