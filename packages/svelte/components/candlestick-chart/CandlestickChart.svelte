<script lang="ts" module>
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { CandlestickChart as EChartsCandlestickChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components'

  use([CanvasRenderer, EChartsCandlestickChart, GridComponent, TooltipComponent, DataZoomComponent])

  export interface Candle {
    date: string
    open: number
    close: number
    low: number
    high: number
  }

  export interface CandlestickChartProps {
    data: Candle[]
    height?: number | string
    /** Show the bottom data-zoom slider. Default false. */
    zoom?: boolean
    option?: any
    class?: string
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { onMount, untrack } from 'svelte'
  import { init, type ECharts } from 'echarts/core'
  import { cn } from '$lib/utils'
  import { getChartTheme, heightToStyle, mergeOptionBlock } from './chart-theme'

  let {
    data,
    height = 320,
    zoom = false,
    option = undefined,
    class: className,
    ariaLabel = undefined,
    ref = $bindable(null),
  }: CandlestickChartProps = $props()

  // Re-resolve CSS-variable colors when <html> class/style changes (the
  // typical dark-mode pivot) and once after first paint so post-hydration
  // reads see resolved values instead of SSR fallbacks.
  let themeKey = $state(0)
  onMount(() => {
    const raf = requestAnimationFrame(() => {
      themeKey++
    })
    const obs = new MutationObserver(() => {
      themeKey++
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  })

  const theme = $derived.by(() => {
    themeKey
    return getChartTheme()
  })

  const mergedOption = $derived.by(() => {
    const t = theme
    // ECharts candle data shape: [open, close, low, high].
    const candleData = data.map((c) => [c.open, c.close, c.low, c.high])
    const dates = data.map((c) => c.date)

    const series = [
      {
        type: 'candlestick',
        data: candleData,
        itemStyle: {
          // Bullish (close >= open) -> teal (chart-2). Bearish -> orange (chart-4).
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
          data: dates,
          axisLine: { lineStyle: { color: t.axisColor } },
          axisLabel: { color: t.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: t.splitLineColor } },
          axisLabel: { color: t.textColor, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      dataZoom: zoom ? [{ type: 'slider', bottom: 8, height: 18 }, { type: 'inside' }] : undefined,
      series: mergedSeries,
      ...userRest,
    }
  })

  let chartEl: HTMLDivElement | null = $state(null)
  let instance: ECharts | null = null

  $effect(() => {
    const el = chartEl
    if (!el) return
    instance = init(el)
    instance.setOption(untrack(() => mergedOption))
    const ro = new ResizeObserver(() => instance?.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      instance?.dispose()
      instance = null
    }
  })

  $effect(() => {
    const opt = mergedOption
    if (instance) instance.setOption(opt, { notMerge: true, lazyUpdate: true })
  })
</script>

<div bind:this={ref} role="img" aria-label={ariaLabel || 'Chart'} style={`height: ${heightToStyle(height)}`} class={cn('w-full', className)}>
  <div bind:this={chartEl} class="size-full"></div>
</div>
