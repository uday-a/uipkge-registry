<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { CustomChart as EChartsCustomChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";
import { cn } from "@/lib/utils";
import {
  chartColors,
  chartTextColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
} from "../useChartTheme";

use([CanvasRenderer, EChartsCustomChart, GridComponent, TooltipComponent]);

export interface IcicleNode {
  name: string;
  value?: number;
  children?: IcicleNode[];
}

interface Props {
  data: IcicleNode;
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 340,
});

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
const flat = computed<FlatNode[]>(() => {
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
  walk(props.data, 0, 100, 0, 0);
  return out;
});

const maxDepth = computed(() => Math.max(...flat.value.map((n) => n.depth), 0));
const grand = computed(() => flat.value[0]?.value ?? 1);

const mergedOption = computed(() => {
  const series = [
    {
      type: "custom",
      renderItem: (params: any, api: any) => {
        const n: FlatNode = flat.value[params.dataIndex];
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
              fill: chartColors.value[n.color % chartColors.value.length],
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
              fill: n.depth === 0 ? chartTextColor.value : "#fff",
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
      data: flat.value.map((n) => [n.x0, n.depth, n.x1]),
    },
  ];
  const userOption: any = props.option ?? {};
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
    color: chartColors.value,
    grid: mergeOptionBlock(
      { left: 8, right: 8, top: 12, bottom: 12, containLabel: false },
      userGrid,
    ),
    tooltip: mergeOptionBlock(
      {
        trigger: "item",
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
        formatter: (p: any) => {
          const n: FlatNode | undefined = flat.value[p.dataIndex];
          return n
            ? `${n.name}<br/>${n.value.toLocaleString()} t (${((n.value / (grand.value || 1)) * 100).toFixed(1)}%)`
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
        max: maxDepth.value + 1.1,
        inverse: true,
        show: false,
      },
      userYAxis,
    ),
    series: mergedSeries,
    ...userRest,
  };
});
</script>

<template>
  <div
    role="img"
    tabindex="0"
    :aria-label="ariaLabel || 'Icicle chart'"
    :style="{
      height: /^\d+$/.test(String(height)) ? `${height}px` : String(height),
    }"
    :class="
      cn(
        'focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none',
        props.class,
      )
    "
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>
