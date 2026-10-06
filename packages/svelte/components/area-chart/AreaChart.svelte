<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AreaChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    yField?: string | string[]
    /** Line interpolation. Default 'smooth'. */
    curve?: 'smooth' | 'linear' | 'step' | 'stepStart' | 'stepEnd'
    /** Stack series cumulatively. Default false. */
    stacked?: boolean
    /** Show point markers. Default false. */
    markers?: boolean
    /** Dashed stroke on all series (forecast look). Default false. */
    dashed?: boolean
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { use, init, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { LineChart as EChartsLineChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    getChartColors,
    getChartTextColor,
    getChartAxisColor,
    getChartSplitLineColor,
    getChartTooltipBg,
    getChartTooltipBorder,
    getChartTooltipText,
    mergeOptionBlock,
  } from './useChartTheme'

  use([CanvasRenderer, EChartsLineChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    data,
    xField = 'x',
    yField = 'y',
    curve = 'smooth',
    stacked = false,
    markers = false,
    dashed = false,
    height = 300,
    option,
    class: className,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: AreaChartProps = $props()

  // Re-read CSS-driven palette whenever `<html>` class/style changes (the
  // typical shadcn dark-mode pivot) so the canvas re-paints with the new theme.
  let themeTick = $state(0)

  $effect(() => {
    const observer = new MutationObserver(() => {
      themeTick += 1
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    return () => observer.disconnect()
  })

  const mergedOption = $derived.by(() => {
    themeTick
    const chartColors = getChartColors()
    const chartTextColor = getChartTextColor()
    const chartAxisColor = getChartAxisColor()
    const chartSplitLineColor = getChartSplitLineColor()
    const chartTooltipBg = getChartTooltipBg()
    const chartTooltipBorder = getChartTooltipBorder()
    const chartTooltipText = getChartTooltipText()

    const fields = Array.isArray(yField) ? yField : [yField]
    const xData = data.map((d) => d[xField!])

    const series = fields.map((field, i) => ({
      name: field,
      type: 'line',
      smooth: curve === 'smooth',
      step:
        curve === 'step'
          ? 'middle'
          : curve === 'stepStart'
            ? 'start'
            : curve === 'stepEnd'
              ? 'end'
              : false,
      stack: stacked ? 'areas' : undefined,
      symbol: markers ? 'circle' : 'none',
      symbolSize: 6,
      areaStyle: { opacity: stacked ? 0.5 : 0.15 },
      lineStyle: { width: 2, type: dashed ? 'dashed' : 'solid' },
      itemStyle: { color: chartColors[i % chartColors.length] },
      data: data.map((d) => d[field]),
    }))

    // Deep-merge `series[i]` from `option` so consumers can pass partial
    // overrides (e.g. `series: [{ stack: 'r' }, ...]`) without clobbering the
    // computed `type`/`data`. Top-level option blocks (xAxis, yAxis, grid,
    // tooltip, legend) go through `mergeOptionBlock` so overrides like
    // `xAxis: { axisLabel: { fontSize: 9 } }` only replace the axisLabel
    // inner fields they touch, not the whole axisLabel (and never the data).
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

    // Single-series charts hide the legend explicitly so ECharts' default
    // doesn't dump the y-field name (e.g. "y") onto the chart canvas.
    const baseLegend: any =
      fields.length > 1
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: chartTextColor },
          }
        : { show: false }

    return {
      color: chartColors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: fields.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: chartTooltipBg,
          borderColor: chartTooltipBorder,
          textStyle: { color: chartTooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend, userLegend),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: xData,
          axisLine: { lineStyle: { color: chartAxisColor } },
          axisLabel: { color: chartTextColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: chartSplitLineColor } },
          axisLabel: { color: chartTextColor, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  let chartEl: HTMLDivElement | null = $state(null)
  let chart: ECharts | null = null

  $effect(() => {
    if (!chartEl) return
    chart ??= init(chartEl)
    chart.setOption(mergedOption)
  })

  $effect(() => {
    if (!chartEl) return
    const ro = new ResizeObserver(() => chart?.resize())
    ro.observe(chartEl)
    return () => ro.disconnect()
  })

  onDestroy(() => {
    chart?.dispose()
    chart = null
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- Focusable by design: keyboard and screen-reader users land on the labelled chart region. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
