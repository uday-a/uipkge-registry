<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GraphChart as EChartsGraphChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";
import { cn } from "@/lib/utils";
import {
  chartColors,
  chartAxisColor,
  chartTextColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
} from "../useChartTheme";

use([CanvasRenderer, EChartsGraphChart, TooltipComponent, LegendComponent]);

interface GraphNode {
  name: string;
  /** Optional category index (paints with chart-N colour). */
  category?: number;
  /** Optional fixed marker size. Defaults to 28. */
  symbolSize?: number;
}
interface GraphLink {
  source: string;
  target: string;
  /** Optional edge value (shows up in the tooltip + sizes the line on weighted layouts). */
  value?: number;
}

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  /** Optional category labels rendered in the legend. */
  categories?: string[];
  /** Layout engine. `force` is force-directed (default), `circular` arranges
   *  on a ring, `none` lets you place nodes manually via `x`/`y`. */
  layout?: "force" | "circular" | "none";
  /** Allow click-and-drag pan + scroll zoom. Default false. */
  roam?: boolean;
  /** Draw arrowheads on the target end. Default true. */
  directed?: boolean;
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  layout: "force",
  roam: false,
  directed: true,
  height: 380,
});

const mergedOption = computed(() => {
  const series = [
    {
      type: "graph",
      layout: props.layout,
      roam: props.roam,
      symbolSize: 28,
      label: { show: true, fontSize: 11, color: chartTextColor.value },
      edgeSymbol: props.directed
        ? (["none", "arrow"] as [string, string])
        : (["none", "none"] as [string, string]),
      edgeSymbolSize: [0, 6],
      force: { repulsion: 220, edgeLength: 90 },
      lineStyle: { color: chartAxisColor.value, curveness: 0.15, width: 1 },
      emphasis: { focus: "adjacency" as const, lineStyle: { width: 2 } },
      categories: props.categories?.map((name) => ({ name })),
      data: props.nodes.map((n) => ({
        ...n,
        itemStyle:
          typeof n.category === "number"
            ? {
                color: chartColors.value[n.category % chartColors.value.length],
              }
            : undefined,
      })),
      links: props.links,
    },
  ];

  const userOption: any = props.option ?? {};
  const { series: userSeries, ...userRest } = userOption;
  const mergedSeries = Array.isArray(userSeries)
    ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
    : series;

  return {
    color: chartColors.value,
    tooltip: {
      trigger: "item",
      backgroundColor: chartTooltipBg.value,
      borderColor: chartTooltipBorder.value,
      textStyle: { color: chartTooltipText.value, fontSize: 12 },
    },
    legend: props.categories?.length
      ? {
          bottom: 0,
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: chartTextColor.value },
        }
      : undefined,
    series: mergedSeries,
    ...userRest,
  };
});
</script>

<template>
  <div
    role="img"
    :aria-label="ariaLabel || 'Chart'"
    :style="{
      height: /^\d+$/.test(String(height)) ? `${height}px` : String(height),
    }"
    :class="cn('w-full', props.class)"
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>
