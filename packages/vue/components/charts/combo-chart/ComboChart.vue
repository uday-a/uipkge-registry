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
  chartBgColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
} from '../useChartTheme'

use([CanvasRenderer, EChartsBarChart, EChartsLineChart, GridComponent, TooltipComponent, LegendComponent])

interface Props {
  data: Record<string, any>[]
  xField?: string
  /** Bar series field(s) — left axis. */
  barField?: string | string[]
  /** Line series field(s) — right axis. */
  lineField?: string | string[]
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  xField: 'x',
  barField: 'bar',
  lineField: 'line',
  height: 320,
})

const mergedOption = computed(() => {
  const bars = Array.isArray(props.barField) ? props.barField : [props.barField]
  const lines = Array.isArray(props.lineField) ? props.lineField : [props.lineField]
  const xData = props.data.map((d) => d[props.xField!])

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

  const series = [
    ...bars.map((f, i) => {
      const u = Array.isArray(userSeries) ? userSeries[i] : undefined
      const isStacked = Boolean(u?.stack)
      return {
        name: f,
        type: 'bar',
        yAxisIndex: 0,
        barMaxWidth: 28,
        itemStyle: {
          color: chartColors.value[i % chartColors.value.length],
          borderRadius: [6, 6, 6, 6],
          ...(isStacked
            ? {
                borderColor: chartBgColor.value,
                borderWidth: 1,
              }
            : {}),
        },
        data: props.data.map((d) => d[f]),
      }
    }),
    ...lines.map((f, j) => ({
      name: f,
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 2, color: chartColors.value[(bars.length + j) % chartColors.value.length] },
      itemStyle: { color: chartColors.value[(bars.length + j) % chartColors.value.length] },
      data: props.data.map((d) => d[f]),
    })),
  ]

  const mergedSeries = Array.isArray(userSeries)
    ? series.map((s, i) => ({
        ...s,
        ...(userSeries[i] ?? {}),
        itemStyle: {
          ...s.itemStyle,
          ...(userSeries[i]?.itemStyle ?? {}),
        },
      }))
    : series

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
        data: xData,
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
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
            { type: 'value', splitLine: { show: false }, axisLabel: { color: chartTextColor.value, fontSize: 11 } },
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
