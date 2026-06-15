<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { CandlestickChart as EChartsCandlestickChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components'
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

use([CanvasRenderer, EChartsCandlestickChart, GridComponent, TooltipComponent, DataZoomComponent])

interface Candle {
  date: string
  open: number
  close: number
  low: number
  high: number
}

interface Props {
  data: Candle[]
  height?: number | string
  /** Show the bottom data-zoom slider. Default false. */
  zoom?: boolean
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 320,
  zoom: false,
})

const mergedOption = computed(() => {
  // ECharts candle data shape: [open, close, low, high].
  const candleData = props.data.map((c) => [c.open, c.close, c.low, c.high])
  const dates = props.data.map((c) => c.date)

  const series = [
    {
      type: 'candlestick',
      data: candleData,
      itemStyle: {
        // Bullish (close >= open) -> teal (chart-2). Bearish -> orange (chart-4).
        color: chartColors.value[1],
        color0: chartColors.value[3],
        borderColor: chartColors.value[1],
        borderColor0: chartColors.value[3],
      },
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
    grid: mergeOptionBlock(
      { left: 16, right: 16, top: 24, bottom: props.zoom ? 60 : 24, containLabel: true },
      userGrid,
    ),
    tooltip: mergeOptionBlock(
      {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
      },
      userTooltip,
    ),
    xAxis: mergeOptionBlock(
      {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
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
        axisLine: { show: false },
        axisTick: { show: false },
      },
      userYAxis,
    ),
    dataZoom: props.zoom ? [{ type: 'slider', bottom: 8, height: 18 }, { type: 'inside' }] : undefined,
    series: mergedSeries,
    ...userRest,
  }
})
</script>

<template>
  <div
    role="img"
    :aria-label="ariaLabel || 'Chart'"
    :style="{ height: /^\d+$/.test(String(height)) ? `${height}px` : String(height) }"
    :class="cn('w-full', props.class)"
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>
