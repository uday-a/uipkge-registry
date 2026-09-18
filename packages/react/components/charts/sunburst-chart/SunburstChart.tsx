'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme } from '../useChartTheme'

// SunburstChart
// ─────────────────────────────────────────────────────────────────────────

interface SunNode {
  name: string
  value?: number
  children?: SunNode[]
}

export interface SunburstChartProps {
  /** Hierarchical data — top-level array, each node has `name`, optional `value`, optional `children`. */
  data: SunNode[]
  height?: number | string
  /** Inner / outer radius as percentages of the smaller container side. Default `['12%', '90%']`. */
  radius?: [string, string]
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const SunburstChart = React.forwardRef<HTMLDivElement, SunburstChartProps>(
  ({ data, height = 360, radius = ['12%', '90%'], option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          type: 'sunburst',
          radius,
          data,
          label: { rotate: 'radial' as const, fontSize: 11 },
          itemStyle: { borderColor: '#fff', borderWidth: 1 },
          emphasis: { focus: 'ancestor' as const },
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
    }, [data, radius, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
SunburstChart.displayName = 'SunburstChart'
