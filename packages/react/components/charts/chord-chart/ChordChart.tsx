"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// ChordChart
// ─────────────────────────────────────────────────────────────────────────

export interface ChordChartProps {
  nodes: { name: string }[];
  links: { source: string; target: string; value: number }[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const ChordChart = React.forwardRef<HTMLDivElement, ChordChartProps>(
  ({ nodes, links, height = 380, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          type: "chord",
          data: nodes,
          links,
          padAngle: 4,
          minAngle: 3,
          label: { color: theme.textColor, fontSize: 11 },
          lineStyle: { opacity: 0.5 },
          emphasis: { focus: "adjacency", lineStyle: { opacity: 0.9 } },
        },
      ];
      const userOption: any = option ?? {};
      const {
        series: userSeries,
        tooltip: userTooltip,
        legend: userLegend,
        ...userRest
      } = userOption;
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series;
      return {
        color: theme.colors,
        tooltip: mergeOptionBlock(
          {
            trigger: "item",
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
          },
          userTooltip,
        ),
        legend: mergeOptionBlock(
          {
            bottom: 0,
            icon: "circle",
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          },
          userLegend,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [nodes, links, option, theme]);

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
ChordChart.displayName = "ChordChart";
