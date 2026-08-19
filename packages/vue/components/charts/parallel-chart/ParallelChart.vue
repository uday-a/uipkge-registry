<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ParallelChart as EChartsParallelChart } from "echarts/charts";
import {
  ParallelComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { cn } from "@/lib/utils";
import {
  chartColors,
  chartTextColor,
  chartAxisColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
} from "../useChartTheme";

use([
  CanvasRenderer,
  EChartsParallelChart,
  ParallelComponent,
  TooltipComponent,
  LegendComponent,
]);

interface Axis {
  name: string;
  /** Set explicitly for fixed scales, otherwise computed from data. */
  min?: number;
  max?: number;
}
interface Row {
  /** One value per axis, in the same order as `axes`. */
  values: number[];
  /** Optional name shown in the tooltip. */
  name?: string;
  /** Optional series grouping (index → chart-N colour). */
  group?: number;
}

interface Props {
  axes: Axis[];
  data: Row[];
  /** Optional group labels (shown in legend). */
  groups?: string[];
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 360,
});

const mergedOption = computed(() => {
  // Build one series per group so the legend can toggle them.
  const groups = props.groups ?? ["series"];
  const series = groups.map((name, gi) => ({
    name,
    type: "parallel" as const,
    lineStyle: { width: 1, opacity: 0.6 },
    data: props.data
      .filter((r) => (typeof r.group === "number" ? r.group === gi : gi === 0))
      .map((r) => ({ value: r.values, name: r.name })),
  }));

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
    legend: props.groups?.length
      ? {
          bottom: 0,
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: chartTextColor.value },
        }
      : undefined,
    parallelAxis: props.axes.map((a, dim) => ({
      dim,
      name: a.name,
      min: a.min,
      max: a.max,
      nameTextStyle: { fontSize: 11, color: chartTextColor.value },
      axisLine: { lineStyle: { color: chartAxisColor.value } },
      axisLabel: { color: chartTextColor.value, fontSize: 11 },
    })),
    parallel: {
      left: 36,
      right: 24,
      top: 36,
      bottom: props.groups?.length ? 36 : 24,
      parallelAxisDefault: {
        axisLine: { lineStyle: { color: chartAxisColor.value } },
      },
    },
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
