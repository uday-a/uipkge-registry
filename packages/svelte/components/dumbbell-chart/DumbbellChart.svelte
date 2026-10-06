<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DumbbellChartProps extends HTMLAttributes<HTMLDivElement> {
    /** One row per category: compare `a` vs `b`. */
    data: { label: string; a: number; b: number }[]
    /** Series names for [a, b]. Default ['Before', 'After']. */
    names?: [string, string]
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
  import { CustomChart as EChartsCustomChart } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { mergeOptionBlock, observeThemeBump, resolveChartTheme } from './chart-theme'

  use([CanvasRenderer, EChartsCustomChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    names = ['Before', 'After'],
    height = 300,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: DumbbellChartProps = $props()

  let container = $state<HTMLDivElement | null>(null)
  let chart = $state<ECharts | null>(null)

  let themeTick = $state(0)
  $effect(() => observeThemeBump(() => themeTick++))

  const theme = $derived.by(() => {
    themeTick
    return resolveChartTheme()
  })

  const mergedOption = $derived.by(() => {
    const colorA = theme.colors[2]
    const colorB = theme.colors[0]
    const series = [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const y = api.coord([0, params.dataIndex])[1]
          const a = api.coord([api.value(0), params.dataIndex])
          const b = api.coord([api.value(1), params.dataIndex])
          return {
            type: 'group',
            children: [
              {
                type: 'line',
                shape: { x1: a[0], y1: y, x2: b[0], y2: y },
                style: { stroke: theme.axisColor, lineWidth: 2 },
              },
              { type: 'circle', shape: { cx: a[0], cy: y, r: 6 }, style: { fill: colorA } },
              { type: 'circle', shape: { cx: b[0], cy: y, r: 6 }, style: { fill: colorB } },
            ],
          }
        },
        data: data.map((d) => [d.a, d.b]),
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
      grid: mergeOptionBlock({ left: 16, right: 16, top: 32, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (p: any) =>
            `${data[p.dataIndex]?.label}<br/>${names[0]}: ${p.value[0]}<br/>${names[1]}: ${p.value[1]}`,
        },
        userTooltip,
      ),
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11, color: theme.textColor },
        data: [
          { name: names[0], itemStyle: { color: colorA } },
          { name: names[1], itemStyle: { color: colorB } },
        ],
      },
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: data.map((d) => d.label),
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisTick: { show: false },
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
