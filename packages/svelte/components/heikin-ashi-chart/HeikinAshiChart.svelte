<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface Candle {
    date: string
    open: number
    close: number
    low: number
    high: number
  }

  export interface HeikinAshiChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Candle[]
    height?: number | string
    /** Show the bottom data-zoom slider. Default false. */
    zoom?: boolean
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
  }
</script>

<script lang="ts">
  // @ts-ignore: echarts is a consumer dependency (see heikin-ashi-chart.registry.ts) and is not installed in this package.
  import { use, init } from 'echarts/core'
  // @ts-ignore: echarts is a consumer dependency (see heikin-ashi-chart.registry.ts) and is not installed in this package.
  import { CanvasRenderer } from 'echarts/renderers'
  // @ts-ignore: echarts is a consumer dependency (see heikin-ashi-chart.registry.ts) and is not installed in this package.
  import { CandlestickChart as EChartsCandlestickChart } from 'echarts/charts'
  // @ts-ignore: echarts is a consumer dependency (see heikin-ashi-chart.registry.ts) and is not installed in this package.
  import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    mergeOptionBlock,
    resolveChartAxisColor,
    resolveChartColors,
    resolveChartSplitLineColor,
    resolveChartTextColor,
    resolveChartTooltipBg,
    resolveChartTooltipBorder,
    resolveChartTooltipText,
    watchTheme,
  } from './chart-theme'

  use([CanvasRenderer, EChartsCandlestickChart, GridComponent, TooltipComponent, DataZoomComponent])

  let {
    class: className,
    data,
    height = 320,
    zoom = false,
    option,
    ariaLabel,
    ...restProps
  }: HeikinAshiChartProps = $props()

  let themeKey = $state(0)
  $effect(() => watchTheme(() => (themeKey += 1)))

  const theme = $derived.by(() => {
    themeKey // re-resolve CSS tokens when the theme flips
    return {
      colors: resolveChartColors(),
      text: resolveChartTextColor(),
      axis: resolveChartAxisColor(),
      splitLine: resolveChartSplitLineColor(),
      tooltipBg: resolveChartTooltipBg(),
      tooltipBorder: resolveChartTooltipBorder(),
      tooltipText: resolveChartTooltipText(),
    }
  })

  // Heikin-Ashi: each candle averages the previous one, filtering market
  // noise so trends read as uninterrupted bull/bear runs.
  const ha = $derived.by(() => {
    let prevOpen = data[0]?.open ?? 0
    let prevClose = data[0]?.close ?? 0
    return data.map((c) => {
      const haClose = (c.open + c.high + c.low + c.close) / 4
      const haOpen = (prevOpen + prevClose) / 2
      const haHigh = Math.max(c.high, haOpen, haClose)
      const haLow = Math.min(c.low, haOpen, haClose)
      prevOpen = haOpen
      prevClose = haClose
      return {
        date: c.date,
        open: +haOpen.toFixed(2),
        close: +haClose.toFixed(2),
        low: +haLow.toFixed(2),
        high: +haHigh.toFixed(2),
      }
    })
  })

  const mergedOption = $derived.by(() => {
    const t = theme
    const candles = ha
    const series = [
      {
        type: 'candlestick',
        data: candles.map((c) => [c.open, c.close, c.low, c.high]),
        itemStyle: {
          color: t.colors[1],
          color0: t.colors[3],
          borderColor: t.colors[1],
          borderColor0: t.colors[3],
        },
      },
    ]
    const userOption: any = option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series
    return {
      color: t.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: zoom ? 60 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          backgroundColor: t.tooltipBg,
          borderColor: t.tooltipBorder,
          textStyle: { color: t.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: candles.map((c) => c.date),
          axisLine: { lineStyle: { color: t.axis } },
          axisLabel: { color: t.text, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: t.splitLine } },
          axisLabel: { color: t.text, fontSize: 11 },
        },
        userYAxis,
      ),
      dataZoom: zoom ? [{ type: 'slider', bottom: 8, height: 18 }, { type: 'inside' }] : undefined,
      series: mergedSeries,
      ...userRest,
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
  data-slot="heikin-ashi-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Heikin-Ashi chart'}
  {...restProps}
  style="height: {heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
>
  <div bind:this={viewport} class="size-full"></div>
</div>
