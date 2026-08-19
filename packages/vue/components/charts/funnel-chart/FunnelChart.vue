<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { FunnelChart as EChartsFunnelChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";
import { cn } from "@/lib/utils";
import {
  chartColors,
  chartTextColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
} from "../useChartTheme";

use([CanvasRenderer, EChartsFunnelChart, TooltipComponent, LegendComponent]);

interface Props {
  data: { name: string; value: number }[];
  height?: number | string;
  showLabels?: boolean;
  showLegend?: boolean;
  /** ECharts option escape hatch -- merged on top of the computed option. */
  option?: any;
  class?: string;
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  showLabels: true,
  showLegend: false,
});

const mergedOption = computed(() => {
  const series = [
    {
      type: "funnel",
      left: "8%",
      right: "8%",
      top: 12,
      bottom: props.showLegend ? 32 : 12,
      sort: "descending",
      // Floor the narrowest band at 20% width so funnels with a wide
      // value range (e.g. 482 applied -> 12 hired) don't collapse to
      // a sharp point. The bottom stage still reads as the smallest;
      // it's just a recognisable shape, not a pixel.
      minSize: "20%",
      maxSize: "100%",
      funnelAlign: "center",
      gap: 2,
      label: {
        show: props.showLabels,
        position: "inside",
        color: chartTextColor.value,
        fontSize: 11,
        fontWeight: 600,
      },
      labelLine: { length: 8, lineStyle: { width: 1, type: "solid" } },
      itemStyle: { borderWidth: 0 },
      emphasis: { label: { fontSize: 13, fontWeight: 700 } },
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
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
      backgroundColor: chartTooltipBg.value,
      borderColor: chartTooltipBorder.value,
      textStyle: { color: chartTooltipText.value, fontSize: 12 },
    },
    legend: props.showLegend
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
