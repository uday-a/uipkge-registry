<script lang="ts" module>
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart as EChartsBarChart } from 'echarts/charts'
  import { PolarComponent, TooltipComponent, LegendComponent } from 'echarts/components'
  import type { HTMLAttributes } from 'svelte/elements'

  use([CanvasRenderer, EChartsBarChart, PolarComponent, TooltipComponent, LegendComponent])

  export interface PolarBarChartProps extends HTMLAttributes<HTMLDivElement> {
    data: { category: string; value: number }[]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init as initChart } from 'echarts/core'
  import type { ECharts } from 'echarts/core'
  import { cn } from '$lib/utils'
  import {
    getChartColors,
    getChartTextColor,
    getChartTooltipBg,
    getChartTooltipBorder,
    getChartTooltipText,
    mergeOptionBlock,
  } from './useChartTheme.svelte'

  let {
    class: className,
    data,
    height = 320,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: PolarBarChartProps = $props()

  function buildOption() {
    const series = [
      {
        type: 'bar',
        coordinateSystem: 'polar',
        data: data.map((d) => d.value),
        colorBy: 'data',
        roundCap: true,
        itemStyle: { borderRadius: 6 },
      },
    ]

    const userOption: any = option ?? {}
    const {
      series: userSeries,
      polar: userPolar,
      angleAxis: userAngle,
      radiusAxis: userRadius,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    const chartColors = getChartColors()
    const chartTextColor = getChartTextColor()

    return {
      color: chartColors,
      polar: mergeOptionBlock({ radius: ['18%', '78%'] }, userPolar),
      angleAxis: mergeOptionBlock(
        { type: 'value', startAngle: 90, axisLabel: { color: chartTextColor, fontSize: 10 } },
        userAngle,
      ),
      radiusAxis: mergeOptionBlock(
        {
          type: 'category',
          data: data.map((d) => d.category),
          axisLabel: { color: chartTextColor, fontSize: 11 },
        },
        userRadius,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock({ show: false }, userLegend),
      series: mergedSeries,
      ...userRest,
    }
  }

  const mergedOption = $derived(buildOption())

  let container = $state<HTMLDivElement | null>(null)
  let chart: ECharts | null = null

  $effect(() => {
    if (!container) return
    const instance = initChart(container)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(container)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption)
  })
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex: chart is deliberately focusable so keyboard users reach the labelled image -->
<div
  {...restProps}
  bind:this={ref}
  data-uipkge=""
  data-slot="polar-bar-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={/^\d+$/.test(String(height)) ? `${height}px` : String(height)}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
>
  <div bind:this={container} class="size-full"></div>
</div>
