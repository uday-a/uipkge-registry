<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ThemeRiverChart } from 'echarts/charts'
import { SingleAxisComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import {
  chartColors,
  chartTextColor,
  chartAxisColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
} from '../useChartTheme'

use([CanvasRenderer, ThemeRiverChart, SingleAxisComponent, TooltipComponent, LegendComponent])

interface Props {
  /** `[time, value, series]` tuples. Time can be a date string or number. */
  data: [string | number, number, string][]
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
  const series = [
    {
      type: 'themeRiver',
      data: props.data,
      label: { show: false },
      emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' } },
    },
  ]

  const userOption: any = props.option ?? {}
  const {
    series: userSeries,
    singleAxis: userSingleAxis,
    tooltip: userTooltip,
    legend: userLegend,
    ...userRest
  } = userOption
  const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

  return {
    color: chartColors.value,
    tooltip: mergeOptionBlock(
      {
        trigger: 'axis',
        axisPointer: { type: 'line', lineStyle: { color: chartAxisColor.value, opacity: 0.8 } },
        backgroundColor: chartTooltipBg.value,
        borderColor: chartTooltipBorder.value,
        textStyle: { color: chartTooltipText.value, fontSize: 12 },
      },
      userTooltip,
    ),
    legend:
      userLegend?.show === false
        ? undefined
        : mergeOptionBlock(
            {
              bottom: 0,
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: chartTextColor.value },
            },
            userLegend,
          ),
    singleAxis: mergeOptionBlock(
      {
        top: 12,
        bottom: 40,
        type: 'time',
        axisTick: { show: false },
        axisLabel: { color: chartTextColor.value, fontSize: 11 },
        axisLine: { lineStyle: { color: chartAxisColor.value } },
      },
      userSingleAxis,
    ),
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
