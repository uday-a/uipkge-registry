<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface GanttTask {
    name: string
    /** ISO date strings. */
    start: string
    end: string
    /** 0..1 fraction shaded darker as progress. */
    progress?: number
    group?: string
  }

  export interface GanttMilestone {
    /** Task name to pin the diamond to. */
    task: string
    /** ISO date string. */
    date: string
    label?: string
  }

  export interface GanttChartProps extends HTMLAttributes<HTMLDivElement> {
    tasks: GanttTask[]
    /** Diamond markers pinned to tasks. */
    milestones?: GanttMilestone[]
    /** ISO date for a dashed "today" line. Pass explicitly (no implicit now() so SSR stays deterministic). */
    today?: string
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init as echartsInit, use as echartsUse, type ECharts, type EChartsCoreOption } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { CustomChart as EChartsCustomChart } from 'echarts/charts'
  import {
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    MarkPointComponent,
    TooltipComponent,
  } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    chartAxisColor,
    chartColors,
    chartSplitLineColor,
    chartTextColor,
    chartTooltipBg,
    chartTooltipBorder,
    chartTooltipText,
    mergeOptionBlock,
  } from './useChartTheme.svelte'

  echartsUse([
    CanvasRenderer,
    EChartsCustomChart,
    GridComponent,
    TooltipComponent,
    MarkPointComponent,
    MarkLineComponent,
    LegendComponent,
  ])

  let {
    class: className,
    tasks,
    milestones,
    today,
    height = 320,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: GanttChartProps = $props()

  let chart = $state<ECharts | null>(null)
  let chartEl = $state<HTMLDivElement | null>(null)

  const mergedOption = $derived.by((): EChartsCoreOption => {
    const groups = [...new Set(tasks.map((t) => t.group ?? 'default'))]
    const colorOf = (t: GanttTask) => chartColors()[groups.indexOf(t.group ?? 'default') % chartColors().length]
    const series = [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const i: number = params.dataIndex
          const t = tasks[i]!
          const start = api.coord([api.value(0), i])
          const end = api.coord([api.value(1), i])
          const h = Math.max(8, api.size!([0, 1])[1] * 0.55)
          const p = Math.max(0, Math.min(1, t.progress ?? 1))
          return {
            type: 'group',
            children: [
              {
                type: 'rect',
                shape: { x: start[0], y: start[1] - h / 2, width: Math.max(2, end[0] - start[0]), height: h, r: 4 },
                style: { fill: colorOf(t), opacity: 0.3 },
              },
              {
                type: 'rect',
                shape: {
                  x: start[0],
                  y: start[1] - h / 2,
                  width: Math.max(2, (end[0] - start[0]) * p),
                  height: h,
                  r: 4,
                },
                style: { fill: colorOf(t) },
              },
            ],
          }
        },
        encode: { x: [0, 1], y: 2 },
        data: tasks.map((t, i) => [t.start, t.end, i]),
        markPoint: milestones?.length
          ? {
              symbol: 'diamond',
              symbolSize: 13,
              itemStyle: { color: chartColors()[3], borderColor: chartTooltipBg(), borderWidth: 1.5 },
              label: {
                show: true,
                fontSize: 9,
                color: chartTextColor(),
                formatter: '{b}',
                position: 'top',
                distance: 6,
              },
              data: milestones.map((m) => ({
                name: m.label ?? m.task,
                coord: [m.date, tasks.findIndex((t) => t.name === m.task)],
              })),
            }
          : undefined,
        markLine: today
          ? {
              silent: true,
              symbol: 'none',
              lineStyle: { type: 'dashed', color: chartTextColor(), width: 1 },
              label: { formatter: 'Today', color: chartTextColor(), fontSize: 10, position: 'insideEndTop' },
              data: [{ xAxis: today }],
            }
          : undefined,
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
      color: chartColors(),
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: chartTooltipBg(),
          borderColor: chartTooltipBorder(),
          textStyle: { color: chartTooltipText(), fontSize: 12 },
          formatter: (p: any) => {
            const t = tasks[p.dataIndex]
            return `${t?.name}<br/>${String(t?.start).slice(0, 10)} → ${String(t?.end).slice(0, 10)}`
          },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'time',
          splitLine: { lineStyle: { color: chartSplitLineColor() } },
          axisLabel: { color: chartTextColor(), fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: tasks.map((t) => t.name),
          axisLine: { lineStyle: { color: chartAxisColor() } },
          axisLabel: { color: chartTextColor(), fontSize: 11 },
          axisTick: { show: false },
        },
        userYAxis,
      ),
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
  data-slot="gantt-chart"
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
