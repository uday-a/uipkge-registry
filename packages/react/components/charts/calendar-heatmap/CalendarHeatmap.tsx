'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme } from '../useChartTheme'

// CalendarHeatmap
// ─────────────────────────────────────────────────────────────────────────

export interface CalendarHeatmapProps {
  /** [date string YYYY-MM-DD, value] tuples. */
  data: [string, number][]
  range: string | [string, string]
  height?: number | string
  /** Cell colour ramp [from, to] - default: chart-1 from light to saturated. */
  colorRange?: [string, string]
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const CalendarHeatmap = React.forwardRef<HTMLDivElement, CalendarHeatmapProps>(
  ({ data, range, height = 200, colorRange, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()
    const resolvedColorRange = colorRange ?? [theme.colors[0]!, theme.colors[3]!]

    const mergedOption = React.useMemo(() => {
      const maxValue = data.reduce((m, [, v]) => Math.max(m, v), 0) || 1

      return {
        color: theme.colors,
        tooltip: {
          position: 'top',
          formatter: (p: any) => `<strong>${p.value[0]}</strong><br>${p.value[1]} contributions`,
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
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
          itemStyle: { color: theme.splitLineColor, borderWidth: 0 },
          splitLine: { show: false },
          dayLabel: {
            color: theme.textColor,
            fontSize: 10,
            firstDay: 1,
            nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          },
          monthLabel: { color: theme.textColor, fontSize: 10, fontWeight: 600 },
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
    }, [data, range, resolvedColorRange, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
CalendarHeatmap.displayName = 'CalendarHeatmap'
