<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SunburstNode {
    name: string
    value?: number
    children?: SunburstNode[]
  }

  export interface SunburstChartProps extends HTMLAttributes<HTMLDivElement> {
    /** Hierarchical data — top-level array, each node has `name`, optional `value`, optional `children`. */
    data: SunburstNode[]
    height?: number | string
    /** Inner / outer radius as percentages of the smaller container side. Default `['12%', '90%']`. */
    radius?: [string, string]
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { SunburstChart as EChartsSunburstChart } from 'echarts/charts'
  import { TooltipComponent } from 'echarts/components'
  import { init, use, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { cn } from '$lib/utils'
  import { chartColors, chartTextColor, chartTooltipBg, chartTooltipBorder, chartTooltipText } from './useChartTheme'

  use([CanvasRenderer, EChartsSunburstChart, TooltipComponent])

  let {
    class: className,
    data,
    height = 360,
    radius = ['12%', '90%'],
    option,
    ariaLabel,
    children,
    ref = $bindable(null),
    ...restProps
  }: SunburstChartProps = $props()

  const mergedOption = $derived.by(() => {
    const series = [
      {
        type: 'sunburst',
        radius,
        data,
        label: { rotate: 'radial' as const, fontSize: 11 },
        itemStyle: { borderColor: $chartTextColor, borderWidth: 1 },
        emphasis: { focus: 'ancestor' as const },
      },
    ]

    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: $chartColors,
      tooltip: {
        trigger: 'item',
        backgroundColor: $chartTooltipBg,
        borderColor: $chartTooltipBorder,
        textStyle: { color: $chartTooltipText, fontSize: 12 },
      },
      series: mergedSeries,
      ...userRest,
    }
  })

  let container = $state<HTMLDivElement | null>(null)
  let chart = $state<ECharts | null>(null)
  let rootEl = $state<HTMLDivElement | null>(null)

  $effect(() => {
    ref = rootEl
  })

  $effect(() => {
    const el = container
    if (!el) return
    const instance = init(el)
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

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- Focusable chart region with an accessible name (mirrors the Vue twin). -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={rootEl}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style="height: {heightStyle}"
  data-uipkge=""
  data-slot="sunburst-chart"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={container} class="size-full"></div>
  {@render children?.()}
</div>
