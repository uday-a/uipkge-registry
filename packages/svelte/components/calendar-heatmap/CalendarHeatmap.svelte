<script lang="ts" module>
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { HeatmapChart as EChartsHeatmapChart } from 'echarts/charts'
  import { CalendarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'

  use([CanvasRenderer, EChartsHeatmapChart, CalendarComponent, TooltipComponent, VisualMapComponent])

  export interface CalendarHeatmapProps {
    /** [date string YYYY-MM-DD, value] tuples. */
    data: [string, number][]
    range: string | [string, string]
    height?: number | string
    /** Cell colour ramp [from, to] - default: chart-1 from light to saturated. */
    colorRange?: [string, string]
    option?: any
    class?: string
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { onMount, untrack } from 'svelte'
  import { init, type ECharts } from 'echarts/core'
  import { cn } from '$lib/utils'
  import { getChartTheme, heightToStyle } from './chart-theme'

  let {
    data,
    range,
    height = 200,
    colorRange = undefined,
    option = undefined,
    class: className,
    ariaLabel = undefined,
    ref = $bindable(null),
  }: CalendarHeatmapProps = $props()

  // Re-resolve CSS-variable colors when <html> class/style changes (the
  // typical dark-mode pivot) and once after first paint so post-hydration
  // reads see resolved values instead of SSR fallbacks.
  let themeKey = $state(0)
  onMount(() => {
    const raf = requestAnimationFrame(() => {
      themeKey++
    })
    const obs = new MutationObserver(() => {
      themeKey++
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  })

  const theme = $derived.by(() => {
    themeKey
    return getChartTheme()
  })

  const resolvedColorRange = $derived(colorRange ?? [theme.colors[0]!, theme.colors[3]!])
  const maxValue = $derived(data.reduce((m, [, v]) => Math.max(m, v), 0) || 1)

  const mergedOption = $derived.by(() => {
    const t = theme
    return {
      color: t.colors,
      tooltip: {
        position: 'top',
        formatter: (p: any) => `<strong>${p.value[0]}</strong><br>${p.value[1]} contributions`,
        backgroundColor: t.tooltipBg,
        borderColor: t.tooltipBorder,
        textStyle: { color: t.tooltipText, fontSize: 12 },
      },
      visualMap: {
        show: false,
        min: 0,
        max: maxValue,
        inRange: { color: resolvedColorRange },
      },
      calendar: {
        top: 24,
        left: 36,
        right: 12,
        cellSize: ['auto', 14],
        range,
        itemStyle: { color: t.splitLineColor, borderWidth: 0 },
        splitLine: { show: false },
        dayLabel: { color: t.textColor, fontSize: 10, firstDay: 1, nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] },
        monthLabel: { color: t.textColor, fontSize: 10, fontWeight: 600 },
        yearLabel: { show: false },
      },
      series: (() => {
        const series = [{ type: 'heatmap', coordinateSystem: 'calendar', data }]
        const userSeries = (option as any)?.series
        return Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
      })(),
      // Strip `series` from the rest spread so the merge above isn't clobbered.
      ...(() => {
        const { series: _, ...rest } = (option as any) ?? {}
        return rest
      })(),
    }
  })

  let chartEl: HTMLDivElement | null = $state(null)
  let instance: ECharts | null = null

  $effect(() => {
    const el = chartEl
    if (!el) return
    instance = init(el)
    instance.setOption(untrack(() => mergedOption))
    const ro = new ResizeObserver(() => instance?.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      instance?.dispose()
      instance = null
    }
  })

  $effect(() => {
    const opt = mergedOption
    if (instance) instance.setOption(opt, { notMerge: true, lazyUpdate: true })
  })
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex: focusable chart frame mirrors the Vue twin -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style={`height: ${heightToStyle(height)}`}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
