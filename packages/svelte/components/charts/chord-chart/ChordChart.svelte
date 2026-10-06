<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ChordChartProps extends HTMLAttributes<HTMLDivElement> {
    nodes: { name: string }[]
    links: { source: string; target: string; value: number }[]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    /** The chart frame element, via `bind:ref`. */
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { init, use, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { ChordChart as EChartsChordChart } from 'echarts/charts'
  import { LegendComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTheme, mergeOptionBlock } from '../useChartTheme.svelte'

  // Tree-shaken registration, mirroring the Vue twin's `use()` call. The
  // Svelte port drives ECharts directly (no vue-echarts equivalent): init in
  // an $effect, ResizeObserver for autoresize, dispose on destroy.
  use([CanvasRenderer, EChartsChordChart, TooltipComponent, LegendComponent])

  let {
    class: className,
    nodes,
    links,
    height = 380,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: ChordChartProps = $props()

  const mergedOption = $derived.by(() => {
    const theme = chartTheme
    const series = [
      {
        type: 'chord',
        data: nodes,
        links,
        padAngle: 4,
        minAngle: 3,
        label: { color: theme.textColor, fontSize: 11 },
        lineStyle: { opacity: 0.5 },
        emphasis: { focus: 'adjacency', lineStyle: { opacity: 0.9 } },
      },
    ]
    const userOption: any = option ?? {}
    const { series: userSeries, tooltip: userTooltip, legend: userLegend, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: theme.colors,
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: theme.textColor },
        },
        userLegend,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  let chartEl: HTMLDivElement | null = $state(null)
  let chart: ECharts | null = null

  $effect(() => {
    if (!chartEl) return
    chart ??= init(chartEl)
    chart.setOption(mergedOption)
  })

  $effect(() => {
    if (!chartEl) return
    const ro = new ResizeObserver(() => chart?.resize())
    ro.observe(chartEl)
    return () => ro.disconnect()
  })

  onDestroy(() => {
    chart?.dispose()
    chart = null
  })
</script>

<!-- Focusable chart frame with an accessible name, mirroring the Vue twin. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style="height: {/^\d+$/.test(String(height)) ? `${height}px` : String(height)};"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
