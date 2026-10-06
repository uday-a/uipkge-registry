<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ScatterChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    yField?: string
    sizeField?: string
    categoryField?: string
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { use, init } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { ScatterChart as EChartsScatterChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    chartColors,
    chartTextColor,
    chartAxisColor,
    chartSplitLineColor,
    chartTooltipBg,
    chartTooltipBorder,
    chartTooltipText,
    mergeOptionBlock,
  } from './chart-theme'

  use([CanvasRenderer, EChartsScatterChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    xField = 'x',
    yField = 'y',
    sizeField,
    categoryField,
    height = 300,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: ScatterChartProps = $props()

  let chartEl: HTMLDivElement | null = $state(null)
  let themeTick = $state(0)

  // Bump whenever <html> class/style changes (the typical shadcn dark-mode
  // pivot) so the option below re-resolves and the chart re-paints.
  $effect(() => {
    if (typeof window === 'undefined') return
    const raf = requestAnimationFrame(() => themeTick++)
    const mo = new MutationObserver(() => themeTick++)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
    }
  })

  const mergedOption = $derived.by(() => {
    void themeTick
    const palette = chartColors()
    const categories = categoryField ? [...new Set(data.map((d) => d[categoryField!]))] : ['default']

    const series = categories.map((cat, i) => ({
      name: cat,
      type: 'scatter',
      symbolSize: (val: any[]) => (sizeField ? Math.sqrt(val[2]) * 3 + 4 : 10),
      itemStyle: { color: palette[i % palette.length] },
      data: categoryField
        ? data
            .filter((d) => d[categoryField!] === cat)
            .map((d) => [d[xField!], d[yField!], sizeField ? d[sizeField] : 0])
        : data.map((d) => [d[xField!], d[yField!], sizeField ? d[sizeField] : 0]),
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
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    const baseLegend =
      categories.length > 1
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: chartTextColor() },
          }
        : undefined

    return {
      color: palette,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: categories.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: chartTooltipBg(),
          borderColor: chartTooltipBorder(),
          textStyle: { color: chartTooltipText(), fontSize: 12 },
          formatter: (params: any) =>
            `${params.seriesName}<br/>${xField}: ${params.value[0]}<br/>${yField}: ${params.value[1]}`,
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend ?? {}, userLegend),
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: chartSplitLineColor() } },
          axisLabel: { color: chartTextColor(), fontSize: 11 },
          axisLine: { lineStyle: { color: chartAxisColor() } },
          axisTick: { show: false },
          scale: true,
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: chartSplitLineColor() } },
          axisLabel: { color: chartTextColor(), fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  // ECharts instance owned by the mount effect below; the option effect only
  // ever calls setOption on it (never init twice — that logs a console warning).
  let chartInstance: { setOption: (opt: any, opts?: any) => void; resize: () => void; dispose: () => void } | null =
    null

  $effect(() => {
    if (!chartEl || typeof window === 'undefined') return
    const chart = init(chartEl)
    chartInstance = chart
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(chartEl)
    return () => {
      ro.disconnect()
      chart.dispose()
      chartInstance = null
    }
  })

  $effect(() => {
    chartInstance?.setOption(mergedOption, { notMerge: false })
  })
</script>

<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style="height: {/^\d+$/.test(String(height)) ? `${height}px` : String(height)};"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
