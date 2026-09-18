<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart as EChartsScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  MarkAreaComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import {
  chartColors,
  chartTextColor,
  chartSplitLineColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
} from '../useChartTheme'

use([
  CanvasRenderer,
  EChartsScatterChart,
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  MarkAreaComponent,
  LegendComponent,
])

function median(vals: number[]) {
  const s = [...vals].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m]! : ((s[m - 1] ?? 0) + (s[m] ?? 0)) / 2
}

interface Props {
  data: { x: number; y: number; label?: string }[]
  /** Split lines. Default to the data medians. */
  xMid?: number
  yMid?: number
  /** Clockwise from top-right: [stars, question marks, dogs, cash cows]. */
  quadrantLabels?: [string, string, string, string]
  xName?: string
  yName?: string
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  quadrantLabels: () => ['Stars', 'Question marks', 'Dogs', 'Cash cows'],
  height: 340,
})

const splits = computed(() => ({
  x: props.xMid ?? median(props.data.map((d) => d.x)),
  y: props.yMid ?? median(props.data.map((d) => d.y)),
}))

const mergedOption = computed(() => {
  const { x, y } = splits.value
  const quad = (name: string, x0: number | string, x1: number | string, y0: number | string, y1: number | string) => [
    {
      xAxis: x0,
      yAxis: y0,
      itemStyle: { color: chartColors.value[0], opacity: 0.05 },
      label: {
        show: true,
        position: 'inside',
        color: chartTextColor.value,
        fontSize: 12,
        fontWeight: 700,
        formatter: name,
      },
    },
    { xAxis: x1, yAxis: y1 },
  ]
  const series = [
    {
      type: 'scatter',
      symbolSize: 12,
      itemStyle: { color: chartColors.value[0], opacity: 0.85 },
      label: {
        show: true,
        position: 'top',
        color: chartTextColor.value,
        fontSize: 10,
        formatter: (p: any) => p.value[2] ?? '',
      },
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { type: 'dashed', color: chartTextColor.value, opacity: 0.6 },
        label: { show: false },
        data: [{ xAxis: x }, { yAxis: y }],
      },
      markArea: {
        silent: true,
        data: [
          quad(props.quadrantLabels[0], x, 'max', y, 'max'),
          quad(props.quadrantLabels[1], 'min', x, y, 'max'),
          quad(props.quadrantLabels[2], 'min', x, 'min', y),
          quad(props.quadrantLabels[3], x, 'max', 'min', y),
        ],
      },
      data: props.data.map((d) => [d.x, d.y, d.label ?? '']),
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
  const xs = props.data.map((d) => d.x)
  const ys = props.data.map((d) => d.y)
  return {
    color: chartColors.value,
    grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
    tooltip: mergeOptionBlock(
      {
        trigger: 'item',
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
        name: props.xName,
        min: Math.min(...xs) - 1,
        max: Math.max(...xs) + 1,
        nameTextStyle: { color: chartTextColor.value, fontSize: 10 },
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'value',
        name: props.yName,
        min: Math.min(...ys) - 1,
        max: Math.max(...ys) + 1,
        nameTextStyle: { color: chartTextColor.value, fontSize: 10 },
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
