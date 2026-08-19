"use client";

import * as React from "react";
import ReactECharts from "echarts-for-react/esm/core";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme } from "../useChartTheme";

// TreemapChart
// ─────────────────────────────────────────────────────────────────────────

interface TreemapNode {
  name: string;
  value?: number;
  children?: TreemapNode[];
}

export interface TreemapChartProps {
  data: TreemapNode[];
  height?: number | string;
  /** Show breadcrumb at top when drilling into a sub-tree. Default false. */
  showBreadcrumb?: boolean;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const TreemapChart = React.forwardRef<HTMLDivElement, TreemapChartProps>(
  (
    {
      data,
      height = 320,
      showBreadcrumb = false,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          type: "treemap",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: "auto",
          height: "auto",
          roam: false,
          nodeClick: false,
          breadcrumb: { show: showBreadcrumb, height: 0 },
          label: {
            show: true,
            formatter: ({ name, value }: any) =>
              value ? `{b|${name}}\n{v|${value}}` : name,
            rich: {
              b: {
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                lineHeight: 14,
              },
              v: {
                color: "rgba(255,255,255,0.85)",
                fontSize: 10,
                fontWeight: 500,
                lineHeight: 12,
              },
            },
            overflow: "truncate",
            ellipsis: "…",
          },
          labelLayout: { hideOverlap: false },
          upperLabel: { show: false },
          itemStyle: { borderWidth: 0, gapWidth: 2 },
          colorSaturation: [0.45, 0.7],
          data,
        },
      ];

      const userOption: any = option ?? {};
      const { series: userSeries, ...userRest } = userOption;
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series;

      return {
        color: theme.colors,
        tooltip: {
          formatter: (info: any) => {
            const parts = info.treePathInfo
              .map((n: any) => n.name)
              .filter(Boolean);
            return `<strong>${parts.join(" / ")}</strong><br>${info.value?.toLocaleString?.() ?? info.value}`;
          },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        series: mergedSeries,
        ...userRest,
      };
    }, [data, showBreadcrumb, option, theme]);

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
TreemapChart.displayName = "TreemapChart";
