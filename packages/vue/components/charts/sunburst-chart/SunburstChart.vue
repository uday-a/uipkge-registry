<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { SunburstChart as EChartsSunburstChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import { chartColors, chartTextColor, chartTooltipBg, chartTooltipBorder, chartTooltipText } from '../useChartTheme'

use([CanvasRenderer, EChartsSunburstChart, TooltipComponent])

interface SunNode {
  name: string
  value?: number
  children?: SunNode[]
}

interface Props {
  /** Hierarchical data — top-level array, each node has `name`, optional `value`, optional `children`. */
  data: SunNode[]
  height?: number | string
  /** Inner / outer radius as percentages of the smaller container side. Default `['12%', '90%']`. */
  radius?: [string, string]
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 360,
  radius: () => ['12%', '90%'] as [string, string],
})

const mergedOption = computed(() => {
  const series = [
    {
      type: 'sunburst',
      radius: props.radius,
      data: props.data,
      label: { rotate: 'radial' as const, fontSize: 11 },
      itemStyle: { borderColor: chartTextColor.value, borderWidth: 1 },
      emphasis: { focus: 'ancestor' as const },
    },
  ]

  const userOption: any = props.option ?? {}
  const { series: userSeries, ...userRest } = userOption
  const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

  return {
    color: chartColors.value,
    tooltip: {
      trigger: 'item',
      backgroundColor: chartTooltipBg.value,
      borderColor: chartTooltipBorder.value,
      textStyle: { color: chartTooltipText.value, fontSize: 12 },
    },
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
