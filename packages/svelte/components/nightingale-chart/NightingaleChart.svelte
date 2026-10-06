<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface NightingaleDatum {
    name: string
    value: number
  }

  export interface NightingaleChartProps extends HTMLAttributes<HTMLDivElement> {
    data: NightingaleDatum[]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }

  // NOTE: `echarts` is a consumer dependency (see the sidecar
  // `dependencies`), not installed in this repo — the ts-ignore comments
  // below keep `svelte-check` green in the monorepo while consumers get
  // fully typed ECharts.
  // @ts-ignore: consumer dependency, resolved in the consumer project
  import * as echarts from 'echarts/core'
  // @ts-ignore: consumer dependency, resolved in the consumer project
  import { CanvasRenderer } from 'echarts/renderers'
  // @ts-ignore: consumer dependency, resolved in the consumer project
  import { PieChart as EChartsPieChart } from 'echarts/charts'
  // @ts-ignore: consumer dependency, resolved in the consumer project
  import { TooltipComponent, LegendComponent } from 'echarts/components'

  echarts.use([CanvasRenderer, EChartsPieChart, TooltipComponent, LegendComponent])
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import {
    getChartColors,
    getChartTextColor,
    getChartTooltipBg,
    getChartTooltipBorder,
    getChartTooltipText,
    mergeOptionBlock,
    watchThemeChange,
  } from './useChartTheme'

  let {
    class: className,
    data,
    height = 340,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: NightingaleChartProps = $props()

  let container: HTMLDivElement | null = $state(null)
  // Bumped by the theme watcher so the derived option re-resolves tokens.
  let themeTick = $state(0)

  const mergedOption = $derived.by(() => {
    themeTick
    const series = [
      {
        type: 'pie',
        roseType: 'radius',
        radius: ['18%', '72%'],
        center: ['50%', '46%'],
        itemStyle: { borderRadius: 6, borderColor: getChartTooltipBg(), borderWidth: 2 },
        label: { color: getChartTextColor(), fontSize: 11 },
        labelLine: { lineStyle: { color: getChartTextColor() } },
        data,
      },
    ]
    const userOption: any = option ?? {}
    const { series: userSeries, tooltip: userTooltip, legend: userLegend, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series
    return {
      color: getChartColors(),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: getChartTextColor() },
        },
        userLegend,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  let chart: any = null

  $effect(() => {
    if (!container) return
    chart = echarts.init(container)
    // Autoresize (the vue-echarts `:autoresize` equivalent).
    const ro = new ResizeObserver(() => chart?.resize())
    ro.observe(container)
    const unwatchTheme = watchThemeChange(() => {
      themeTick++
    })
    return () => {
      unwatchTheme()
      ro.disconnect()
      chart?.dispose()
      chart = null
    }
  })

  $effect(() => {
    const opt = mergedOption
    chart?.setOption(opt, true)
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex: chart is intentionally focusable (mirrors the Vue twin) -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={container} class="size-full"></div>
</div>
