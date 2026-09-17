"use client";

import * as React from "react";
import { ChartFrame, EChart } from "../shared";
import { useChartTheme, mergeOptionBlock } from "../useChartTheme";

// IcicleChart
// ─────────────────────────────────────────────────────────────────────────

export interface IcicleNode {
  name: string;
  value?: number;
  children?: IcicleNode[];
}

export interface IcicleChartProps {
  data: IcicleNode;
  height?: number | string;
  option?: any;
  className?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

interface FlatNode {
  x0: number;
  x1: number;
  depth: number;
  name: string;
  value: number;
  color: number;
}

// Partition layout: each level fills 0..100, children subdivide their
// parent proportionally (equal shares when values are absent). Apache
// ECharts has no icicle series, so this renders one custom rect per node.
function flatten(root: IcicleNode): FlatNode[] {
  const out: FlatNode[] = [];
  const walk = (
    node: IcicleNode,
    x0: number,
    x1: number,
    depth: number,
    color: number,
  ) => {
    if (!node || typeof node !== "object") return;
    const kids = node.children ?? [];
    const value =
      node.value ??
      kids.reduce(
        (s, k) =>
          s +
          (k.value ?? k.children?.reduce((a, c) => a + (c.value ?? 0), 0) ?? 0),
        0,
      );
    out.push({ x0, x1, depth, name: node.name, value, color });
    if (!kids.length) return;
    const total = kids.reduce((s, k) => s + (k.value ?? 0), 0);
    let x = x0;
    kids.forEach((k, i) => {
      const w =
        total > 0
          ? ((k.value ?? 0) / total) * (x1 - x0)
          : (x1 - x0) / kids.length;
      walk(k, x, x + w, depth + 1, depth === 0 ? i : color);
      x += w;
    });
  };
  walk(root, 0, 100, 0, 0);
  return out;
}

export const IcicleChart = React.forwardRef<HTMLDivElement, IcicleChartProps>(
  ({ data, height = 340, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme();

    const mergedOption = React.useMemo(() => {
      const flat = flatten(data);
      const maxDepth = Math.max(...flat.map((n) => n.depth), 0);
      const grand = flat[0]?.value ?? 1;
      const series = [
        {
          type: "custom",
          renderItem: (params: any, api: any) => {
            const n: FlatNode = flat[params.dataIndex];
            const [px0, py0] = api.coord([n.x0, n.depth + 0.08]);
            const [px1, py1] = api.coord([n.x1, n.depth + 0.92]);
            const wide = Math.abs(px1 - px0) > 48;
            const children: any[] = [
              {
                type: "rect",
                shape: {
                  x: Math.min(px0, px1),
                  y: Math.min(py0, py1),
                  width: Math.max(1, Math.abs(px1 - px0)),
                  height: Math.abs(py1 - py0),
                  r: 3,
                },
                style: {
                  fill: theme.colors[n.color % theme.colors.length],
                  opacity: n.depth === 0 ? 0.35 : 0.85,
                },
              },
            ];
            if (wide) {
              children.push({
                type: "text",
                style: {
                  x: (px0 + px1) / 2,
                  y: (py0 + py1) / 2,
                  text: n.depth === 0 ? n.name : `${n.name} ${n.value}`,
                  fill: n.depth === 0 ? theme.textColor : "#fff",
                  fontSize: 11,
                  fontWeight: n.depth === 0 ? 700 : 600,
                  align: "center",
                  verticalAlign: "middle",
                  overflow: "truncate",
                  width: Math.abs(px1 - px0) - 12,
                },
              });
            }
            return { type: "group", children };
          },
          data: flat.map((n) => [n.x0, n.depth, n.x1]),
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
          { left: 8, right: 8, top: 12, bottom: 12, containLabel: false },
          userGrid,
        ),
        tooltip: mergeOptionBlock(
          {
            trigger: "item",
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
            formatter: (p: any) => {
              const n: FlatNode | undefined = flat[p.dataIndex];
              return n
                ? `${n.name}<br/>${n.value.toLocaleString()} t (${((n.value / (grand || 1)) * 100).toFixed(1)}%)`
                : "";
            },
          },
          userTooltip,
        ),
        xAxis: mergeOptionBlock(
          { type: "value", min: 0, max: 100, show: false },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: "value",
            min: -0.2,
            max: maxDepth + 1.1,
            inverse: true,
            show: false,
          },
          userYAxis,
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
        ariaLabel={ariaLabel || "Icicle chart"}
      >
        <EChart option={mergedOption} />
      </ChartFrame>
    );
  },
);
IcicleChart.displayName = "IcicleChart";
