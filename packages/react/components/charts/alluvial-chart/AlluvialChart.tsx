"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme } from "../useChartTheme";

// AlluvialChart
// ─────────────────────────────────────────────────────────────────────────

export interface AlluvialLink {
  source: string;
  target: string;
  value: number;
}

export interface AlluvialChartProps {
  /** Node names. If omitted, derived from the union of link sources + targets. */
  nodes?: string[];
  /** `{ source, target, value }` edges between nodes. */
  links: AlluvialLink[];
  height?: number | string;
  /** Curvature of the ribbons. 0 = straight, 1 = max curve. */
  curveness?: number;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

// Sankey nodes keep a fixed categorical palette so the same flow retains its
// visual identity across light and dark themes (mirrors SankeyChart).
const SANKEY_COLORS = [
  "#3b82f6",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export const AlluvialChart = React.forwardRef<
  HTMLDivElement,
  AlluvialChartProps
>(
  (
    {
      nodes,
      links,
      height = 420,
      curveness = 0.5,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const nodeNames =
        nodes ??
        Array.from(new Set(links.flatMap((l) => [l.source, l.target])));
      const series = [
        {
          type: "sankey",
          orient: "vertical",
          top: 16,
          bottom: 40,
          left: 12,
          right: 12,
          data: nodeNames.map((name) => ({ name })),
          links,
          nodeWidth: 14,
          nodeGap: 12,
          lineStyle: { color: "gradient", curveness },
          label: {
            fontSize: 10,
            color: theme.tooltipText,
            position: "bottom",
            distance: 4,
          },
          emphasis: { focus: "adjacency" },
          itemStyle: { borderWidth: 0 },
        },
      ];
      const userOption: any = option ?? {};
      const { series: userSeries, ...userRest } = userOption;
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series;
      return {
        color: SANKEY_COLORS,
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.textColor, fontSize: 12 },
        },
        series: mergedSeries,
        ...userRest,
      };
    }, [nodes, links, curveness, option, theme]);

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={className}
        ariaLabel={ariaLabel || "Alluvial chart"}
      >
        <EChart option={mergedOption} />
      </ChartFrame>
    );
  },
);
AlluvialChart.displayName = "AlluvialChart";
