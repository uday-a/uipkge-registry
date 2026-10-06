<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface GaugeChartProps extends HTMLAttributes<HTMLDivElement> {
    value: number
    min?: number
    max?: number
    unit?: string
    label?: string
    height?: number | string
    /** Colour stops as [percentage, hex] pairs. Default: teal->amber->red,
     *  pulled from `gaugeThresholds` in useChartTheme so the safe-zone
     *  colour ties back to the dashboard palette. Pass your own to override. */
    thresholds?: [number, string][]
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init as echartsInit, use as echartsUse, type ECharts, type EChartsCoreOption } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { GaugeChart as EChartsGaugeChart } from 'echarts/charts'
  import { TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    chartColors,
    chartTextColor,
    chartTooltipBg,
    chartTooltipBorder,
    chartTooltipText,
    gaugeThresholds,
  } from './useChartTheme.svelte'

  echartsUse([CanvasRenderer, EChartsGaugeChart, TooltipComponent])

  let {
    class: className,
    value,
    min = 0,
    max = 100,
    unit = '',
    label,
    height = 220,
    thresholds = gaugeThresholds,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: GaugeChartProps = $props()

  let chart = $state<ECharts | null>(null)
  let chartEl = $state<HTMLDivElement | null>(null)

  const mergedOption = $derived.by((): EChartsCoreOption => {
    const series = [
      {
        type: 'gauge',
        min,
        max,
        center: ['50%', '60%'],
        radius: '85%',
        startAngle: 200,
        endAngle: -20,
        progress: { show: true, width: 14, itemStyle: { color: chartColors()[0] } },
        pointer: { show: true, length: '55%', width: 4, itemStyle: { color: chartColors()[0] } },
        axisLine: {
          lineStyle: {
            width: 14,
            color: thresholds.map(([stop, color]) => [stop, color] as [number, string]),
          },
        },
        axisTick: { distance: -22, length: 4, lineStyle: { color: chartTextColor(), width: 1 } },
        splitLine: { distance: -26, length: 8, lineStyle: { color: chartTextColor(), width: 2 } },
        axisLabel: { color: chartTextColor(), fontSize: 10, distance: -34 },
        anchor: { show: false },
        title: {
          offsetCenter: [0, '88%'],
          color: chartTextColor(),
          fontSize: 11,
          fontWeight: 500,
        },
        detail: {
          valueAnimation: true,
          formatter: `{value}${unit ? ' ' + unit : ''}`,
          color: chartColors()[0],
          fontSize: 28,
          fontWeight: 700,
          offsetCenter: [0, '40%'],
        },
        data: [{ value, name: label ?? '' }],
      },
    ]

    // Per-index series merge — partial overrides keep computed `type`/`data`.
    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      tooltip: {
        formatter: '{b}: {c}' + (unit ? ` ${unit}` : ''),
        backgroundColor: chartTooltipBg(),
        borderColor: chartTooltipBorder(),
        textStyle: { color: chartTooltipText(), fontSize: 12 },
      },
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (!chartEl) return
    const el = chartEl
    const instance = echartsInit(el)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption, { notMerge: true })
  })
</script>

<!-- tabindex on role=img mirrors the Vue twin: keyboard users can focus the
     chart; the focus ring aids orientation. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style={`height: ${/^\d+$/.test(String(height)) ? `${height}px` : String(height)}`}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  data-uipkge
  data-slot="gauge-chart"
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
