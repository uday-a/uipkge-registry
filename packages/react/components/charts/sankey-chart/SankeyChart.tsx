'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme } from '../useChartTheme'

// SankeyChart
// ─────────────────────────────────────────────────────────────────────────

interface SankeyLink {
  source: string
  target: string
  value: number
}

// Sankey nodes keep a fixed categorical palette so the same flow retains its
// visual identity across light and dark themes. Labels and tooltip chrome
// still use theme tokens for contrast against the current surface.
const SANKEY_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

export interface SankeyChartProps {
  /** Node names. If omitted, derived from the union of link sources + targets. */
  nodes?: string[]
  /** `{ source, target, value }` edges between nodes. */
  links: SankeyLink[]
  height?: number | string
  /** Curvature of the link ribbons. 0 = straight, 1 = max curve. */
  curveness?: number
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const SankeyChart = React.forwardRef<HTMLDivElement, SankeyChartProps>(
  ({ nodes, links, height = 360, curveness = 0.5, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const nodeNames = nodes ?? Array.from(new Set(links.flatMap((l) => [l.source, l.target])))

      const series = [
        {
          type: 'sankey',
          left: 16,
          right: 72,
          top: 12,
          bottom: 12,
          data: nodeNames.map((name) => ({ name })),
          links,
          lineStyle: { color: 'gradient', curveness },
          label: { fontSize: 11, color: theme.tooltipText },
          emphasis: { focus: 'adjacency' },
          itemStyle: { borderWidth: 0 },
        },
      ]

      const userOption: any = option ?? {}
      const { series: userSeries, ...userRest } = userOption
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series

      return {
        color: SANKEY_COLORS,
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        series: mergedSeries,
        ...userRest,
      }
    }, [nodes, links, curveness, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} focusable={false} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
SankeyChart.displayName = 'SankeyChart'
