<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { CustomChart as EChartsCustomChart } from 'echarts/charts'
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

use([CanvasRenderer, EChartsCustomChart, GridComponent, TooltipComponent, LegendComponent])

interface Props {
  /** One row per category: compare `a` vs `b`. */
  data: { label: string; a: number; b: number }[]
  /** Series names for [a, b]. Default ['Before', 'After']. */
  names?: [string, string]
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  names: () => ['Before', 'After'],
  height: 300,
})

const mergedOption = computed(() => {
  const colorA = chartColors.value[2]
  const colorB = chartColors.value[0]
  const series = [
    {
      type: 'custom',
      renderItem: (params: any, api: any) => {
        const y = api.coord([0, params.dataIndex])[1]
        const a = api.coord([api.value(0), params.dataIndex])
        const b = api.coord([api.value(1), params.dataIndex])
        return {
          type: 'group',
          children: [
            {
              type: 'line',
              shape: { x1: a[0], y1: y, x2: b[0], y2: y },
              style: { stroke: chartAxisColor.value, lineWidth: 2 },
            },
            { type: 'circle', shape: { cx: a[0], cy: y, r: 6 }, style: { fill: colorA } },
            { type: 'circle', shape: { cx: b[0], cy: y, r: 6 }, style: { fill: colorB } },
          ],
        }
      },
      data: props.data.map((d) => [d.a, d.b]),
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
        trigger: 'item',
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
        formatter: (p: any) =>
          `${props.data[p.dataIndex]?.label}<br/>${props.names[0]}: ${p.value[0]}<br/>${props.names[1]}: ${p.value[1]}`,
      },
      userTooltip,
    ),
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { fontSize: 11, color: chartTextColor.value },
      data: [
        { name: props.names[0], itemStyle: { color: colorA } },
        { name: props.names[1], itemStyle: { color: colorB } },
      ],
    },
    xAxis: mergeOptionBlock(
      {
        type: 'value',
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'category',
        inverse: true,
        data: props.data.map((d) => d.label),
        axisLine: { lineStyle: { color: chartAxisColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
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
