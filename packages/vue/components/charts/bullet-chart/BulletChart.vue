<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart as EChartsBarChart, ScatterChart as EChartsScatterChart } from 'echarts/charts'
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

use([CanvasRenderer, EChartsBarChart, EChartsScatterChart, GridComponent, TooltipComponent, LegendComponent])

export interface BulletDatum {
  label: string
  /** Measured value (foreground bar). */
  actual: number
  /** Target marker position. */
  target: number
  /** [poor, satisfactory, good] upper bounds for the background bands. */
  ranges: [number, number, number]
}

interface Props {
  data: BulletDatum[]
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
})

const mergedOption = computed(() => {
  const labels = props.data.map((d) => d.label)
  const range0 = props.data.map((d) => d.ranges[0])
  const range1 = props.data.map((d) => d.ranges[1] - d.ranges[0])
  const range2 = props.data.map((d) => d.ranges[2] - d.ranges[1])

  const series = [
    {
      name: 'poor',
      type: 'bar',
      stack: 'ranges',
      silent: true,
      barWidth: 18,
      itemStyle: { color: chartSplitLineColor.value },
      data: range0,
    },
    {
      name: 'ok',
      type: 'bar',
      stack: 'ranges',
      silent: true,
      itemStyle: { color: chartAxisColor.value, opacity: 0.85 },
      data: range1,
    },
    {
      name: 'good',
      type: 'bar',
      stack: 'ranges',
      silent: true,
      itemStyle: { color: chartColors.value[4], opacity: 0.35 },
      data: range2,
    },
    {
      name: 'actual',
      type: 'bar',
      barWidth: 7,
      barGap: '-90%',
      z: 3,
      itemStyle: { color: chartColors.value[0], borderRadius: 3 },
      label: { show: true, position: 'right', color: chartTextColor.value, fontSize: 11 },
      data: props.data.map((d) => d.actual),
    },
    {
      name: 'target',
      type: 'scatter',
      z: 4,
      symbol: 'rect',
      symbolSize: [3, 24],
      symbolRotate: 0,
      itemStyle: { color: chartTextColor.value },
      data: props.data.map((d, i) => [d.target, i]),
    },
  ]

  const userOption: any = props.option ?? {}
  const {
    series: userSeries,
    xAxis: userXAxis,
    yAxis: userYAxis,
    grid: userGrid,
    tooltip: userTooltip,
    ...userRest
  } = userOption
  const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

  return {
    color: chartColors.value,
    grid: mergeOptionBlock({ left: 16, right: 48, top: 16, bottom: 24, containLabel: true }, userGrid),
    tooltip: mergeOptionBlock(
      {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
      },
      userTooltip,
    ),
    legend: { show: false },
    xAxis: mergeOptionBlock(
      {
        type: 'value',
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'category',
        inverse: true,
        data: labels,
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
