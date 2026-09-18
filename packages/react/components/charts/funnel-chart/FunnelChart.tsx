'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme } from '../useChartTheme'

// FunnelChart
// ─────────────────────────────────────────────────────────────────────────

export interface FunnelChartProps {
  data: { name: string; value: number }[]
  height?: number | string
  showLabels?: boolean
  showLegend?: boolean
  /** ECharts option escape hatch -- merged on top of the computed option. */
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const FunnelChart = React.forwardRef<HTMLDivElement, FunnelChartProps>(
  ({ data, height = 300, showLabels = true, showLegend = false, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          type: 'funnel',
          left: '8%',
          right: '8%',
          top: 12,
          bottom: showLegend ? 32 : 12,
          sort: 'descending',
          minSize: '20%',
          maxSize: '100%',
          funnelAlign: 'center',
          gap: 2,
          label: {
            show: showLabels,
            position: 'inside',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
          },
          labelLine: { length: 8, lineStyle: { width: 1, type: 'solid' } },
          itemStyle: { borderWidth: 0 },
          emphasis: { label: { fontSize: 13, fontWeight: 700 } },
          data,
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
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        legend: showLegend
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
    }, [data, showLabels, showLegend, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
FunnelChart.displayName = 'FunnelChart'
