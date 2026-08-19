<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart as EChartsBarChart } from "echarts/charts";
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
  chartBgColor,
  mergeOptionBlock,
} from "../useChartTheme";

use([
  CanvasRenderer,
  EChartsBarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

interface Props {
  data: Record<string, any>[];
  xField?: string;
  yFields: string[];
  /** Render as 100% shares instead of absolute values. Default false. */
  percent?: boolean;
  /** Corner rounding in px. Default 6. */
  radius?: number;
  /** Gap in px between stacked bar segments. Default 1. Set to 0 to disable. */
  stackGap?: number;
  /** Color of the gap between stacked bar segments. Defaults to card background. */
  stackGapColor?: string;
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  xField: "x",
  percent: false,
  radius: 6,
  stackGap: 1,
  height: 320,
});

const mergedOption = computed(() => {
  const totals = props.data.map(
    (d) => props.yFields.reduce((s, f) => s + Math.abs(d[f] ?? 0), 0) || 1,
  );
  const series = props.yFields.map((f, i) => ({
    name: f,
    type: "bar",
    stack: "total",
    barMaxWidth: 34,
    itemStyle: {
      color: chartColors.value[i % chartColors.value.length],
      borderRadius: [props.radius, props.radius, props.radius, props.radius],
      ...(props.stackGap > 0
        ? {
            borderColor: props.stackGapColor ?? chartBgColor.value,
            borderWidth: props.stackGap,
          }
        : {}),
    },
    label: props.percent
      ? {
          show: true,
          color: "#fff",
          fontSize: 10,
          formatter: (p: any) => `${Math.round(p.value)}%`,
        }
      : undefined,
    data: props.data.map((d, r) =>
      props.percent ? (Math.abs(d[f] ?? 0) / totals[r]!) * 100 : d[f],
    ),
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

  const count = Math.max(
    props.yFields.length,
    Array.isArray(userSeries) ? userSeries.length : 0,
  );
  const stackGap = props.stackGap;
  const stackGapColor = props.stackGapColor ?? chartBgColor.value;

  const mergedSeries = Array.isArray(userSeries)
    ? Array.from({ length: count }, (_, i) => {
        const s = series[i] ?? {
          name: `series-${i}`,
          type: "bar",
          stack: "total",
          barMaxWidth: 34,
          itemStyle: {
            color: chartColors.value[i % chartColors.value.length],
          },
        };
        const u = userSeries[i] ?? {};
        return {
          ...s,
          ...u,
          itemStyle: {
            ...s.itemStyle,
            borderRadius: [
              props.radius,
              props.radius,
              props.radius,
              props.radius,
            ],
            ...(stackGap > 0
              ? {
                  borderColor: stackGapColor,
                  borderWidth: stackGap,
                }
              : {}),
            ...(u.itemStyle ?? {}),
          },
        };
      })
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
        axisPointer: { type: "shadow" },
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
        valueFormatter: (v: any) => (props.percent ? `${(+v).toFixed(1)}%` : v),
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
      },
      userLegend,
    ),
    xAxis: mergeOptionBlock(
      {
        type: "category",
        data: props.data.map((d) => d[props.xField]),
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisTick: { show: false },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      props.percent
        ? {
            type: "value",
            max: 100,
            splitLine: { lineStyle: { color: chartSplitLineColor.value } },
            axisLabel: {
              color: chartTextColor.value,
              fontSize: 11,
              formatter: "{value}%",
            },
          }
        : {
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
