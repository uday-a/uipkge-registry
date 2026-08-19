<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { CustomChart as EChartsCustomChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
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

use([
  CanvasRenderer,
  EChartsCustomChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

export interface MekkoColumn {
  name: string;
  values: { name: string; value: number }[];
}

interface Props {
  columns: MekkoColumn[];
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 340,
});

const segments = computed(() =>
  Array.from(
    new Set(props.columns.flatMap((c) => c.values.map((v) => v.name))),
  ),
);

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

// 100×100 value space: column widths ∝ column totals (x), segment
// heights ∝ within-column shares (y, stacked bottom-up). Column labels
// render as in-canvas text below y=0 (axis floor is -10 for room).
const flat = computed<MekkoRect[]>(() => {
  const grand =
    props.columns.reduce(
      (s, c) => s + c.values.reduce((a, v) => a + v.value, 0),
      0,
    ) || 1;
  let x = 0;
  return props.columns.flatMap((c) => {
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
});

const mergedOption = computed(() => {
  const series = [
    {
      type: "custom",
      renderItem: (params: any, api: any) => {
        const s: MekkoRect = flat.value[params.dataIndex];
        const [px0, py1] = api.coord([s.x0, s.y1]);
        const [px1, py0] = api.coord([s.x1, s.y0]);
        const color =
          chartColors.value[
            segments.value.indexOf(s.name) % chartColors.value.length
          ];
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
              fill: chartTextColor.value,
              fontSize: 10,
              fontWeight: 600,
              align: "center",
              verticalAlign: "middle",
            },
          });
        }
        return { type: "group", children };
      },
      data: flat.value.map((s) => [s.x0, s.y0, s.x1, s.y1]),
    },
  ];
  const userOption: any = props.option ?? {};
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
    color: chartColors.value,
    grid: mergeOptionBlock(
      { left: 8, right: 8, top: 16, bottom: 36, containLabel: false },
      userGrid,
    ),
    tooltip: mergeOptionBlock(
      {
        trigger: "item",
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
        formatter: (p: any) => {
          const s: MekkoRect | undefined = flat.value[p.dataIndex];
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
        textStyle: { fontSize: 11, color: chartTextColor.value },
        data: segments.value,
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
});
</script>

<template>
  <div
    role="img"
    tabindex="0"
    :aria-label="ariaLabel || 'Marimekko chart'"
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
