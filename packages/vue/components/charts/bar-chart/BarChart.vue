<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart as EChartsBarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkAreaComponent,
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
  MarkAreaComponent,
]);

interface Props {
  data: Record<string, any>[];
  xField?: string;
  yField?: string | string[];
  /** Stack series on one baseline. Default false. */
  stacked?: boolean;
  /** Gap in px between stacked bar segments. Default 1. Set to 0 to disable. */
  stackGap?: number;
  /** Color of the gap between stacked bar segments. Defaults to card background. */
  stackGapColor?: string;
  /** Show value labels on top of each bar. Default false. */
  valueLabels?: boolean;
  /** Top corner rounding in px. Default 6. */
  radius?: number;
  height?: number | string;
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  xField: "x",
  yField: "y",
  stacked: false,
  stackGap: 1,
  valueLabels: false,
  radius: 6,
  height: 300,
});

const mergedOption = computed(() => {
  const fields = Array.isArray(props.yField) ? props.yField : [props.yField];
  const xData = props.data.map((d) => d[props.xField!]);

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

  const isHorizontal =
    userXAxis?.type === "value" || userYAxis?.type === "category";
  const hasUserStack =
    Array.isArray(userSeries) && userSeries.some((s: any) => Boolean(s?.stack));
  const stackGap = props.stackGap;
  const stackGapColor = props.stackGapColor ?? chartBgColor.value;

  const defaultRadius = [
    props.radius,
    props.radius,
    props.radius,
    props.radius,
  ];

  const series = fields.map((field, i) => {
    const u = Array.isArray(userSeries) ? (userSeries[i] ?? {}) : {};
    const isStacked = Boolean(props.stacked || u?.stack || hasUserStack);

    return {
      name: field,
      type: "bar",
      stack: props.stacked ? "bars" : undefined,
      barMaxWidth: 32,
      itemStyle: {
        color: chartColors.value[i % chartColors.value.length],
        borderRadius: defaultRadius,
        ...(isStacked && stackGap > 0
          ? {
              borderColor: stackGapColor,
              borderWidth: stackGap,
            }
          : {}),
      },
      label: props.valueLabels
        ? {
            show: true,
            position: "top",
            color: chartTextColor.value,
            fontSize: 11,
          }
        : undefined,
      data: props.data.map((d) => d[field]),
    };
  });

  // Per-index series merge + 2-level deep merge for axis/grid/tooltip
  // blocks (see AreaChart for the rule). Lets consumers tweak axisLabel
  // font size without losing the wrapper's `data` / colors.
  const count = Math.max(
    fields.length,
    Array.isArray(userSeries) ? userSeries.length : 0,
  );
  const mergedSeries = Array.isArray(userSeries)
    ? Array.from({ length: count }, (_, i) => {
        const s = series[i] ?? {
          type: "bar",
          barMaxWidth: 32,
          itemStyle: {
            color: chartColors.value[i % chartColors.value.length],
          },
        };
        const u = userSeries[i] ?? {};
        const isStacked = Boolean(
          props.stacked || s.stack || u?.stack || hasUserStack,
        );

        return {
          ...s,
          ...u,
          itemStyle: {
            ...s.itemStyle,
            borderRadius: defaultRadius,
            ...(isStacked && stackGap > 0
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

  // Single-series charts hide the legend explicitly so ECharts' default
  // doesn't dump the y-field name onto the chart canvas.
  const baseLegend: any =
    fields.length > 1
      ? {
          bottom: 0,
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: chartTextColor.value },
        }
      : { show: false };

  return {
    color: chartColors.value,
    grid: mergeOptionBlock(
      {
        left: 16,
        right: 16,
        top: 24,
        bottom: fields.length > 1 ? 32 : 24,
        containLabel: true,
      },
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
        : mergeOptionBlock(baseLegend, userLegend),
    xAxis: mergeOptionBlock(
      {
        type: "category",
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
        axisLine: { show: false },
        axisTick: { show: false },
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
