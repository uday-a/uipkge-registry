<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MekkoColumn {
    name: string
    values: { name: string; value: number }[]
  }

  export interface MarimekkoChartProps extends HTMLAttributes<HTMLDivElement> {
    columns: MekkoColumn[]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }

  // NOTE: `echarts` is a consumer dependency (see the sidecar
  // `dependencies`), not installed in this repo — the ts-ignore comments
  // below keep `svelte-check` green in the monorepo while consumers get
  // fully typed ECharts.
  // @ts-ignore: consumer dependency, resolved in the consumer project
  import * as echarts from 'echarts/core'
  // @ts-ignore: consumer dependency, resolved in the consumer project
  import { CanvasRenderer } from 'echarts/renderers'
  // @ts-ignore: consumer dependency, resolved in the consumer project
  import { CustomChart as EChartsCustomChart } from 'echarts/charts'
  // @ts-ignore: consumer dependency, resolved in the consumer project
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'

  echarts.use([CanvasRenderer, EChartsCustomChart, GridComponent, TooltipComponent, LegendComponent])
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import {
    getChartColors,
    getChartTextColor,
    getChartTooltipBg,
    getChartTooltipBorder,
    getChartTooltipText,
    mergeOptionBlock,
    watchThemeChange,
  } from './useChartTheme'

  let {
    class: className,
    columns,
    height = 340,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: MarimekkoChartProps = $props()

  let container: HTMLDivElement | null = $state(null)
  // Bumped by the theme watcher so the derived option re-resolves tokens.
  let themeTick = $state(0)

  const segments = $derived(Array.from(new Set(columns.flatMap((c) => c.values.map((v) => v.name)))))

  interface MekkoRect {
    x0: number
    x1: number
    y0: number
    y1: number
    name: string
    value: number
    column: string
    firstInColumn: boolean
  }

  // 100×100 value space: column widths ∝ column totals (x), segment
  // heights ∝ within-column shares (y, stacked bottom-up). Column labels
  // render as in-canvas text below y=0 (axis floor is -10 for room).
  const flat = $derived.by((): MekkoRect[] => {
    const grand = columns.reduce((s, c) => s + c.values.reduce((a, v) => a + v.value, 0), 0) || 1
    let x = 0
    return columns.flatMap((c) => {
      const total = c.values.reduce((s, v) => s + v.value, 0)
      const w = (total / grand) * 100
      let y = 0
      const rects = c.values.map((v, vi) => {
        const h = total ? (v.value / total) * 100 : 0
        const rect: MekkoRect = {
          x0: x,
          x1: x + w,
          y0: y,
          y1: y + h,
          name: v.name,
          value: v.value,
          column: c.name,
          firstInColumn: vi === 0,
        }
        y += h
        return rect
      })
      x += w
      return rects
    })
  })

  const mergedOption = $derived.by(() => {
    themeTick
    const rects = flat
    const segNames = segments
    const palette = getChartColors()
    const textColor = getChartTextColor()
    const series = [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const s: MekkoRect = rects[params.dataIndex]
          const [px0, py1] = api.coord([s.x0, s.y1])
          const [px1, py0] = api.coord([s.x1, s.y0])
          const color = palette[segNames.indexOf(s.name) % palette.length]
          const w = Math.abs(px1 - px0)
          const h = Math.abs(py1 - py0)
          const children: any[] = [
            {
              type: 'rect',
              shape: {
                x: Math.min(px0, px1),
                y: Math.min(py0, py1),
                width: Math.max(1, w),
                height: Math.max(1, h),
                r: 2,
              },
              style: { fill: color },
            },
          ]
          if (w > 48 && h > 20) {
            children.push({
              type: 'text',
              style: {
                x: (px0 + px1) / 2,
                y: (py0 + py1) / 2,
                text: `${s.name} ${Math.round(s.y1 - s.y0)}%`,
                fill: '#fff',
                fontSize: 10,
                fontWeight: 600,
                align: 'center',
                verticalAlign: 'middle',
              },
            })
          }
          if (s.firstInColumn && w > 30) {
            const [lx] = api.coord([(s.x0 + s.x1) / 2, 0])
            const [, ly] = api.coord([0, -5])
            children.push({
              type: 'text',
              style: {
                x: lx,
                y: ly,
                text: `${s.column} (${Math.round(s.x1 - s.x0)}%)`,
                fill: textColor,
                fontSize: 10,
                fontWeight: 600,
                align: 'center',
                verticalAlign: 'middle',
              },
            })
          }
          return { type: 'group', children }
        },
        data: rects.map((s) => [s.x0, s.y0, s.x1, s.y1]),
      },
    ]
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
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: palette,
      grid: mergeOptionBlock({ left: 8, right: 8, top: 16, bottom: 36, containLabel: false }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          formatter: (p: any) => {
            const s: MekkoRect | undefined = rects[p.dataIndex]
            return s ? `${s.column} · ${s.name}<br/>${s.value} (${Math.round(s.x1 - s.x0)}% of width)` : ''
          },
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: textColor },
          data: segNames,
        },
        userLegend,
      ),
      xAxis: mergeOptionBlock({ type: 'value', min: 0, max: 100, show: false }, userXAxis),
      yAxis: mergeOptionBlock({ type: 'value', min: -12, max: 100, show: false }, userYAxis),
      series: mergedSeries,
      ...userRest,
    }
  })

  let chart: any = null

  $effect(() => {
    if (!container) return
    chart = echarts.init(container)
    // Autoresize (the vue-echarts `:autoresize` equivalent).
    const ro = new ResizeObserver(() => chart?.resize())
    ro.observe(container)
    const unwatchTheme = watchThemeChange(() => {
      themeTick++
    })
    return () => {
      unwatchTheme()
      ro.disconnect()
      chart?.dispose()
      chart = null
    }
  })

  $effect(() => {
    const opt = mergedOption
    chart?.setOption(opt, true)
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex: chart is intentionally focusable (mirrors the Vue twin) -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Marimekko chart'}
  style:height={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={container} class="size-full"></div>
</div>
