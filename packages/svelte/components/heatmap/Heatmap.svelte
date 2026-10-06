<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface HeatmapProps extends HTMLAttributes<HTMLDivElement> {
    /** [xIndex, yIndex, value] tuples. */
    data: [number, number, number][]
    xLabels: string[]
    yLabels: string[]
    height?: number | string
    min?: number
    max?: number
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
  }
</script>

<script lang="ts">
  // @ts-ignore: echarts is a consumer dependency (see heatmap.registry.ts) and is not installed in this package.
  import { use, init } from 'echarts/core'
  // @ts-ignore: echarts is a consumer dependency (see heatmap.registry.ts) and is not installed in this package.
  import { CanvasRenderer } from 'echarts/renderers'
  // @ts-ignore: echarts is a consumer dependency (see heatmap.registry.ts) and is not installed in this package.
  import { HeatmapChart as EChartsHeatmap } from 'echarts/charts'
  // @ts-ignore: echarts is a consumer dependency (see heatmap.registry.ts) and is not installed in this package.
  import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    resolveChartColors,
    resolveChartTooltipBg,
    resolveChartTooltipBorder,
    resolveChartTooltipText,
    watchTheme,
  } from './chart-theme'

  use([CanvasRenderer, EChartsHeatmap, GridComponent, TooltipComponent, VisualMapComponent])

  let {
    class: className,
    data,
    xLabels,
    yLabels,
    height = 300,
    min,
    max,
    option,
    ariaLabel,
    ...restProps
  }: HeatmapProps = $props()

  let themeKey = $state(0)
  $effect(() => watchTheme(() => (themeKey += 1)))

  const theme = $derived.by(() => {
    themeKey // re-resolve CSS tokens when the theme flips
    return {
      colors: resolveChartColors(),
      tooltipBg: resolveChartTooltipBg(),
      tooltipBorder: resolveChartTooltipBorder(),
      tooltipText: resolveChartTooltipText(),
    }
  })

  const mergedOption = $derived.by(() => {
    const t = theme
    const values = data.map((d) => d[2])
    const computedMin = min ?? Math.min(...values)
    const computedMax = max ?? Math.max(...values)

    return {
      grid: { left: 16, right: 16, top: 16, bottom: 16, containLabel: true },
      tooltip: {
        position: 'top',
        backgroundColor: t.tooltipBg,
        borderColor: t.tooltipBorder,
        textStyle: { color: t.tooltipText, fontSize: 12 },
        formatter: (params: any) => `${yLabels[params.value[1]]} / ${xLabels[params.value[0]]}: ${params.value[2]}`,
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 11 },
        axisTick: { show: false },
      },
      visualMap: {
        min: computedMin,
        max: computedMax,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        itemWidth: 12,
        itemHeight: 80,
        inRange: {
          color: [t.colors[0], t.colors[1], t.colors[2]],
        },
        textStyle: { fontSize: 10 },
      },
      series: (() => {
        const series = [
          {
            type: 'heatmap',
            data,
            label: { show: false },
            itemStyle: { borderRadius: 2, borderWidth: 0 },
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' },
            },
          },
        ]
        const userSeries = (option as any)?.series
        return Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
      })(),
      // visualMap / tooltip / axes overrides still spread on top — strip
      // `series` so it doesn't clobber the merged result above.
      ...(() => {
        const { series: _, ...rest } = (option as any) ?? {}
        return rest
      })(),
    }
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))

  let viewport: HTMLDivElement | null = null
  let chart = $state<{ setOption: (option: unknown) => void } | null>(null)

  $effect(() => {
    if (!viewport) return
    const instance = init(viewport)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(viewport)
    return () => {
      ro.disconnect()
      instance.dispose()
      chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption)
  })
</script>

<div
  data-uipkge
  data-slot="heatmap"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  {...restProps}
  style="height: {heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
>
  <div bind:this={viewport} class="size-full"></div>
</div>
