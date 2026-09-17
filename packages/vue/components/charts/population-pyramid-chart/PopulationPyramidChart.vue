<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart as EChartsBarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import {
  chartColors,
  chartTextColor,
  chartAxisColor,
  chartSplitLineColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
} from '../useChartTheme'

use([CanvasRenderer, EChartsBarChart, GridComponent, TooltipComponent, LegendComponent])

interface Props {
  /** One row per age band. */
  data: { band: string; left: number; right: number }[]
  /** Series names for [left, right]. Default ['Male', 'Female']. */
  names?: [string, string]
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  names: () => ['Male', 'Female'],
  height: 340,
})

const mergedOption = computed(() => {
  const series = [
    {
      name: props.names[0],
      type: 'bar',
      stack: 'pop',
      barWidth: 14,
      itemStyle: { color: chartColors.value[2], borderRadius: [4, 4, 4, 4] },
      label: {
        show: true,
        position: 'left',
        color: chartTextColor.value,
        fontSize: 10,
        formatter: (p: any) => Math.abs(p.value),
      },
      data: props.data.map((d) => -Math.abs(d.left)),
    },
    {
      name: props.names[1],
      type: 'bar',
      stack: 'pop',
      barWidth: 14,
      itemStyle: { color: chartColors.value[0], borderRadius: [4, 4, 4, 4] },
      label: { show: true, position: 'right', color: chartTextColor.value, fontSize: 10 },
      data: props.data.map((d) => Math.abs(d.right)),
    },
  ]
  const userOption: any = props.option ?? {}
  const {
    series: userSeries,
    xAxis: userXAxis,
    yAxis: userYAxis,
    grid: userGrid,
    tooltip: userTooltip,
    legend: userLegend,
    ...userRest
  } = userOption
  const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
  return {
    color: chartColors.value,
    grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
    tooltip: mergeOptionBlock(
      {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
        valueFormatter: (v: any) => Math.abs(v),
      },
      userTooltip,
    ),
    legend: mergeOptionBlock(
      {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11, color: chartTextColor.value },
      },
      userLegend,
    ),
    xAxis: mergeOptionBlock(
      {
        type: 'value',
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11, formatter: (v: number) => Math.abs(v) },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'category',
        inverse: true,
        data: props.data.map((d) => d.band),
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisTick: { show: false },
      },
      userYAxis,
    ),
    series: mergedSeries,
    ...userRest,
  }
})
</script>

<template>
  <div
    role="img"
    tabindex="0"
    :aria-label="ariaLabel || 'Chart'"
    :style="{ height: /^\d+$/.test(String(height)) ? `${height}px` : String(height) }"
    :class="cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', props.class)"
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>
