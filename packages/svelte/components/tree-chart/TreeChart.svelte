<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TreeChartNode {
    name: string
    value?: number
    children?: TreeChartNode[]
    /** Collapse this branch on initial render. */
    collapsed?: boolean
  }

  export interface TreeChartProps extends HTMLAttributes<HTMLDivElement> {
    data: TreeChartNode
    /** `LR` (left-to-right, default), `TB` (top-down), `RL`, `BT`, or `radial`. */
    orient?: 'LR' | 'TB' | 'RL' | 'BT' | 'radial'
    /** Allow click-and-drag pan. Default false. */
    roam?: boolean
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { init, use, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { TreeChart as EChartsTreeChart } from 'echarts/charts'
  import { TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    getChartAxisColor,
    getChartColors,
    getChartTextColor,
    getChartTooltipBg,
    getChartTooltipBorder,
    getChartTooltipText,
  } from './chart-theme'

  use([CanvasRenderer, EChartsTreeChart, TooltipComponent])

  let {
    data,
    orient = 'LR',
    roam = false,
    height = 380,
    option,
    class: className,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: TreeChartProps = $props()

  // Theme version: bumped on mount and whenever `<html>` class/style changes
  // (the typical dark-mode pivot) so the derived option re-resolves
  // CSS-driven colors and the chart re-paints.
  let themeKey = $state(0)
  onMount(() => {
    themeKey++
    const mo = new MutationObserver(() => themeKey++)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    })
    return () => mo.disconnect()
  })

  const mergedOption = $derived.by(() => {
    void themeKey
    const layout = orient === 'radial' ? ('radial' as const) : ('orthogonal' as const)
    const textColor = getChartTextColor()
    const axisColor = getChartAxisColor()
    const colors = getChartColors()
    const series = [
      {
        type: 'tree',
        data: [data],
        layout,
        orient: layout === 'orthogonal' ? orient : undefined,
        roam,
        symbol: 'circle',
        symbolSize: 10,
        initialTreeDepth: -1,
        top: 16,
        bottom: 16,
        left: layout === 'radial' ? '5%' : 16,
        right: layout === 'radial' ? '5%' : 60,
        label: {
          fontSize: 11,
          color: textColor,
          position: layout === 'radial' ? ('inside' as const) : ('right' as const),
          verticalAlign: 'middle' as const,
          align: layout === 'radial' ? ('center' as const) : ('left' as const),
          distance: 6,
        },
        leaves: {
          label: { position: layout === 'radial' ? ('inside' as const) : ('right' as const) },
        },
        lineStyle: { color: axisColor, width: 1.5, curveness: 0.5 },
        emphasis: { focus: 'descendant' as const },
        itemStyle: { color: colors[0], borderColor: colors[0] },
      },
    ]

    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: getChartTooltipBg(),
        borderColor: getChartTooltipBorder(),
        textStyle: { color: getChartTooltipText(), fontSize: 12 },
      },
      series: mergedSeries,
      ...userRest,
    }
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))

  let container = $state<HTMLDivElement | null>(null)
  let chart: ECharts | null = null

  onMount(() => {
    if (!container) return
    const c = init(container)
    chart = c
    c.setOption(mergedOption)
    const ro = new ResizeObserver(() => c.resize())
    ro.observe(container)
    return () => {
      ro.disconnect()
      c.dispose()
      chart = null
    }
  })

  $effect(() => {
    const opt = mergedOption
    chart?.setOption(opt)
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="tree-chart"
  role="img"
  aria-label={ariaLabel || 'Chart'}
  style="height: {heightStyle}"
  class={cn('w-full', className)}
  {...restProps}
>
  <div bind:this={container} class="size-full"></div>
</div>
