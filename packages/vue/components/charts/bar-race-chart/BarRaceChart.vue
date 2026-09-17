<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart as EChartsBarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, GraphicComponent, LegendComponent } from 'echarts/components'
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

use([CanvasRenderer, EChartsBarChart, GridComponent, TooltipComponent, GraphicComponent, LegendComponent])

export interface RaceFrame {
  /** Frame caption, e.g. a year. */
  label: string
  values: { category: string; value: number }[]
}

interface Props {
  frames: RaceFrame[]
  /** Rows shown per frame. Default 8. */
  topN?: number
  /** Auto-advance. Default true. */
  autoPlay?: boolean
  /** ms per frame. Default 1400. */
  interval?: number
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  topN: 8,
  autoPlay: true,
  interval: 1400,
  height: 380,
})

const cursor = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (props.autoPlay && props.frames.length > 1)
    timer = setInterval(() => (cursor.value = (cursor.value + 1) % props.frames.length), props.interval)
})
onUnmounted(() => clearInterval(timer))

const frame = computed(() => props.frames[Math.min(cursor.value, props.frames.length - 1)] ?? { label: '', values: [] })
const rows = computed(() =>
  [...frame.value.values]
    .sort((a, b) => b.value - a.value)
    .slice(0, props.topN)
    .reverse(),
)

const mergedOption = computed(() => {
  const max = Math.max(...rows.value.map((r) => r.value), 1)
  const series = [
    {
      type: 'bar',
      barWidth: 16,
      realtimeSort: true,
      itemStyle: { color: chartColors.value[0], borderRadius: [6, 6, 6, 6] },
      label: { show: true, position: 'right', color: chartTextColor.value, fontSize: 11, fontWeight: 600 },
      data: rows.value.map((r) => r.value),
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
    animationDurationUpdate: 900,
    animationEasingUpdate: 'quinticInOut',
    graphic: {
      elements: [
        {
          type: 'text',
          right: 16,
          bottom: 8,
          style: { text: frame.value.label, fontSize: 44, fontWeight: 800, fill: chartAxisColor.value },
        },
      ],
    },
    grid: mergeOptionBlock({ left: 16, right: 64, top: 16, bottom: 24, containLabel: true }, userGrid),
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
        max: max * 1.25,
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'category',
        inverse: true,
        data: rows.value.map((r) => r.category),
        axisLine: { show: false },
        axisLabel: { color: chartTextColor.value, fontSize: 11, fontWeight: 600 },
        axisTick: { show: false },
        animationDuration: 300,
        animationDurationUpdate: 300,
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
    :aria-label="ariaLabel || `Bar race chart, frame ${frame.label}`"
    :style="{ height: /^\d+$/.test(String(height)) ? `${height}px` : String(height) }"
    :class="cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', props.class)"
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>
