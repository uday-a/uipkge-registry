'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme } from '../useChartTheme'

// TreeChart
// ─────────────────────────────────────────────────────────────────────────

interface TreeNode {
  name: string
  value?: number
  children?: TreeNode[]
  /** Collapse this branch on initial render. */
  collapsed?: boolean
}

export interface TreeChartProps {
  data: TreeNode
  /** `LR` (left-to-right, default), `TB` (top-down), `RL`, `BT`, or `radial`. */
  orient?: 'LR' | 'TB' | 'RL' | 'BT' | 'radial'
  /** Allow click-and-drag pan. Default false. */
  roam?: boolean
  height?: number | string
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const TreeChart = React.forwardRef<HTMLDivElement, TreeChartProps>(
  ({ data, orient = 'LR', roam = false, height = 380, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const layout = orient === 'radial' ? ('radial' as const) : ('orthogonal' as const)
      const series = [
        {
          type: 'tree',
          data: [data],
          layout,
          orient: layout === 'orthogonal' ? orient : undefined,
          roam,
          symbol: 'circle',
          symbolSize: 10,
          initialTreeDepth: -1,
          top: 16,
          bottom: 16,
          left: layout === 'radial' ? '5%' : 16,
          right: layout === 'radial' ? '5%' : 60,
          label: {
            fontSize: 11,
            color: theme.textColor,
            position: layout === 'radial' ? ('inside' as const) : ('right' as const),
            verticalAlign: 'middle' as const,
            align: layout === 'radial' ? ('center' as const) : ('left' as const),
            distance: 6,
          },
          leaves: {
            label: { position: layout === 'radial' ? ('inside' as const) : ('right' as const) },
          },
          lineStyle: { color: theme.axisColor, width: 1.5, curveness: 0.5 },
          emphasis: { focus: 'descendant' as const },
          itemStyle: { color: theme.colors[0], borderColor: theme.colors[0] },
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
        series: mergedSeries,
        ...userRest,
      }
    }, [data, orient, roam, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} focusable={false} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
TreeChart.displayName = 'TreeChart'
