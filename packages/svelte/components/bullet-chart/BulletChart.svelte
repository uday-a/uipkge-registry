<script lang="ts" module>
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart as EChartsBarChart, ScatterChart as EChartsScatterChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'

  use([CanvasRenderer, EChartsBarChart, EChartsScatterChart, GridComponent, TooltipComponent, LegendComponent])

  export interface BulletDatum {
    label: string
    /** Measured value (foreground bar). */
    actual: number
    /** Target marker position. */
    target: number
    /** [poor, satisfactory, good] upper bounds for the background bands. */
    ranges: [number, number, number]
  }

  export interface BulletChartProps {
    data: BulletDatum[]
    height?: number | string
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
  import { getChartTheme, heightToStyle, mergeOptionBlock } from './chart-theme'

  let {
    data,
    height = 300,
    option = undefined,
    class: className,
    ariaLabel = undefined,
    ref = $bindable(null),
  }: BulletChartProps = $props()

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

  const mergedOption = $derived.by(() => {
    const t = theme
    const labels = data.map((d) => d.label)
    const range0 = data.map((d) => d.ranges[0])
    const range1 = data.map((d) => d.ranges[1] - d.ranges[0])
    const range2 = data.map((d) => d.ranges[2] - d.ranges[1])

    const series = [
      {
        name: 'poor',
        type: 'bar',
        stack: 'ranges',
        silent: true,
        barWidth: 18,
        itemStyle: { color: t.splitLineColor },
        data: range0,
      },
      {
        name: 'ok',
        type: 'bar',
        stack: 'ranges',
        silent: true,
        itemStyle: { color: t.axisColor, opacity: 0.85 },
        data: range1,
      },
      {
        name: 'good',
        type: 'bar',
        stack: 'ranges',
        silent: true,
        itemStyle: { color: t.colors[4], opacity: 0.35 },
        data: range2,
      },
      {
        name: 'actual',
        type: 'bar',
        barWidth: 7,
        barGap: '-90%',
        z: 3,
        itemStyle: { color: t.colors[0], borderRadius: 3 },
        label: { show: true, position: 'right', color: t.textColor, fontSize: 11 },
        data: data.map((d) => d.actual),
      },
      {
        name: 'target',
        type: 'scatter',
        z: 4,
        symbol: 'rect',
        symbolSize: [3, 24],
        symbolRotate: 0,
        itemStyle: { color: t.textColor },
        data: data.map((d, i) => [d.target, i]),
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
      color: t.colors,
      grid: mergeOptionBlock({ left: 16, right: 48, top: 16, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: t.tooltipBg,
          borderColor: t.tooltipBorder,
          textStyle: { color: t.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: t.splitLineColor } },
          axisLabel: { color: t.textColor, fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: labels,
          axisLine: { lineStyle: { color: t.axisColor } },
          axisLabel: { color: t.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
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
