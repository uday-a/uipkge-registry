<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart as EChartsScatterChart } from 'echarts/charts'
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

use([CanvasRenderer, EChartsScatterChart, GridComponent, TooltipComponent, LegendComponent])

// Deterministic jitter so SSR + client render identical points.
function jitter(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return (x - Math.floor(x) - 0.5) * 0.72
}

interface Props {
  data: Record<string, any>[]
  valueField?: string
  groupField?: string
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  valueField: 'value',
  groupField: 'group',
  height: 300,
})

const mergedOption = computed(() => {
  const groups = [...new Set(props.data.map((d) => String(d[props.groupField])))]
  const series = groups.map((g, gi) => ({
    name: g,
    type: 'scatter',
    symbolSize: 9,
    itemStyle: { color: chartColors.value[gi % chartColors.value.length], opacity: 0.8 },
    data: props.data
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => String(d[props.groupField]) === g)
      .map(({ d, i }) => [d[props.valueField], gi + jitter(i, gi)]),
  }))
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
    grid: mergeOptionBlock(
      { left: 16, right: 16, top: 24, bottom: groups.length > 1 ? 32 : 24, containLabel: true },
      userGrid,
    ),
    tooltip: mergeOptionBlock(
      {
        trigger: 'item',
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
      },
      userTooltip,
    ),
    legend:
      groups.length > 1
        ? mergeOptionBlock(
            {
              bottom: 0,
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: chartTextColor.value },
            },
            userLegend,
          )
        : undefined,
    xAxis: mergeOptionBlock(
      {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisLine: { lineStyle: { color: chartAxisColor.value } },
      },
      userXAxis,
    ),
    yAxis: mergeOptionBlock(
      {
        type: 'value',
        min: -0.6,
        max: groups.length - 0.4,
        interval: 1,
        axisLabel: { color: chartTextColor.value, fontSize: 11, formatter: (v: number) => groups[Math.round(v)] ?? '' },
        splitLine: { show: false },
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
