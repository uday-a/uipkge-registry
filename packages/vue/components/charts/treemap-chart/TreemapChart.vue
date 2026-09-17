<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { TreemapChart as EChartsTreemapChart } from "echarts/charts";
// VisualMapComponent registered alongside Tooltip so consumers can hand a
// `visualMap` config via the option escape hatch (color-by-value variant).
import { TooltipComponent, VisualMapComponent } from "echarts/components";
import VChart from "vue-echarts";
import { cn } from "@/lib/utils";
import {
  chartColors,
  chartTextColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  toRgba,
} from "../useChartTheme";

interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
}

interface Props {
  data: TreeNode[];
  height?: number | string;
  /** Show breadcrumb at top when drilling into a sub-tree. Default false. */
  showBreadcrumb?: boolean;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

use([
  CanvasRenderer,
  EChartsTreemapChart,
  TooltipComponent,
  VisualMapComponent,
]);

const props = withDefaults(defineProps<Props>(), {
  height: 320,
  showBreadcrumb: false,
});

const mergedOption = computed(() => {
  const series = [
    {
      type: "treemap",
      // Explicit left/top/right/bottom anchor the layout at 0,0 of the
      // container. Without these, ECharts centres the treemap and the
      // (invisible) breadcrumb still reserves ~22px at the top -- shows
      // up as a phantom gap above the first rect.
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: "auto",
      height: "auto",
      roam: false,
      nodeClick: false,
      breadcrumb: { show: props.showBreadcrumb, height: 0 },
      label: {
        show: true,
        formatter: ({ name, value }: any) =>
          value ? `{b|${name}}\n{v|${value}}` : name,
        rich: {
          b: {
            color: chartTextColor.value,
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 14,
          },
          v: {
            color: toRgba(chartTextColor.value, 0.85),
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
      // gapWidth carves out the tile separators; an explicit borderColor
      // would render as a contrasting stripe on the consumer's theme
      // (white in dark mode, etc.). The gap reads as separation already.
      itemStyle: { borderWidth: 0, gapWidth: 2 },
      // The earlier `levels` config carried `colorSaturation` per depth
      // for nested trees, but it also implicitly cleared the series
      // `label` config at each level -- which meant flat data (the
      // common case) rendered as untitled coloured rectangles. Apply
      // saturation directly on the series so a single level config
      // doesn't blow away the labels.
      colorSaturation: [0.45, 0.7],
      data: props.data,
    },
  ];

  // Per-index series merge — partial overrides keep computed `type`/`data`.
  const userOption: any = props.option ?? {};
  const { series: userSeries, ...userRest } = userOption;
  const mergedSeries = Array.isArray(userSeries)
    ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
    : series;

  return {
    color: chartColors.value,
    tooltip: {
      formatter: (info: any) => {
        const parts = info.treePathInfo.map((n: any) => n.name).filter(Boolean);
        return `<strong>${parts.join(" / ")}</strong><br>${info.value?.toLocaleString?.() ?? info.value}`;
      },
      backgroundColor: chartTooltipBg.value,
      borderColor: chartTooltipBorder.value,
      textStyle: { color: chartTooltipText.value, fontSize: 12 },
    },
    series: mergedSeries,
    ...userRest,
  };
});
</script>

<template>
  <div
    role="img"
    tabindex="0"
    :aria-label="ariaLabel || 'Chart'"
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
