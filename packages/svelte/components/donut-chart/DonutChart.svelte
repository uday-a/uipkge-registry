<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
    data: { name: string; value: number }[]
    /** 'full' ring or 'half' semicircle gauge. Default 'full'. */
    type?: 'full' | 'half'
    /** Ring thickness as a fraction of the outer radius (0 = filled pie). Default 0.32. */
    thickness?: number
    /** Segment corner rounding in px. Default 6. */
    rounded?: number
    /** Gap between segments in degrees. Default 2. */
    gap?: number
    /** Show the summed total in the centre. Default true. */
    showTotal?: boolean
    /** Centre label override (replaces the auto total). */
    centerLabel?: string
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
  import { PieChart as EChartsPieChart } from 'echarts/charts'
  import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { mergeOptionBlock, observeThemeBump, resolveChartTheme } from './chart-theme'

  use([CanvasRenderer, EChartsPieChart, TooltipComponent, LegendComponent, TitleComponent])

  let {
    class: className,
    data,
    type = 'full',
    thickness = 0.32,
    rounded = 6,
    gap = 2,
    showTotal = true,
    centerLabel,
    height = 300,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: DonutChartProps = $props()

  let container = $state<HTMLDivElement | null>(null)
  let chart = $state<ECharts | null>(null)

  let themeTick = $state(0)
  $effect(() => observeThemeBump(() => themeTick++))

  const theme = $derived.by(() => {
    themeTick
    return resolveChartTheme()
  })

  const total = $derived(data.reduce((s, d) => s + d.value, 0))
  const summary = $derived(centerLabel ?? String(total))

  const mergedOption = $derived.by(() => {
    const half = type === 'half'
    const outer = half ? 82 : 78
    const inner = Math.max(0, +(outer * (1 - Math.max(0, Math.min(0.95, thickness)))).toFixed(1))
    const series = [
      {
        type: 'pie',
        radius: [`${inner}%`, `${outer}%`],
        center: half ? ['50%', '68%'] : ['50%', '46%'],
        startAngle: half ? 180 : 90,
        endAngle: half ? 360 : undefined,
        padAngle: gap,
        itemStyle: { borderRadius: rounded, borderColor: theme.tooltipBg, borderWidth: 2 },
        label: { show: !half, color: theme.textColor, fontSize: 11 },
        labelLine: { show: !half, lineStyle: { color: theme.textColor } },
        emphasis: { scale: true, scaleSize: 3 },
        data,
      },
    ]
    const userOption: any = option ?? {}
    const { series: userSeries, tooltip: userTooltip, legend: userLegend, title: userTitle, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series
    return {
      color: theme.colors,
      title: showTotal
        ? mergeOptionBlock(
            {
              text: summary,
              left: 'center',
              top: half ? '62%' : '42%',
              textStyle: { fontSize: 26, fontWeight: 700, color: theme.textColor },
            },
            userTitle,
          )
        : undefined,
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          valueFormatter: (v: any) => `${v} (${((v / (total || 1)) * 100).toFixed(1)}%)`,
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: theme.textColor },
        },
        userLegend,
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
  aria-label={ariaLabel || `Donut chart, total ${total}`}
  style:height={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={container} class="size-full"></div>
</div>
