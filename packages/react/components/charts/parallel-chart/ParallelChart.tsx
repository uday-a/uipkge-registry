'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme } from '../useChartTheme'

// ParallelChart
// ─────────────────────────────────────────────────────────────────────────

interface ParallelAxis {
  name: string
  /** Set explicitly for fixed scales, otherwise computed from data. */
  min?: number
  max?: number
}
interface ParallelRow {
  /** One value per axis, in the same order as `axes`. */
  values: number[]
  /** Optional name shown in the tooltip. */
  name?: string
  /** Optional series grouping (index → chart-N colour). */
  group?: number
}

export interface ParallelChartProps {
  axes: ParallelAxis[]
  data: ParallelRow[]
  /** Optional group labels (shown in legend). */
  groups?: string[]
  height?: number | string
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const ParallelChart = React.forwardRef<HTMLDivElement, ParallelChartProps>(
  ({ axes, data, groups, height = 360, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      // Build one series per group so the legend can toggle them.
      const groupList = groups ?? ['series']
      const series = groupList.map((name, gi) => ({
        name,
        type: 'parallel' as const,
        lineStyle: { width: 1, opacity: 0.6 },
        data: data
          .filter((r) => (typeof r.group === 'number' ? r.group === gi : gi === 0))
          .map((r) => ({ value: r.values, name: r.name })),
      }))

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
        legend: groups?.length
          ? {
              bottom: 0,
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: theme.textColor },
            }
          : undefined,
        parallelAxis: axes.map((a, dim) => ({
          dim,
          name: a.name,
          min: a.min,
          max: a.max,
          nameTextStyle: { fontSize: 11, color: theme.textColor },
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        })),
        parallel: {
          left: 36,
          right: 24,
          top: 36,
          bottom: groups?.length ? 36 : 24,
          parallelAxisDefault: { axisLine: { lineStyle: { color: theme.axisColor } } },
        },
        series: mergedSeries,
        ...userRest,
      }
    }, [axes, data, groups, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} focusable={false} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
ParallelChart.displayName = 'ParallelChart'
