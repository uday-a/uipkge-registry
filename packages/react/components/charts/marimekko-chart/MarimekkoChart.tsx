"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// MarimekkoChart
// ─────────────────────────────────────────────────────────────────────────

export interface MekkoColumn {
  name: string;
  values: { name: string; value: number }[];
}

export interface MarimekkoChartProps {
  columns: MekkoColumn[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

interface MekkoRect {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  name: string;
  value: number;
  column: string;
  firstInColumn: boolean;
}

export const MarimekkoChart = React.forwardRef<
  HTMLDivElement,
  MarimekkoChartProps
>(({ columns, height = 340, option, className, ariaLabel }, ref) => {
  const theme = useChartTheme();

  const mergedOption = React.useMemo(() => {
    const segments = Array.from(
      new Set(columns.flatMap((c) => c.values.map((v) => v.name))),
    );
    const grand =
      columns.reduce(
        (s, c) => s + c.values.reduce((a, v) => a + v.value, 0),
        0,
      ) || 1;
    let x = 0;
    const flat: MekkoRect[] = columns.flatMap((c) => {
      const total = c.values.reduce((s, v) => s + v.value, 0);
      const w = (total / grand) * 100;
      let y = 0;
      const rects = c.values.map((v, vi) => {
        const h = total ? (v.value / total) * 100 : 0;
        const rect: MekkoRect = {
          x0: x,
          x1: x + w,
          y0: y,
          y1: y + h,
          name: v.name,
          value: v.value,
          column: c.name,
          firstInColumn: vi === 0,
        };
        y += h;
        return rect;
      });
      x += w;
      return rects;
    });

    const series = [
      {
        type: "custom",
        renderItem: (params: any, api: any) => {
          const s: MekkoRect = flat[params.dataIndex];
          const [px0, py1] = api.coord([s.x0, s.y1]);
          const [px1, py0] = api.coord([s.x1, s.y0]);
          const color =
            theme.colors[segments.indexOf(s.name) % theme.colors.length];
          const w = Math.abs(px1 - px0);
          const h = Math.abs(py1 - py0);
          const children: any[] = [
            {
              type: "rect",
              shape: {
                x: Math.min(px0, px1),
                y: Math.min(py0, py1),
                width: Math.max(1, w),
                height: Math.max(1, h),
                r: 2,
              },
              style: { fill: color },
            },
          ];
          if (w > 48 && h > 20) {
            children.push({
              type: "text",
              style: {
                x: (px0 + px1) / 2,
                y: (py0 + py1) / 2,
                text: `${s.name} ${Math.round(s.y1 - s.y0)}%`,
                fill: "#fff",
                fontSize: 10,
                fontWeight: 600,
                align: "center",
                verticalAlign: "middle",
              },
            });
          }
          if (s.firstInColumn && w > 30) {
            const [lx] = api.coord([(s.x0 + s.x1) / 2, 0]);
            const [, ly] = api.coord([0, -5]);
            children.push({
              type: "text",
              style: {
                x: lx,
                y: ly,
                text: `${s.column} (${Math.round(s.x1 - s.x0)}%)`,
                fill: theme.textColor,
                fontSize: 10,
                fontWeight: 600,
                align: "center",
                verticalAlign: "middle",
              },
            });
          }
          return { type: "group", children };
        },
        data: flat.map((s) => [s.x0, s.y0, s.x1, s.y1]),
      },
    ];
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
        { left: 8, right: 8, top: 16, bottom: 36, containLabel: false },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: "item",
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (p: any) => {
            const s: MekkoRect | undefined = flat[p.dataIndex];
            return s
              ? `${s.column} · ${s.name}<br/>${s.value} (${Math.round(s.x1 - s.x0)}% of width)`
              : "";
          },
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
          data: segments,
        },
        userLegend,
      ),
      xAxis: mergeOptionBlock(
        { type: "value", min: 0, max: 100, show: false },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        { type: "value", min: -12, max: 100, show: false },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    };
  }, [columns, option, theme]);

  return (
    <ChartFrame
      ref={ref}
      height={height}
      className={className}
      ariaLabel={ariaLabel || "Marimekko chart"}
    >
      <EChart option={mergedOption} />
    </ChartFrame>
  );
});
MarimekkoChart.displayName = "MarimekkoChart";
