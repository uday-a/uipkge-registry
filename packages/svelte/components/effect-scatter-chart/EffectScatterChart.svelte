<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface EffectScatterChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    yField?: string
    categoryField?: string
    /** Ripple animation period in seconds. Default 4. */
    ripplePeriod?: number
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { EffectScatterChart as EChartsEffectScatter } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { mergeOptionBlock, observeThemeBump, resolveChartTheme } from './chart-theme'

  use([CanvasRenderer, EChartsEffectScatter, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    xField = 'x',
    yField = 'y',
    categoryField,
    ripplePeriod = 4,
    height = 300,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: EffectScatterChartProps = $props()

  let container = $state<HTMLDivElement | null>(null)
  let chart = $state<ECharts | null>(null)

  let themeTick = $state(0)
  $effect(() => observeThemeBump(() => themeTick++))

  const theme = $derived.by(() => {
    themeTick
    return resolveChartTheme()
  })

  const mergedOption = $derived.by(() => {
    const categories = categoryField ? [...new Set(data.map((d) => d[categoryField]))] : ['default']
    const series = categories.map((cat, i) => ({
      name: String(cat),
      type: 'effectScatter',
      showEffectOn: 'render',
      rippleEffect: { brushType: 'stroke', period: ripplePeriod, scale: 3 },
      symbolSize: 12,
      itemStyle: {
        color: theme.colors[i % theme.colors.length],
        shadowBlur: 8,
        shadowColor: theme.colors[i % theme.colors.length],
      },
      data: (categoryField ? data.filter((d) => d[categoryField] === cat) : data).map((d) => [d[xField], d[yField]]),
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

    return {
      color: theme.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: categories.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend:
        categories.length > 1
          ? mergeOptionBlock(
              {
                bottom: 0,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: { fontSize: 11, color: theme.textColor },
              },
              userLegend,
            )
          : undefined,
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: theme.axisColor } },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
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
    const el = container
    if (!el) return
    const instance = init(el)
    chart = instance
    instance.setOption(untrack(() => mergedOption), { notMerge: true })
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (untrack(() => chart) === instance) chart = null
    }
  })

  $effect(() => {
    const opt = mergedOption
    untrack(() => chart)?.setOption(opt, { notMerge: true, lazyUpdate: true })
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

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
