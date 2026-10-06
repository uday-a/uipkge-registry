<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface IcicleNode {
    name: string
    value?: number
    children?: IcicleNode[]
  }

  export interface IcicleChartProps extends HTMLAttributes<HTMLDivElement> {
    data: IcicleNode
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
  }

  interface FlatNode {
    x0: number
    x1: number
    depth: number
    name: string
    value: number
    color: number
  }
</script>

<script lang="ts">
  // @ts-ignore: echarts is a consumer dependency (see icicle-chart.registry.ts) and is not installed in this package.
  import { use, init } from 'echarts/core'
  // @ts-ignore: echarts is a consumer dependency (see icicle-chart.registry.ts) and is not installed in this package.
  import { CanvasRenderer } from 'echarts/renderers'
  // @ts-ignore: echarts is a consumer dependency (see icicle-chart.registry.ts) and is not installed in this package.
  import { CustomChart as EChartsCustomChart } from 'echarts/charts'
  // @ts-ignore: echarts is a consumer dependency (see icicle-chart.registry.ts) and is not installed in this package.
  import { GridComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    mergeOptionBlock,
    resolveChartColors,
    resolveChartTextColor,
    resolveChartTooltipBg,
    resolveChartTooltipBorder,
    resolveChartTooltipText,
    watchTheme,
  } from './chart-theme'

  use([CanvasRenderer, EChartsCustomChart, GridComponent, TooltipComponent])

  let { class: className, data, height = 340, option, ariaLabel, ...restProps }: IcicleChartProps = $props()

  let themeKey = $state(0)
  $effect(() => watchTheme(() => (themeKey += 1)))

  const theme = $derived.by(() => {
    themeKey // re-resolve CSS tokens when the theme flips
    return {
      colors: resolveChartColors(),
      text: resolveChartTextColor(),
      tooltipBg: resolveChartTooltipBg(),
      tooltipBorder: resolveChartTooltipBorder(),
      tooltipText: resolveChartTooltipText(),
    }
  })

  // Partition layout: each level fills 0..100, children subdivide their
  // parent proportionally (equal shares when values are absent). Apache
  // ECharts has no icicle series, so this renders one custom rect per node.
  const flat = $derived.by((): FlatNode[] => {
    const out: FlatNode[] = []
    const walk = (node: IcicleNode, x0: number, x1: number, depth: number, color: number) => {
      if (!node || typeof node !== 'object') return
      const kids = node.children ?? []
      const value =
        node.value ??
        kids.reduce((s, k) => s + (k.value ?? k.children?.reduce((a, c) => a + (c.value ?? 0), 0) ?? 0), 0)
      out.push({ x0, x1, depth, name: node.name, value, color })
      if (!kids.length) return
      const total = kids.reduce((s, k) => s + (k.value ?? 0), 0)
      let x = x0
      kids.forEach((k, i) => {
        const w = total > 0 ? ((k.value ?? 0) / total) * (x1 - x0) : (x1 - x0) / kids.length
        walk(k, x, x + w, depth + 1, depth === 0 ? i : color)
        x += w
      })
    }
    walk(data, 0, 100, 0, 0)
    return out
  })

  const maxDepth = $derived(Math.max(...flat.map((n) => n.depth), 0))
  const grand = $derived(flat[0]?.value ?? 1)

  const mergedOption = $derived.by(() => {
    const t = theme
    const nodes = flat
    const total = grand
    const depth = maxDepth
    const series = [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const n: FlatNode = nodes[params.dataIndex]
          const [px0, py0] = api.coord([n.x0, n.depth + 0.08])
          const [px1, py1] = api.coord([n.x1, n.depth + 0.92])
          const wide = Math.abs(px1 - px0) > 48
          const children: any[] = [
            {
              type: 'rect',
              shape: {
                x: Math.min(px0, px1),
                y: Math.min(py0, py1),
                width: Math.max(1, Math.abs(px1 - px0)),
                height: Math.abs(py1 - py0),
                r: 3,
              },
              style: {
                fill: t.colors[n.color % t.colors.length],
                opacity: n.depth === 0 ? 0.35 : 0.85,
              },
            },
          ]
          if (wide) {
            children.push({
              type: 'text',
              style: {
                x: (px0 + px1) / 2,
                y: (py0 + py1) / 2,
                text: n.depth === 0 ? n.name : `${n.name} ${n.value}`,
                fill: n.depth === 0 ? t.text : '#fff',
                fontSize: 11,
                fontWeight: n.depth === 0 ? 700 : 600,
                align: 'center',
                verticalAlign: 'middle',
                overflow: 'truncate',
                width: Math.abs(px1 - px0) - 12,
              },
            })
          }
          return { type: 'group', children }
        },
        data: nodes.map((n) => [n.x0, n.depth, n.x1]),
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
      grid: mergeOptionBlock({ left: 8, right: 8, top: 12, bottom: 12, containLabel: false }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: t.tooltipBg,
          borderColor: t.tooltipBorder,
          textStyle: { color: t.tooltipText, fontSize: 12 },
          formatter: (p: any) => {
            const n: FlatNode | undefined = nodes[p.dataIndex]
            return n
              ? `${n.name}<br/>${n.value.toLocaleString()} t (${((n.value / (total || 1)) * 100).toFixed(1)}%)`
              : ''
          },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock({ type: 'value', min: 0, max: 100, show: false }, userXAxis),
      yAxis: mergeOptionBlock(
        { type: 'value', min: -0.2, max: depth + 1.1, inverse: true, show: false },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))

  let viewport: HTMLDivElement | null = null
  let chart = $state<{ setOption: (option: unknown) => void } | null>(null)

  $effect(() => {
    if (!viewport) return
    const instance = init(viewport)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(viewport)
    return () => {
      ro.disconnect()
      instance.dispose()
      chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption)
  })
</script>

<div
  data-uipkge
  data-slot="icicle-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Icicle chart'}
  {...restProps}
  style="height: {heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
>
  <div bind:this={viewport} class="size-full"></div>
</div>
