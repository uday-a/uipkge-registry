<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FunnelChartProps extends HTMLAttributes<HTMLDivElement> {
    data: { name: string; value: number }[]
    height?: number | string
    showLabels?: boolean
    showLegend?: boolean
    /** ECharts option escape hatch -- merged on top of the computed option. */
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init as echartsInit, use as echartsUse, type ECharts, type EChartsCoreOption } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { FunnelChart as EChartsFunnelChart } from 'echarts/charts'
  import { LegendComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    chartBgColor,
    chartColors,
    chartTextColor,
    chartTooltipBg,
    chartTooltipBorder,
    chartTooltipText,
  } from './useChartTheme.svelte'

  echartsUse([CanvasRenderer, EChartsFunnelChart, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    height = 300,
    showLabels = true,
    showLegend = false,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: FunnelChartProps = $props()

  let chart = $state<ECharts | null>(null)
  let chartEl = $state<HTMLDivElement | null>(null)

  // Share of the top (largest) stage: '100%', '24%', '7.2%', '1.8%'.
  function formatShare(value: number, top: number): string {
    if (!top) return '0%'
    const pct = (value / top) * 100
    return `${pct >= 10 ? Math.round(pct) : Math.round(pct * 10) / 10}%`
  }

  const mergedOption = $derived.by((): EChartsCoreOption => {
    const palette = chartColors()
    const topValue = Math.max(0, ...data.map((d) => d.value))
    const series = [
      {
        type: 'funnel',
        left: '8%',
        right: '8%',
        top: 12,
        bottom: showLegend ? 32 : 12,
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
          show: showLabels,
          position: 'inside',
          color: chartBgColor(),
          formatter: (p: { name: string; value: number }) =>
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
        data: data.map((d: any, i) => ({
          ...d,
          itemStyle: { ...d.itemStyle, borderColor: d.itemStyle?.color ?? palette[i % palette.length] },
        })),
      },
    ]

    // Per-index series merge — partial overrides keep computed `type`/`data`.
    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: palette,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: chartTooltipBg(),
        borderColor: chartTooltipBorder(),
        textStyle: { color: chartTooltipText(), fontSize: 12 },
      },
      legend: showLegend
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: chartTextColor() },
          }
        : undefined,
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (!chartEl) return
    const el = chartEl
    const instance = echartsInit(el)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption, { notMerge: true })
  })
</script>

<!-- tabindex on role=img mirrors the Vue twin: keyboard users can focus the
     chart; the focus ring aids orientation. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style={`height: ${/^\d+$/.test(String(height)) ? `${height}px` : String(height)}`}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  data-uipkge
  data-slot="funnel-chart"
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
