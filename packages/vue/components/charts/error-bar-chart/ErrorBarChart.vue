<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  BarChart as EChartsBarChart,
  CustomChart as EChartsCustomChart,
} from "echarts/charts";
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
} from "../useChartTheme";

use([
  CanvasRenderer,
  EChartsBarChart,
  EChartsCustomChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

export interface ErrorDatum {
  category: string;
  value: number;
  low: number;
  high: number;
}

interface Props {
  data: ErrorDatum[];
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
});

const mergedOption = computed(() => {
  const series = [
    {
      name: "value",
      type: "bar",
      barMaxWidth: 30,
      itemStyle: { color: chartColors.value[0], borderRadius: [6, 6, 6, 6] },
      data: props.data.map((d) => d.value),
    },
    {
      name: "interval",
      type: "custom",
      silent: true,
      renderItem: (params: any, api: any) => {
        const i: number = params.dataIndex;
        const d = props.data[i]!;
        const cx = api.coord([i, 0])[0];
        const yLow = api.coord([i, d.low])[1];
        const yHigh = api.coord([i, d.high])[1];
        const cap = 7;
        return {
          type: "group",
          children: [
            {
              type: "line",
              shape: { x1: cx, y1: yLow, x2: cx, y2: yHigh },
              style: { stroke: chartTextColor.value, lineWidth: 1.5 },
            },
            {
              type: "line",
              shape: { x1: cx - cap, y1: yLow, x2: cx + cap, y2: yLow },
              style: { stroke: chartTextColor.value, lineWidth: 1.5 },
            },
            {
              type: "line",
              shape: { x1: cx - cap, y1: yHigh, x2: cx + cap, y2: yHigh },
              style: { stroke: chartTextColor.value, lineWidth: 1.5 },
            },
          ],
        };
      },
      data: props.data.map((d) => [d.low, d.high]),
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
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
        formatter: (ps: any[]) => {
          const d = props.data[ps[0]?.dataIndex];
          return d
            ? `${d.category}<br/>${d.value} (CI ${d.low}–${d.high})`
            : "";
        },
      },
      userTooltip,
    ),
    legend: { show: false },
    xAxis: mergeOptionBlock(
      {
        type: "category",
        data: props.data.map((d) => d.category),
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
    :aria-label="ariaLabel || 'Error bar chart'"
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
