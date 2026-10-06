<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PictorialBarDatum {
    category: string
    value: number
  }

  export interface PictorialBarChartProps extends HTMLAttributes<HTMLDivElement> {
    data: PictorialBarDatum[]
    /** ECharts symbol for the repeated pictogram. Default 'rect'. */
    symbol?: string
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use, type EChartsType } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { PictorialBarChart as EChartsPictorialBar } from 'echarts/charts'
  import { GridComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTheme, mergeOptionBlock } from './useChartTheme'

  use([CanvasRenderer, EChartsPictorialBar, GridComponent, TooltipComponent])

  let {
    class: className,
    data,
    symbol = 'rect',
    height = 300,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: PictorialBarChartProps = $props()

  let chartEl: HTMLDivElement | null = $state(null)
  let chart: EChartsType | null = $state(null)

  const heightStyle = $derived(`height: ${/^\d+$/.test(String(height)) ? `${height}px` : String(height)}`)

  const mergedOption: any = $derived.by(() => {
    const theme = $chartTheme
    const max = Math.max(...data.map((d) => d.value), 1)
    const series = [
      {
        type: 'pictorialBar',
        symbol,
        symbolRepeat: true,
        symbolSize: [12, 8],
        symbolMargin: 2,
        symbolClip: true,
        itemStyle: { color: theme.colors[0] },
        data: data.map((d) => ({ value: d.value, symbolBoundingData: max })),
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
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: data.map((d) => d.category),
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          max,
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (!chartEl) return
    const instance = init(chartEl)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(chartEl)
    return () => {
      ro.disconnect()
      instance.dispose()
      chart = null
    }
  })

  $effect(() => {
    if (chart) chart.setOption(mergedOption, { notMerge: true })
  })
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- focusable by design (Vue twin has tabindex=0 too). -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  data-uipkge
  data-slot="pictorial-bar-chart"
  style={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
