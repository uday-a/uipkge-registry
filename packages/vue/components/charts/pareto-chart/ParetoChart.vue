<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart as EChartsBarChart, LineChart as EChartsLineChart } from 'echarts/charts'
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

use([CanvasRenderer, EChartsBarChart, EChartsLineChart, GridComponent, TooltipComponent, LegendComponent])

interface Props {
  /** Unsorted is fine — rows sort descending by value automatically. */
  data: { category: string; value: number }[]
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 320,
})

const mergedOption = computed(() => {
  const rows = [...props.data].sort((a, b) => b.value - a.value)
  const total = rows.reduce((s, r) => s + r.value, 0) || 1
  let acc = 0
  const cum = rows.map((r) => {
    acc += r.value
    return +((acc / total) * 100).toFixed(1)
  })
  const series = [
    {
      name: 'value',
      type: 'bar',
      yAxisIndex: 0,
      barMaxWidth: 30,
      itemStyle: { color: chartColors.value[0], borderRadius: [6, 6, 6, 6] },
      data: rows.map((r) => r.value),
    },
    {
      name: 'cumulative %',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 2, color: chartColors.value[3] },
      itemStyle: { color: chartColors.value[3] },
      data: cum,
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
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
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
        type: 'category',
        data: rows.map((r) => r.category),
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11, rotate: 20 },
        axisTick: { show: false },
      },
      userXAxis,
    ),
    yAxis: Array.isArray(userYAxis)
      ? userYAxis
      : [
          mergeOptionBlock(
            {
              type: 'value',
              splitLine: { lineStyle: { color: chartSplitLineColor.value } },
              axisLabel: { color: chartTextColor.value, fontSize: 11 },
            },
            (userYAxis as any)?.[0],
          ),
          mergeOptionBlock(
            {
              type: 'value',
              max: 100,
              splitLine: { show: false },
              axisLabel: { color: chartTextColor.value, fontSize: 11, formatter: '{value}%' },
            },
            (userYAxis as any)?.[1],
          ),
        ],
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
