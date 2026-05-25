<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart as EChartsLineChart } from 'echarts/charts'
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
  toRgba,
} from '../useChartTheme'

use([CanvasRenderer, EChartsLineChart, GridComponent, TooltipComponent, LegendComponent])

interface Props {
  data: Record<string, any>[]
  xField?: string
  yFields: string[]
  /** Render as 100% shares instead of absolute values. Default false. */
  percent?: boolean
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  xField: 'x',
  percent: false,
  height: 320,
})

const mergedOption = computed(() => {
  const totals = props.data.map((d) => props.yFields.reduce((s, f) => s + (d[f] ?? 0), 0) || 1)
  const series = props.yFields.map((f, i) => {
    const c = chartColors.value[i % chartColors.value.length]
    return {
      name: f,
      type: 'line',
      stack: 'area',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 1.5, color: c },
      areaStyle: { color: toRgba(c, 0.45) },
      emphasis: { focus: 'series' },
      data: props.data.map((d, r) => (props.percent ? ((d[f] ?? 0) / totals[r]!) * 100 : d[f])),
    }
  })
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
        valueFormatter: (v: any) => (props.percent ? `${(+v).toFixed(1)}%` : v),
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
        boundaryGap: false,
        data: props.data.map((d) => d[props.xField]),
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisTick: { show: false },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      props.percent
        ? {
            type: 'value',
            max: 100,
            splitLine: { lineStyle: { color: chartSplitLineColor.value } },
            axisLabel: { color: chartTextColor.value, fontSize: 11, formatter: '{value}%' },
          }
        : {
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
