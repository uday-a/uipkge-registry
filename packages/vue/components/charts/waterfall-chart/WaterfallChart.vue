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

export interface WaterfallDatum {
  label: string
  /** Signed delta. Positive builds up, negative draws down. */
  value: number
}

interface Props {
  data: WaterfallDatum[]
  /** Append a computed Total bar. Default true. */
  showTotal?: boolean
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  showTotal: true,
  height: 320,
})

const mergedOption = computed(() => {
  const labels: string[] = []
  const base: number[] = []
  const uplift: number[] = []
  const styles: Record<number, string> = {}
  const up = chartColors.value[1]
  const down = chartColors.value[3]
  const totalColor = chartColors.value[0]

  let cursor = 0
  props.data.forEach((d, i) => {
    labels.push(d.label)
    if (d.value >= 0) {
      base.push(cursor)
      uplift.push(d.value)
      styles[i] = up
    } else {
      base.push(cursor + d.value)
      uplift.push(-d.value)
      styles[i] = down
    }
    cursor += d.value
  })
  if (props.showTotal) {
    labels.push('Total')
    base.push(0)
    uplift.push(cursor)
    styles[labels.length - 1] = totalColor
  }

  const series = [
    {
      name: 'base',
      type: 'bar',
      stack: 'waterfall',
      itemStyle: { borderColor: 'transparent', color: 'transparent' },
      emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
      data: base,
    },
    {
      name: 'value',
      type: 'bar',
      stack: 'waterfall',
      barMaxWidth: 36,
      label: { show: true, position: 'top', color: chartTextColor.value, fontSize: 11 },
      itemStyle: {
        color: (p: any) => styles[p.dataIndex] ?? totalColor,
        borderRadius: [6, 6, 6, 6],
      },
      data: uplift,
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
    grid: mergeOptionBlock({ left: 16, right: 16, top: 32, bottom: 24, containLabel: true }, userGrid),
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
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisTick: { show: false },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'value',
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisLine: { show: false },
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
