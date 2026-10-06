<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TreemapNode {
    name: string
    value?: number
    children?: TreemapNode[]
  }

  export interface TreemapChartProps extends HTMLAttributes<HTMLDivElement> {
    data: TreemapNode[]
    height?: number | string
    /** Show breadcrumb at top when drilling into a sub-tree. Default false. */
    showBreadcrumb?: boolean
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
  import { TreemapChart as EChartsTreemapChart } from 'echarts/charts'
  // VisualMapComponent registered alongside Tooltip so consumers can hand a
  // `visualMap` config via the option escape hatch (color-by-value variant).
  import { TooltipComponent, VisualMapComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    getChartColors,
    getChartTextColor,
    getChartTooltipBg,
    getChartTooltipBorder,
    getChartTooltipText,
    toRgba,
  } from './chart-theme'

  use([CanvasRenderer, EChartsTreemapChart, TooltipComponent, VisualMapComponent])

  let {
    data,
    height = 320,
    showBreadcrumb = false,
    option,
    class: className,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: TreemapChartProps = $props()

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
    const textColor = getChartTextColor()
    const series = [
      {
        type: 'treemap',
        // Explicit left/top/right/bottom anchor the layout at 0,0 of the
        // container. Without these, ECharts centres the treemap and the
        // (invisible) breadcrumb still reserves ~22px at the top -- shows
        // up as a phantom gap above the first rect.
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 'auto',
        height: 'auto',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: showBreadcrumb, height: 0 },
        label: {
          show: true,
          formatter: ({ name, value }: any) => (value ? `{b|${name}}\n{v|${value}}` : name),
          rich: {
            b: { color: textColor, fontSize: 11, fontWeight: 600, lineHeight: 14 },
            v: { color: toRgba(textColor, 0.85), fontSize: 10, fontWeight: 500, lineHeight: 12 },
          },
          overflow: 'truncate',
          ellipsis: '…',
        },
        labelLayout: { hideOverlap: false },
        upperLabel: { show: false },
        // gapWidth carves out the tile separators; an explicit borderColor
        // would render as a contrasting stripe on the consumer's theme
        // (white in dark mode, etc.). The gap reads as separation already.
        itemStyle: { borderWidth: 0, gapWidth: 2 },
        // The earlier `levels` config carried `colorSaturation` per depth
        // for nested trees, but it also implicitly cleared the series
        // `label` config at each level -- which meant flat data (the
        // common case) rendered as untitled coloured rectangles. Apply
        // saturation directly on the series so a single level config
        // doesn't blow away the labels.
        colorSaturation: [0.45, 0.7],
        data,
      },
    ]

    // Per-index series merge — partial overrides keep computed `type`/`data`.
    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: getChartColors(),
      tooltip: {
        formatter: (info: any) => {
          const parts = info.treePathInfo.map((n: any) => n.name).filter(Boolean)
          return `<strong>${parts.join(' / ')}</strong><br>${info.value?.toLocaleString?.() ?? info.value}`
        },
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
  data-slot="treemap-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style="height: {heightStyle}"
  class={cn('w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={container} class="size-full"></div>
</div>
