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

export interface RangeDatum {
  label: string
  low: number
  high: number
}

interface Props {
  data: RangeDatum[]
  /** 'vertical' columns or 'horizontal' bars. Default 'vertical'. */
  orientation?: 'vertical' | 'horizontal'
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'vertical',
  height: 300,
})

const mergedOption = computed(() => {
  const horizontal = props.orientation === 'horizontal'
  const series = [
    {
      name: 'base',
      type: 'bar',
      stack: 'range',
      itemStyle: { borderColor: 'transparent', color: 'transparent' },
      emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
      data: props.data.map((d) => d.low),
    },
    {
      name: 'range',
      type: 'bar',
      stack: 'range',
      barMaxWidth: 30,
      itemStyle: { color: chartColors.value[0], borderRadius: 5 },
      label: {
        show: true,
        position: horizontal ? 'right' : 'top',
        color: chartTextColor.value,
        fontSize: 10,
        formatter: (p: any) => {
          const d = props.data[p.dataIndex]
          return d ? `${d.low}–${d.high}` : ''
        },
      },
      data: props.data.map((d) => d.high - d.low),
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
  const catAxis = {
    type: 'category' as const,
    data: props.data.map((d) => d.label),
    axisLine: { lineStyle: { color: chartAxisColor.value } },
    axisLabel: { color: chartTextColor.value, fontSize: 11 },
    axisTick: { show: false },
  }
  const valAxis = {
    type: 'value' as const,
    splitLine: { lineStyle: { color: chartSplitLineColor.value } },
    axisLabel: { color: chartTextColor.value, fontSize: 11 },
  }
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
        formatter: (ps: any[]) => {
          const d = props.data[ps[0]?.dataIndex]
          return d ? `${d.label}<br/>${d.low} – ${d.high}` : ''
        },
      },
      userTooltip,
    ),
    legend: { show: false },
    xAxis: mergeOptionBlock(horizontal ? valAxis : catAxis, userXAxis),
    yAxis: mergeOptionBlock(horizontal ? catAxis : valAxis, userYAxis),
    series: mergedSeries,
    ...userRest,
  }
})
</script>

<template>
  <div
    role="img"
    tabindex="0"
    :aria-label="ariaLabel || 'Range bar chart'"
    :style="{ height: /^\d+$/.test(String(height)) ? `${height}px` : String(height) }"
    :class="cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', props.class)"
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>
