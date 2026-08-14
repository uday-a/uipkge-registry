<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart as EChartsPieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import {
  chartColors,
  chartTextColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
  mergeOptionBlock,
} from '../useChartTheme'

use([CanvasRenderer, EChartsPieChart, TooltipComponent, LegendComponent])

interface Props {
  data: { name: string; value: number }[]
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 340,
})

const mergedOption = computed(() => {
  const series = [
    {
      type: 'pie',
      roseType: 'radius',
      radius: ['18%', '72%'],
      center: ['50%', '46%'],
      itemStyle: { borderRadius: 6, borderColor: chartTooltipBg.value, borderWidth: 2 },
      label: { color: chartTextColor.value, fontSize: 11 },
      labelLine: { lineStyle: { color: chartTextColor.value } },
      data: props.data,
    },
  ]
  const userOption: any = props.option ?? {}
  const { series: userSeries, tooltip: userTooltip, legend: userLegend, ...userRest } = userOption
  const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
  return {
    color: chartColors.value,
    tooltip: mergeOptionBlock(
      {
        trigger: 'item',
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
