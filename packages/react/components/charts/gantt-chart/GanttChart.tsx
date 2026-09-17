"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// GanttChart
// ─────────────────────────────────────────────────────────────────────────

export interface GanttTask {
  name: string;
  /** ISO date strings. */
  start: string;
  end: string;
  /** 0..1 fraction shaded darker as progress. */
  progress?: number;
  group?: string;
}

export interface GanttMilestone {
  /** Task name to pin the diamond to. */
  task: string;
  /** ISO date string. */
  date: string;
  label?: string;
}

export interface GanttChartProps {
  tasks: GanttTask[];
  /** Diamond markers pinned to tasks. */
  milestones?: GanttMilestone[];
  /** ISO date for a dashed "today" line. Pass explicitly (no implicit now() so SSR stays deterministic). */
  today?: string;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

export const GanttChart = React.forwardRef<HTMLDivElement, GanttChartProps>(
  (
    { tasks, milestones, today, height = 320, option, className, ariaLabel },
    ref,
  ) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const groups = [...new Set(tasks.map((t) => t.group ?? "default"))];
      const colorOf = (t: GanttTask) =>
        theme.colors[
          groups.indexOf(t.group ?? "default") % theme.colors.length
        ];
      const series = [
        {
          type: "custom",
          renderItem: (params: any, api: any) => {
            const i: number = params.dataIndex;
            const t = tasks[i]!;
            const start = api.coord([api.value(0), i]);
            const end = api.coord([api.value(1), i]);
            const h = Math.max(8, api.size!([0, 1])[1] * 0.55);
            const p = Math.max(0, Math.min(1, t.progress ?? 1));
            return {
              type: "group",
              children: [
                {
                  type: "rect",
                  shape: {
                    x: start[0],
                    y: start[1] - h / 2,
                    width: Math.max(2, end[0] - start[0]),
                    height: h,
                    r: 4,
                  },
                  style: { fill: colorOf(t), opacity: 0.3 },
                },
                {
                  type: "rect",
                  shape: {
                    x: start[0],
                    y: start[1] - h / 2,
                    width: Math.max(2, (end[0] - start[0]) * p),
                    height: h,
                    r: 4,
                  },
                  style: { fill: colorOf(t) },
                },
              ],
            };
          },
          encode: { x: [0, 1], y: 2 },
          data: tasks.map((t, i) => [t.start, t.end, i]),
          markPoint: milestones?.length
            ? {
                symbol: "diamond",
                symbolSize: 13,
                itemStyle: {
                  color: theme.colors[3],
                  borderColor: theme.tooltipBg,
                  borderWidth: 1.5,
                },
                label: {
                  show: true,
                  fontSize: 9,
                  color: theme.textColor,
                  formatter: "{b}",
                  position: "top",
                  distance: 6,
                },
                data: milestones.map((m) => ({
                  name: m.label ?? m.task,
                  coord: [m.date, tasks.findIndex((t) => t.name === m.task)],
                })),
              }
            : undefined,
          markLine: today
            ? {
                silent: true,
                symbol: "none",
                lineStyle: { type: "dashed", color: theme.textColor, width: 1 },
                label: {
                  formatter: "Today",
                  color: theme.textColor,
                  fontSize: 10,
                  position: "insideEndTop",
                },
                data: [{ xAxis: today }],
              }
            : undefined,
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
              const t = tasks[p.dataIndex];
              return `${t?.name}<br/>${String(t?.start).slice(0, 10)} → ${String(t?.end).slice(0, 10)}`;
            },
          },
          userTooltip,
        ),
        legend: { show: false },
        xAxis: mergeOptionBlock(
          {
            type: "time",
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "category",
            inverse: true,
            data: tasks.map((t) => t.name),
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisTick: { show: false },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      };
    }, [tasks, milestones, today, option, theme]);

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
GanttChart.displayName = "GanttChart";
