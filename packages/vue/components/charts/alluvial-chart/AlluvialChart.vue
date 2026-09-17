<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { SankeyChart as EChartsSankeyChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import { chartTooltipBg, chartTooltipBorder, chartTooltipText, chartTextColor } from '../useChartTheme'

use([CanvasRenderer, EChartsSankeyChart, TooltipComponent, LegendComponent])

interface AlluvialLink {
  source: string
  target: string
  value: number
}

// Sankey nodes keep a fixed categorical palette so the same flow retains
// its visual identity across light and dark themes (mirrors SankeyChart).
const SANKEY_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

interface Props {
  /** Node names. If omitted, derived from the union of link sources + targets. */
  nodes?: string[]
  /** `{ source, target, value }` edges between nodes. */
  links: AlluvialLink[]
  height?: number | string
  /** Curvature of the ribbons. 0 = straight, 1 = max curve. */
  curveness?: number
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 420,
  curveness: 0.5,
})

const mergedOption = computed(() => {
  const nodeNames = props.nodes ?? Array.from(new Set(props.links.flatMap((l) => [l.source, l.target])))
  const series = [
    {
      type: 'sankey',
      orient: 'vertical',
      top: 16,
      bottom: 40,
      left: 12,
      right: 12,
      data: nodeNames.map((name) => ({ name })),
      links: props.links,
      nodeWidth: 14,
      nodeGap: 12,
      lineStyle: { color: 'gradient', curveness: props.curveness },
      label: { fontSize: 10, color: chartTooltipText.value, position: 'bottom', distance: 4 },
      emphasis: { focus: 'adjacency' },
      itemStyle: { borderWidth: 0 },
    },
  ]
  const userOption: any = props.option ?? {}
  const { series: userSeries, ...userRest } = userOption
  const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
  return {
    color: SANKEY_COLORS,
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: chartTooltipBg.value,
      borderColor: chartTooltipBorder.value,
      textStyle: { color: chartTextColor.value, fontSize: 12 },
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
    :aria-label="ariaLabel || 'Alluvial chart'"
    :style="{ height: /^\d+$/.test(String(height)) ? `${height}px` : String(height) }"
    :class="cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', props.class)"
  >
    <VChart :option="mergedOption" :autoresize="true" class="size-full" />
  </div>
</template>
