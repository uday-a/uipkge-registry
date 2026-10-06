<script lang="ts" module>
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { ScatterChart as EChartsScatterChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'

  use([CanvasRenderer, EChartsScatterChart, GridComponent, TooltipComponent, LegendComponent])

  export interface BubbleChartProps {
    data: Record<string, any>[]
    xField?: string
    yField?: string
    sizeField?: string
    categoryField?: string
    /** Bubble opacity. Default 0.75. */
    opacity?: number
    /** Smallest bubble diameter in px. Default 8. */
    minSize?: number
    /** Largest bubble diameter in px. Default 42. */
    maxSize?: number
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
    xField = 'x',
    yField = 'y',
    sizeField = 'size',
    categoryField = undefined,
    opacity = 0.75,
    minSize = 8,
    maxSize = 42,
    height = 320,
    option = undefined,
    class: className,
    ariaLabel = undefined,
    ref = $bindable(null),
  }: BubbleChartProps = $props()

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
    const cats = categoryField ? [...new Set(data.map((d) => String(d[categoryField])))] : ['default']
    const sizes = data.map((d) => +d[sizeField] || 0)
    const maxSizeVal = Math.max(...sizes, 1)
    const scale = (v: number) => minSize + Math.sqrt(v / maxSizeVal) * (maxSize - minSize)
    const series = cats.map((cat, i) => ({
      name: String(cat),
      type: 'scatter',
      symbolSize: (val: any[]) => scale(val[2]),
      itemStyle: { color: t.colors[i % t.colors.length], opacity },
      data: (categoryField ? data.filter((d) => String(d[categoryField]) === cat) : data).map((d) => [
        d[xField],
        d[yField],
        +d[sizeField] || 0,
        d,
      ]),
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
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: t.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: cats.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: t.tooltipBg,
          borderColor: t.tooltipBorder,
          textStyle: { color: t.tooltipText, fontSize: 12 },
          formatter: (p: any) =>
            `${p.seriesName}<br/>${xField}: ${p.value[0]}<br/>${yField}: ${p.value[1]}<br/>${sizeField}: ${p.value[2]}`,
        },
        userTooltip,
      ),
      legend:
        cats.length > 1
          ? mergeOptionBlock(
              {
                bottom: 0,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: { fontSize: 11, color: t.textColor },
              },
              userLegend,
            )
          : undefined,
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: t.splitLineColor } },
          axisLabel: { color: t.textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: t.axisColor } },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: t.splitLineColor } },
          axisLabel: { color: t.textColor, fontSize: 11 },
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
