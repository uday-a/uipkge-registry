<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SlopeChartProps extends HTMLAttributes<HTMLDivElement> {
    /** One line per entry. Two values = slope chart, more = bump chart. */
    data: { label: string; values: number[] }[]
    /** Point labels, e.g. ['2024', '2025'] or quarterly ranks. */
    points: string[]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { LineChart as EChartsLineChart } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { use, init, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { cn } from '$lib/utils'
  import {
    getChartAxisColor,
    getChartColors,
    getChartTextColor,
    getChartTooltipBg,
    getChartTooltipBorder,
    getChartTooltipText,
    mergeOptionBlock,
    subscribeTheme,
  } from './useChartTheme'

  use([CanvasRenderer, EChartsLineChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    points,
    height = 320,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: SlopeChartProps = $props()

  let container: HTMLDivElement | null = $state(null)
  let chart: ECharts | null = $state(null)
  // Bumped by the theme subscription so the option re-resolves CSS tokens on dark/light flips.
  let themeKey = $state(0)

  $effect(() => {
    ref = container
  })

  $effect(() => {
    if (!container || typeof window === 'undefined') return
    const instance = init(container)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(container)
    const unsubscribe = subscribeTheme(() => {
      themeKey += 1
    })
    return () => {
      unsubscribe()
      ro.disconnect()
      instance.dispose()
      chart = null
    }
  })

  const mergedOption = $derived.by(() => {
    themeKey
    const colors = getChartColors()
    const textColor = getChartTextColor()
    const series = data.map((d, i) => ({
      name: d.label,
      type: 'line',
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 2, color: colors[i % colors.length] },
      itemStyle: { color: colors[i % colors.length] },
      label: {
        show: true,
        position: i % 2 ? 'right' : 'left',
        color: textColor,
        fontSize: 10,
        formatter: '{a}',
      },
      endLabel: { show: true, color: textColor, fontSize: 10, formatter: '{a}' },
      data: d.values,
    }))
    const userOption: any = option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      grid: mergeOptionBlock({ left: 16, right: 64, top: 24, bottom: 24, containLabel: false }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock({ show: false }, userLegend),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          boundaryGap: false,
          data: points,
          axisLine: { lineStyle: { color: getChartAxisColor() } },
          axisLabel: { color: textColor, fontSize: 11, fontWeight: 600 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock({ type: 'value', show: false, splitLine: { show: false } }, userYAxis),
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (chart) chart.setOption(mergedOption, { notMerge: true })
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- focusable chart mirrors the Vue twin (keyboard focus ring on the chart image). -->
<div
  bind:this={container}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style="height:{heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
</div>
