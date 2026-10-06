<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { FunnelChart as EChartsFunnelChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { cn } from '@/lib/utils'
import { chartBgColor, chartColors, chartTextColor, chartTooltipBg, chartTooltipBorder, chartTooltipText } from '../useChartTheme'

use([CanvasRenderer, EChartsFunnelChart, TooltipComponent, LegendComponent])

interface Props {
  data: { name: string; value: number }[]
  height?: number | string
  showLabels?: boolean
  showLegend?: boolean
  /** ECharts option escape hatch -- merged on top of the computed option. */
  option?: any
  class?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  showLabels: true,
  showLegend: false,
})

// Share of the top (largest) stage: '100%', '24%', '7.2%', '1.8%'.
function formatShare(value: number, top: number): string {
  if (!top) return '0%'
  const pct = (value / top) * 100
  return `${pct >= 10 ? Math.round(pct) : Math.round(pct * 10) / 10}%`
}

const mergedOption = computed(() => {
  const topValue = Math.max(0, ...props.data.map(d => d.value))
  const series = [
    {
      type: 'funnel',
      left: '8%',
      right: '8%',
      top: 12,
      bottom: props.showLegend ? 32 : 12,
      sort: 'descending',
      // Floor the narrowest band at 20% width so funnels with a wide
      // value range (e.g. 482 applied -> 12 hired) don't collapse to
      // a sharp point. The bottom stage still reads as the smallest;
      // it's just a recognisable shape, not a pixel.
      minSize: '20%',
      maxSize: '100%',
      funnelAlign: 'center',
      // Absorbs the 3px outer half of the 6px stroke, keeping a ~2px visible gutter.
      gap: 8,
      // Inside labels use the card-surface ink (light on the saturated stage
      // fills, tracks light/dark) -- muted text was illegible on colour.
      // Two lines: stage name, then value · share of the top stage.
      label: {
        show: props.showLabels,
        position: 'inside',
        color: chartBgColor.value,
        formatter: (p: { name: string, value: number }) =>
          `{t|${p.name}}\n{v|${p.value.toLocaleString()} · ${formatShare(p.value, topValue)}}`,
        rich: {
          t: { fontSize: 12, fontWeight: 600, lineHeight: 16 },
          v: { fontSize: 11, fontWeight: 500, lineHeight: 15 },
        },
      },
      labelLine: { length: 8, lineStyle: { width: 1, type: 'solid' } },
      // ECharts funnel has no borderRadius; a same-colour round-join stroke softens corners (~3px radius).
      itemStyle: { borderWidth: 6, borderJoin: 'round' },
      emphasis: { label: { fontSize: 13, fontWeight: 700 } },
      // Stroke each stage in its own fill: palette by data index (how ECharts assigns funnel colours) unless the item sets one.
      data: props.data.map((d: any, i) => ({
        ...d,
        itemStyle: {
          ...d.itemStyle,
          borderColor: d.itemStyle?.color ?? chartColors.value[i % chartColors.value.length],
        },
      })),
    },
  ]

  // Per-index series merge — partial overrides keep computed `type`/`data`.
  const userOption: any = props.option ?? {}
  const { series: userSeries, ...userRest } = userOption
  const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

  return {
    color: chartColors.value,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: chartTooltipBg.value,
      borderColor: chartTooltipBorder.value,
      textStyle: { color: chartTooltipText.value, fontSize: 12 },
    },
    legend: props.showLegend
      ? {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: chartTextColor.value },
        }
      : undefined,
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
