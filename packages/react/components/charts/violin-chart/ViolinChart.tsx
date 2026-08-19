"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// ViolinChart
// ─────────────────────────────────────────────────────────────────────────

export interface ViolinGroup {
  group: string;
  values: number[];
}

export interface ViolinChartProps {
  groups: ViolinGroup[];
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

function kde(values: number[], grid: number[]): number[] {
  const n = values.length;
  if (!n) return grid.map(() => 0);
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const sd =
    Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / n) || 1;
  const h = 1.06 * sd * Math.pow(n, -0.2) || sd;
  return grid.map(
    (x) =>
      values.reduce((s, v) => s + Math.exp(-0.5 * ((x - v) / h) ** 2), 0) /
      (n * h),
  );
}

function quartiles(sorted: number[]) {
  const q = (p: number) =>
    sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))]!;
  return {
    q1: q(0.25),
    med: q(0.5),
    q3: q(0.75),
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
  };
}

const GRID_N = 60;

export const ViolinChart = React.forwardRef<HTMLDivElement, ViolinChartProps>(
  ({ groups, height = 340, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const all = groups.flatMap((g) => g.values);
      const lo = Math.min(...all, 0);
      const hi = Math.max(...all, 1);
      const grid = Array.from(
        { length: GRID_N },
        (_, i) => lo + ((hi - lo) * i) / (GRID_N - 1),
      );
      const densities = groups.map((g) => kde(g.values, grid));
      const maxD = Math.max(...densities.flat(), 1);
      const W = 0.42;

      const series = [
        {
          type: "custom",
          renderItem: (params: any, api: any) => {
            const gi: number = params.dataIndex;
            const g = groups[gi]!;
            const sorted = [...g.values].sort((a, b) => a - b);
            const { q1, med, q3, min, max } = quartiles(sorted);
            const dens = densities[gi]!;
            const cx = api.coord([gi, 0])[0];
            const yOf = (v: number) => api.coord([gi, v])[1];
            const xOf = (d: number, side: 1 | -1) =>
              cx +
              side *
                ((d / maxD) *
                  W *
                  Math.abs(api.coord([gi + 1, 0])[0] - cx || 60));
            const right = grid.map(
              (v, i) => [xOf(dens[i]!, 1), yOf(v)] as [number, number],
            );
            const left = grid
              .map((v, i) => [xOf(dens[i]!, -1), yOf(v)] as [number, number])
              .reverse();
            const color = theme.colors[gi % theme.colors.length];
            return {
              type: "group",
              children: [
                {
                  type: "polygon",
                  shape: { points: [...right, ...left] },
                  style: { fill: color, opacity: 0.45 },
                },
                {
                  type: "line",
                  shape: { x1: cx, y1: yOf(min), x2: cx, y2: yOf(max) },
                  style: { stroke: theme.textColor, lineWidth: 1.5 },
                },
                {
                  type: "line",
                  shape: { x1: cx, y1: yOf(q1), x2: cx, y2: yOf(q3) },
                  style: { stroke: color, lineWidth: 7, lineCap: "round" },
                },
                {
                  type: "circle",
                  shape: { cx, cy: yOf(med), r: 4.5 },
                  style: { fill: theme.tooltipBg, stroke: color, lineWidth: 2 },
                },
              ],
            };
          },
          data: groups.map((g) => g.group),
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
            formatter: (p: any) => {
              const g = groups[p.dataIndex];
              if (!g) return "";
              const s = [...g.values].sort((a, b) => a - b);
              const { q1, med, q3 } = quartiles(s);
              return `${g.group}<br/>n=${g.values.length} median=${med.toFixed(2)}<br/>Q1=${q1.toFixed(2)} Q3=${q3.toFixed(2)}`;
            },
          },
          userTooltip,
        ),
        legend: { show: false },
        xAxis: mergeOptionBlock(
          {
            type: "category",
            data: groups.map((g) => g.group),
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "value",
            min: lo,
            max: hi,
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [groups, option, theme]);

    return (
      <ChartFrame
        ref={ref}
        height={height}
        className={className}
        ariaLabel={ariaLabel || "Violin chart"}
      >
        <EChart option={mergedOption} />
      </ChartFrame>
    );
  },
);
ViolinChart.displayName = "ViolinChart";
