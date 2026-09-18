<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart as EChartsLineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, MarkLineComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import {
  chartColors,
  chartDangerColor,
  chartTextColor,
  chartAxisColor,
  chartSplitLineColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
} from '../useChartTheme'

use([CanvasRenderer, EChartsLineChart, GridComponent, TooltipComponent, MarkLineComponent, LegendComponent])

interface Props {
  data: Record<string, any>[]
  xField?: string
  yField?: string
  /** Override computed centre line. Defaults to the data mean. */
  mean?: number
  /** Override computed limits. Default mean ± 2σ. */
  ucl?: number
  lcl?: number
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  xField: 'x',
  yField: 'value',
  height: 300,
})

const stats = computed(() => {
  const vals = props.data.map((d) => +d[props.yField] || 0)
  const mean = props.mean ?? vals.reduce((s, v) => s + v, 0) / Math.max(1, vals.length)
  const sd = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, vals.length)) || 1
  return { mean, ucl: props.ucl ?? mean + 2 * sd, lcl: props.lcl ?? mean - 2 * sd }
})

const mergedOption = computed(() => {
  const { mean, ucl, lcl } = stats.value
  const line = chartColors.value[0]
  const bad = chartDangerColor.value
  const series = [
    {
      type: 'line',
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 2, color: line },
      itemStyle: {
        color: (p: any) => (p.value > ucl || p.value < lcl ? bad : line),
        borderColor: chartTooltipBg.value,
        borderWidth: 1.5,
      },
      markLine: {
        silent: true,
        symbol: 'none',
        label: { color: chartTextColor.value, fontSize: 10, formatter: '{b}' },
        lineStyle: { type: 'dashed', width: 1 },
        data: [
          { name: 'UCL', yAxis: ucl, lineStyle: { color: bad } },
          { name: 'Mean', yAxis: mean, lineStyle: { color: chartTextColor.value } },
          { name: 'LCL', yAxis: lcl, lineStyle: { color: bad } },
        ],
      },
      data: props.data.map((d) => d[props.yField]),
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
    grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
    tooltip: mergeOptionBlock(
      {
        trigger: 'axis',
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
      },
      userTooltip,
    ),
    legend: { show: false },
    xAxis: mergeOptionBlock(
      {
        type: 'category',
        data: props.data.map((d) => d[props.xField]),
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 10 },
        axisTick: { show: false },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
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
