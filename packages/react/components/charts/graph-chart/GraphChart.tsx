'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme } from '../useChartTheme'

// GraphChart
// ─────────────────────────────────────────────────────────────────────────

interface GraphNode {
  name: string
  /** Optional category index (paints with chart-N colour). */
  category?: number
  /** Optional fixed marker size. Defaults to 28. */
  symbolSize?: number
}
interface GraphLink {
  source: string
  target: string
  /** Optional edge value (shows up in the tooltip + sizes the line on weighted layouts). */
  value?: number
}

export interface GraphChartProps {
  nodes: GraphNode[]
  links: GraphLink[]
  /** Optional category labels rendered in the legend. */
  categories?: string[]
  /** Layout engine. `force` is force-directed (default), `circular` arranges
   *  on a ring, `none` lets you place nodes manually via `x`/`y`. */
  layout?: 'force' | 'circular' | 'none'
  /** Allow click-and-drag pan + scroll zoom. Default false. */
  roam?: boolean
  /** Draw arrowheads on the target end. Default true. */
  directed?: boolean
  height?: number | string
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const GraphChart = React.forwardRef<HTMLDivElement, GraphChartProps>(
  (
    {
      nodes,
      links,
      categories,
      layout = 'force',
      roam = false,
      directed = true,
      height = 380,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          type: 'graph',
          layout,
          roam,
          symbolSize: 28,
          label: { show: true, fontSize: 11, color: theme.textColor },
          edgeSymbol: directed ? (['none', 'arrow'] as [string, string]) : (['none', 'none'] as [string, string]),
          edgeSymbolSize: [0, 6],
          force: { repulsion: 220, edgeLength: 90 },
          lineStyle: { color: theme.axisColor, curveness: 0.15, width: 1 },
          emphasis: { focus: 'adjacency' as const, lineStyle: { width: 2 } },
          categories: categories?.map((name) => ({ name })),
          data: nodes.map((n) => ({
            ...n,
            itemStyle:
              typeof n.category === 'number' ? { color: theme.colors[n.category % theme.colors.length] } : undefined,
          })),
          links,
        },
      ]

      const userOption: any = option ?? {}
      const { series: userSeries, ...userRest } = userOption
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series

      return {
        color: theme.colors,
        tooltip: {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        legend: categories?.length
          ? {
              bottom: 0,
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: theme.textColor },
            }
          : undefined,
        series: mergedSeries,
        ...userRest,
      }
    }, [nodes, links, categories, layout, roam, directed, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} focusable={false} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
GraphChart.displayName = 'GraphChart'
