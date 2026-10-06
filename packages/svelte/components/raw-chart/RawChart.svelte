<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RawChartProps extends HTMLAttributes<HTMLDivElement> {
    option: any
    height?: number | string
    /** Auto-resize on container width change. Default true. */
    autoresize?: boolean
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { cn } from '$lib/utils'

  // Raw escape hatch. The opinionated wrappers (AreaChart, BarChart,
  // FunnelChart, ...) cover the common cases with sensible defaults +
  // a `data` prop. When you need a chart type they don't wrap
  // (Sankey, Sunburst, Graph, Candlestick, ThemeRiver, Tree, Parallel,
  // Custom) -- or when you need a level of customisation the wrappers
  // can't expose without leaking ECharts internals -- reach for this
  // component and pass a complete ECharts option object.
  //
  // You're responsible for `use()`-registering the chart types and
  // components you need before this component renders. The canvas
  // renderer is registered here so you don't have to:
  //
  //   import { use } from 'echarts/core'
  //   import { SankeyChart } from 'echarts/charts'
  //   import { TooltipComponent, LegendComponent } from 'echarts/components'
  //
  //   use([SankeyChart, TooltipComponent, LegendComponent])
  //
  //   const option = { /* full ECharts option for sankey */ }
  //
  //   <RawChart {option} height={400} />
  //
  // Theme tokens (resolveChartTheme, toRgba, etc.) are exported from
  // `useChartTheme.ts` -- import and weave them into your option for
  // visual consistency with the rest of the registry's charts.

  use([CanvasRenderer])

  let {
    class: className,
    option,
    height = 300,
    autoresize = true,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: RawChartProps = $props()

  let canvas: HTMLDivElement | null = null
  let chart = $state<ReturnType<typeof init> | null>(null)

  $effect(() => {
    if (!canvas) return
    const instance = init(canvas)
    chart = instance
    const ro = new ResizeObserver(() => {
      if (autoresize) instance.resize()
    })
    ro.observe(canvas)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    chart?.setOption(option, { notMerge: true, lazyUpdate: true })
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- tabindex on a role="img" frame mirrors the Vue twin: keyboard users can focus the chart region. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  data-uipkge=""
  data-slot="raw-chart"
  style="height: {heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={canvas} class="size-full"></div>
</div>
