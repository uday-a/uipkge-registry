<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart as EChartsLineChart } from "echarts/charts";
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
  chartAxisColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
} from "../useChartTheme";

use([
  CanvasRenderer,
  EChartsLineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

interface Props {
  /** One line per entry. Two values = slope chart, more = bump chart. */
  data: { label: string; values: number[] }[];
  /** Point labels, e.g. ['2024', '2025'] or quarterly ranks. */
  points: string[];
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 320,
});

const mergedOption = computed(() => {
  const series = props.data.map((d, i) => ({
    name: d.label,
    type: "line",
    symbol: "circle",
    symbolSize: 7,
    lineStyle: {
      width: 2,
      color: chartColors.value[i % chartColors.value.length],
    },
    itemStyle: { color: chartColors.value[i % chartColors.value.length] },
    label: {
      show: true,
      position: i % 2 ? "right" : "left",
      color: chartTextColor.value,
      fontSize: 10,
      formatter: "{a}",
    },
    endLabel: {
      show: true,
      color: chartTextColor.value,
      fontSize: 10,
      formatter: "{a}",
    },
    data: d.values,
  }));
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
      { left: 16, right: 64, top: 24, bottom: 24, containLabel: false },
      userGrid,
    ),
    tooltip: mergeOptionBlock(
      {
        trigger: "axis",
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
      },
      userTooltip,
    ),
    legend:
      userLegend?.show === false
        ? undefined
        : mergeOptionBlock({ show: false }, userLegend),
    xAxis: mergeOptionBlock(
      {
        type: "category",
        boundaryGap: false,
        data: props.points,
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: {
          color: chartTextColor.value,
          fontSize: 11,
          fontWeight: 600,
        },
        axisTick: { show: false },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      { type: "value", show: false, splitLine: { show: false } },
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
