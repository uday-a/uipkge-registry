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

// Heikin-Ashi: each candle averages the previous one, filtering market
// noise so trends read as uninterrupted bull/bear runs.
const ha = computed(() => {
  let prevOpen = props.data[0]?.open ?? 0
  let prevClose = props.data[0]?.close ?? 0
  return props.data.map((c) => {
    const haClose = (c.open + c.high + c.low + c.close) / 4
    const haOpen = (prevOpen + prevClose) / 2
    const haHigh = Math.max(c.high, haOpen, haClose)
    const haLow = Math.min(c.low, haOpen, haClose)
    prevOpen = haOpen
    prevClose = haClose
    return {
      date: c.date,
      open: +haOpen.toFixed(2),
      close: +haClose.toFixed(2),
      low: +haLow.toFixed(2),
      high: +haHigh.toFixed(2),
    }
  })
})

const mergedOption = computed(() => {
  const series = [
    {
      type: 'candlestick',
      data: ha.value.map((c) => [c.open, c.close, c.low, c.high]),
      itemStyle: {
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
        data: ha.value.map((c) => c.date),
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
    tabindex="0"
    :aria-label="ariaLabel || 'Heikin-Ashi chart'"
    :style="{ height: /^\d+$/.test(String(height)) ? `${height}px` : String(height) }"
    :class="cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', props.class)"
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>
