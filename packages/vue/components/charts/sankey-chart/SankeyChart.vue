<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { SankeyChart as EChartsSankeyChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import { chartTooltipBg, chartTooltipBorder, chartTooltipText } from '../useChartTheme'

use([CanvasRenderer, EChartsSankeyChart, TooltipComponent, LegendComponent])

interface SankeyLink {
  source: string
  target: string
  value: number
}

// Sankey nodes keep a fixed categorical palette so the same flow retains its
// visual identity across light and dark themes. Labels and tooltip chrome
// still use theme tokens for contrast against the current surface.
const SANKEY_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

interface Props {
  /** Node names. If omitted, derived from the union of link sources + targets. */
  nodes?: string[]
  /** `{ source, target, value }` edges between nodes. */
  links: SankeyLink[]
  height?: number | string
  /** Curvature of the link ribbons. 0 = straight, 1 = max curve. */
  curveness?: number
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 360,
  curveness: 0.5,
})

const mergedOption = computed(() => {
  const nodeNames = props.nodes ?? Array.from(new Set(props.links.flatMap((l) => [l.source, l.target])))

  const series = [
    {
      type: 'sankey',
      left: 16,
      right: 72,
      top: 12,
      bottom: 12,
      data: nodeNames.map((name) => ({ name })),
      links: props.links,
      lineStyle: { color: 'gradient', curveness: props.curveness },
      label: { fontSize: 11, color: chartTooltipText.value },
      emphasis: { focus: 'adjacency' },
      itemStyle: { borderWidth: 0 },
    },
  ]

  // Per-index series merge — partial overrides keep computed `type`/`data`.
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
