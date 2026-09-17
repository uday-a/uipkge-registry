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
  /** Pre-binned data. Pass raw numbers via `values` + `bins` instead. */
  data?: { bin: string; count: number }[]
  /** Raw values to bin automatically. Ignored when `data` is set. */
  values?: number[]
  /** Bin count for auto-binning. Default 12. */
  bins?: number
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  bins: 12,
  height: 300,
})

const binned = computed(() => {
  if (props.data?.length) return props.data
  const vals = props.values ?? []
  if (!vals.length) return []
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const span = max - min || 1
  const n = Math.max(1, props.bins)
  const counts = Array(n).fill(0)
  for (const v of vals) counts[Math.min(n - 1, Math.floor(((v - min) / span) * n))]++
  return counts.map((count, i) => ({
    bin: `${(min + (span * i) / n).toFixed(1)}–${(min + (span * (i + 1)) / n).toFixed(1)}`,
    count,
  }))
})

const mergedOption = computed(() => {
  const peak = binned.value.reduce((m, d, i) => (d.count > (binned.value[m]?.count ?? -1) ? i : m), 0)
  const series = [
    {
      type: 'bar',
      barCategoryGap: '2%',
      itemStyle: {
        color: (p: any) => (p.dataIndex === peak ? chartColors.value[0] : chartColors.value[2]),
        borderRadius: [3, 3, 3, 3],
      },
      data: binned.value.map((d) => d.count),
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
        data: binned.value.map((d) => d.bin),
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 10, rotate: 30 },
        axisTick: { show: false },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'value',
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
