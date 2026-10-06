<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PieChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    nameField?: string
    valueField?: string
    height?: number | string
    donut?: boolean
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use, type EChartsType } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { PieChart as EChartsPieChart } from 'echarts/charts'
  import { LegendComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTheme } from './useChartTheme'

  use([CanvasRenderer, EChartsPieChart, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    nameField = 'name',
    valueField = 'value',
    height = 300,
    donut = false,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: PieChartProps = $props()

  let chartEl: HTMLDivElement | null = $state(null)
  let chart: EChartsType | null = $state(null)

  const heightStyle = $derived(`height: ${/^\d+$/.test(String(height)) ? `${height}px` : String(height)}`)

  const mergedOption: any = $derived.by(() => {
    const theme = $chartTheme
    const chartData = data.map((d) => ({
      name: d[nameField],
      value: d[valueField],
    }))

    const series = [
      {
        type: 'pie',
        radius: donut ? ['45%', '70%'] : '65%',
        center: ['50%', '45%'],
        itemStyle: { borderWidth: 0 },
        label: { show: false },
        data: chartData,
      },
    ]

    // Per-index series merge — partial overrides keep computed `type`/`data`.
    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11 },
      },
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
  data-slot="pie-chart"
  style={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
