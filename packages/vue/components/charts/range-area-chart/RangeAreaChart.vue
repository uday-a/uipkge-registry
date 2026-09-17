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
  chartSplitLineColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
  toRgba,
} from "../useChartTheme";

use([
  CanvasRenderer,
  EChartsLineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

interface Props {
  data: Record<string, any>[];
  xField?: string;
  minField?: string;
  maxField?: string;
  avgField?: string;
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  xField: "x",
  minField: "min",
  maxField: "max",
  avgField: "avg",
  height: 320,
});

const mergedOption = computed(() => {
  const band = chartColors.value[0];
  const avg = chartColors.value[3];
  const xData = props.data.map((d) => d[props.xField]);
  const series = [
    {
      name: "min",
      type: "line",
      stack: "band",
      silent: true,
      symbol: "none",
      lineStyle: { opacity: 0 },
      itemStyle: { opacity: 0 },
      data: props.data.map((d) => d[props.minField]),
    },
    {
      name: "range",
      type: "line",
      stack: "band",
      silent: true,
      symbol: "none",
      lineStyle: { opacity: 0 },
      areaStyle: { color: toRgba(band, 0.22) },
      data: props.data.map(
        (d) => (d[props.maxField] ?? 0) - (d[props.minField] ?? 0),
      ),
    },
    {
      name: props.avgField,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 6,
      lineStyle: { width: 2, color: avg },
      itemStyle: { color: avg },
      data: props.data.map((d) => d[props.avgField]),
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
      { left: 16, right: 16, top: 24, bottom: 32, containLabel: true },
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
    legend: mergeOptionBlock(
      {
        bottom: 0,
        icon: "circle",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11, color: chartTextColor.value },
        data: [props.avgField, "range"],
      },
      userLegend,
    ),
    xAxis: mergeOptionBlock(
      {
        type: "category",
        boundaryGap: false,
        data: xData,
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisTick: { show: false },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: "value",
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
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
