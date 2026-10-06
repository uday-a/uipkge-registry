<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ParallelAxis {
    name: string
    /** Set explicitly for fixed scales, otherwise computed from data. */
    min?: number
    max?: number
  }

  export interface ParallelRow {
    /** One value per axis, in the same order as `axes`. */
    values: number[]
    /** Optional name shown in the tooltip. */
    name?: string
    /** Optional series grouping (index → chart-N colour). */
    group?: number
  }

  export interface ParallelChartProps extends HTMLAttributes<HTMLDivElement> {
    axes: ParallelAxis[]
    data: ParallelRow[]
    /** Optional group labels (shown in legend). */
    groups?: string[]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use, type EChartsType } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { ParallelChart as EChartsParallelChart } from 'echarts/charts'
  import { LegendComponent, ParallelComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTheme } from './useChartTheme'

  use([CanvasRenderer, EChartsParallelChart, ParallelComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    axes,
    data,
    groups,
    height = 360,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: ParallelChartProps = $props()

  let chartEl: HTMLDivElement | null = $state(null)
  let chart: EChartsType | null = $state(null)

  const heightStyle = $derived(`height: ${/^\d+$/.test(String(height)) ? `${height}px` : String(height)}`)

  const mergedOption: any = $derived.by(() => {
    const theme = $chartTheme
    // Build one series per group so the legend can toggle them.
    const names = groups ?? ['series']
    const series = names.map((name, gi) => ({
      name,
      type: 'parallel' as const,
      lineStyle: { width: 1, opacity: 0.6 },
      data: data.filter((r) => (typeof r.group === 'number' ? r.group === gi : gi === 0)).map((r) => ({
        value: r.values,
        name: r.name,
      })),
    }))

    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      legend: groups?.length
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          }
        : undefined,
      parallelAxis: axes.map((a, dim) => ({
        dim,
        name: a.name,
        min: a.min,
        max: a.max,
        nameTextStyle: { fontSize: 11, color: theme.textColor },
        axisLine: { lineStyle: { color: theme.axisColor } },
        axisLabel: { color: theme.textColor, fontSize: 11 },
      })),
      parallel: {
        left: 36,
        right: 24,
        top: 36,
        bottom: groups?.length ? 36 : 24,
        parallelAxisDefault: { axisLine: { lineStyle: { color: theme.axisColor } } },
      },
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (!chartEl) return
    const instance = init(chartEl)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(chartEl)
    return () => {
      ro.disconnect()
      instance.dispose()
      chart = null
    }
  })

  $effect(() => {
    if (chart) chart.setOption(mergedOption, { notMerge: true })
  })
</script>

<div
  bind:this={ref}
  role="img"
  aria-label={ariaLabel || 'Chart'}
  data-uipkge
  data-slot="parallel-chart"
  style={heightStyle}
  class={cn('w-full', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
