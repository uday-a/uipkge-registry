<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BoxplotChart as EChartsBoxplotChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
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
} from "../useChartTheme";

use([CanvasRenderer, EChartsBoxplotChart, GridComponent, TooltipComponent]);

interface BoxRow {
  category: string;
  /** [min, Q1, median, Q3, max] */
  values: [number, number, number, number, number];
}

interface Props {
  data: BoxRow[];
  /** Render horizontally (categories on y-axis). Default false. */
  horizontal?: boolean;
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  horizontal: false,
  height: 320,
});

const mergedOption = computed(() => {
  const cats = props.data.map((d) => d.category);
  const values = props.data.map((d) => d.values);

  const valueAxis = {
    type: "value" as const,
    scale: true,
    splitLine: { lineStyle: { color: chartSplitLineColor.value } },
    axisLabel: { color: chartTextColor.value, fontSize: 11 },
    axisLine: { lineStyle: { color: chartAxisColor.value } },
    axisTick: { show: false },
  };
  const catAxis = {
    type: "category" as const,
    data: cats,
    axisLine: { lineStyle: { color: chartAxisColor.value } },
    axisLabel: { color: chartTextColor.value, fontSize: 11 },
    axisTick: { show: false },
  };

  const series = [
    {
      type: "boxplot",
      data: values,
      itemStyle: {
        color: chartColors.value[0],
        borderColor: chartColors.value[1],
      },
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
      { left: 16, right: 16, top: 24, bottom: 24, containLabel: true },
      userGrid,
    ),
    tooltip: mergeOptionBlock(
      {
        trigger: "item",
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
      },
      userTooltip,
    ),
    xAxis: mergeOptionBlock(props.horizontal ? valueAxis : catAxis, userXAxis),
    yAxis: mergeOptionBlock(props.horizontal ? catAxis : valueAxis, userYAxis),
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
