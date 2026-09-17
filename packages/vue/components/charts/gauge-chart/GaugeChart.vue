<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GaugeChart as EChartsGaugeChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";
import { cn } from "@/lib/utils";
import {
  chartColors,
  chartTextColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  gaugeThresholds,
} from "../useChartTheme";

interface Props {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  label?: string;
  height?: number | string;
  /** Colour stops as [percentage, hex] pairs. Default: teal->amber->red,
   *  pulled from `gaugeThresholds` in useChartTheme so the safe-zone
   *  colour ties back to the dashboard palette. Pass your own to override. */
  thresholds?: [number, string][];
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

use([CanvasRenderer, EChartsGaugeChart, TooltipComponent]);

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  unit: "",
  height: 220,
  thresholds: () => gaugeThresholds,
});

const mergedOption = computed(() => {
  const series = [
    {
      type: "gauge",
      min: props.min,
      max: props.max,
      center: ["50%", "60%"],
      radius: "85%",
      startAngle: 200,
      endAngle: -20,
      progress: {
        show: true,
        width: 14,
        itemStyle: { color: chartColors.value[0] },
      },
      pointer: {
        show: true,
        length: "55%",
        width: 4,
        itemStyle: { color: chartColors.value[0] },
      },
      axisLine: {
        lineStyle: {
          width: 14,
          color: props.thresholds.map(
            ([stop, color]) => [stop, color] as [number, string],
          ),
        },
      },
      axisTick: {
        distance: -22,
        length: 4,
        lineStyle: { color: chartTextColor.value, width: 1 },
      },
      splitLine: {
        distance: -26,
        length: 8,
        lineStyle: { color: chartTextColor.value, width: 2 },
      },
      axisLabel: { color: chartTextColor.value, fontSize: 10, distance: -34 },
      anchor: { show: false },
      title: {
        offsetCenter: [0, "88%"],
        color: chartTextColor.value,
        fontSize: 11,
        fontWeight: 500,
      },
      detail: {
        valueAnimation: true,
        formatter: `{value}${props.unit ? " " + props.unit : ""}`,
        color: chartColors.value[0],
        fontSize: 28,
        fontWeight: 700,
        offsetCenter: [0, "40%"],
      },
      data: [{ value: props.value, name: props.label ?? "" }],
    },
  ];

  // Per-index series merge — partial overrides keep computed `type`/`data`.
  const userOption: any = props.option ?? {};
  const { series: userSeries, ...userRest } = userOption;
  const mergedSeries = Array.isArray(userSeries)
    ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
    : series;

  return {
    tooltip: {
      formatter: "{b}: {c}" + (props.unit ? ` ${props.unit}` : ""),
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
