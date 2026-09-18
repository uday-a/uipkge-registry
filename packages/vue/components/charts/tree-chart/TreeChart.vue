<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { TreeChart as EChartsTreeChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import {
  chartColors,
  chartTextColor,
  chartAxisColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
} from '../useChartTheme'

use([CanvasRenderer, EChartsTreeChart, TooltipComponent])

interface TreeNode {
  name: string
  value?: number
  children?: TreeNode[]
  /** Collapse this branch on initial render. */
  collapsed?: boolean
}

interface Props {
  data: TreeNode
  /** `LR` (left-to-right, default), `TB` (top-down), `RL`, `BT`, or `radial`. */
  orient?: 'LR' | 'TB' | 'RL' | 'BT' | 'radial'
  /** Allow click-and-drag pan. Default false. */
  roam?: boolean
  height?: number | string
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  orient: 'LR',
  roam: false,
  height: 380,
})

const mergedOption = computed(() => {
  const layout = props.orient === 'radial' ? ('radial' as const) : ('orthogonal' as const)
  const series = [
    {
      type: 'tree',
      data: [props.data],
      layout,
      orient: layout === 'orthogonal' ? props.orient : undefined,
      roam: props.roam,
      symbol: 'circle',
      symbolSize: 10,
      initialTreeDepth: -1,
      top: 16,
      bottom: 16,
      left: layout === 'radial' ? '5%' : 16,
      right: layout === 'radial' ? '5%' : 60,
      label: {
        fontSize: 11,
        color: chartTextColor.value,
        position: layout === 'radial' ? ('inside' as const) : ('right' as const),
        verticalAlign: 'middle' as const,
        align: layout === 'radial' ? ('center' as const) : ('left' as const),
        distance: 6,
      },
      leaves: {
        label: { position: layout === 'radial' ? ('inside' as const) : ('right' as const) },
      },
      lineStyle: { color: chartAxisColor.value, width: 1.5, curveness: 0.5 },
      emphasis: { focus: 'descendant' as const },
      itemStyle: { color: chartColors.value[0], borderColor: chartColors.value[0] },
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
    :aria-label="ariaLabel || 'Chart'"
    :style="{ height: /^\d+$/.test(String(height)) ? `${height}px` : String(height) }"
    :class="cn('w-full', props.class)"
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>
