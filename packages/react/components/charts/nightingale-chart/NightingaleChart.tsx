"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// NightingaleChart
// ─────────────────────────────────────────────────────────────────────────

export interface NightingaleChartProps {
  data: { name: string; value: number }[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const NightingaleChart = React.forwardRef<
  HTMLDivElement,
  NightingaleChartProps
>(({ data, height = 340, option, className, ariaLabel }, ref) => {
  const theme = useChartTheme();

  const mergedOption = React.useMemo(() => {
    const series = [
      {
        type: "pie",
        roseType: "radius",
        radius: ["18%", "72%"],
        center: ["50%", "46%"],
        itemStyle: {
          borderRadius: 6,
          borderColor: theme.tooltipBg,
          borderWidth: 2,
        },
        label: { color: theme.textColor, fontSize: 11 },
        labelLine: { lineStyle: { color: theme.textColor } },
        data,
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
  }, [data, option, theme]);

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
});
NightingaleChart.displayName = "NightingaleChart";
