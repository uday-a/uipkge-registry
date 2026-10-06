<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface HistogramBin {
    bin: string
    count: number
  }

  export interface HistogramChartProps extends HTMLAttributes<HTMLDivElement> {
    /** Pre-binned data. Pass raw numbers via `values` + `bins` instead. */
    data?: HistogramBin[]
    /** Raw values to bin automatically. Ignored when `data` is set. */
    values?: number[]
    /** Bin count for auto-binning. Default 12. */
    bins?: number
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
  }
</script>

<script lang="ts">
  // @ts-ignore: echarts is a consumer dependency (see histogram-chart.registry.ts) and is not installed in this package.
  import { use, init } from 'echarts/core'
  // @ts-ignore: echarts is a consumer dependency (see histogram-chart.registry.ts) and is not installed in this package.
  import { CanvasRenderer } from 'echarts/renderers'
  // @ts-ignore: echarts is a consumer dependency (see histogram-chart.registry.ts) and is not installed in this package.
  import { BarChart as EChartsBarChart } from 'echarts/charts'
  // @ts-ignore: echarts is a consumer dependency (see histogram-chart.registry.ts) and is not installed in this package.
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
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

  use([CanvasRenderer, EChartsBarChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    values,
    bins = 12,
    height = 300,
    option,
    ariaLabel,
    ...restProps
  }: HistogramChartProps = $props()

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

  const binned = $derived.by((): HistogramBin[] => {
    if (data?.length) return data
    const vals = values ?? []
    if (!vals.length) return []
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const span = max - min || 1
    const n = Math.max(1, bins)
    const counts: number[] = Array(n).fill(0)
    for (const v of vals) counts[Math.min(n - 1, Math.floor(((v - min) / span) * n))]++
    return counts.map((count, i) => ({
      bin: `${(min + (span * i) / n).toFixed(1)}–${(min + (span * (i + 1)) / n).toFixed(1)}`,
      count,
    }))
  })

  const mergedOption = $derived.by(() => {
    const t = theme
    const rows = binned
    const peak = rows.reduce((m, d, i) => (d.count > (rows[m]?.count ?? -1) ? i : m), 0)
    const series = [
      {
        type: 'bar',
        barCategoryGap: '2%',
        itemStyle: {
          color: (p: any) => (p.dataIndex === peak ? t.colors[0] : t.colors[2]),
          borderRadius: [3, 3, 3, 3],
        },
        data: rows.map((d) => d.count),
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
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: t.tooltipBg,
          borderColor: t.tooltipBorder,
          textStyle: { color: t.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: rows.map((d) => d.bin),
          axisLine: { lineStyle: { color: t.axis } },
          axisLabel: { color: t.text, fontSize: 10, rotate: 30 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: t.splitLine } },
          axisLabel: { color: t.text, fontSize: 11 },
        },
        userYAxis,
      ),
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
  data-slot="histogram-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  {...restProps}
  style="height: {heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
>
  <div bind:this={viewport} class="size-full"></div>
</div>
