'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme } from '../useChartTheme'

// PieChart
// ─────────────────────────────────────────────────────────────────────────

export interface PieChartProps {
  data: Record<string, any>[]
  nameField?: string
  valueField?: string
  height?: number | string
  donut?: boolean
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    { data, nameField = 'name', valueField = 'value', height = 300, donut = false, option, className, ariaLabel },
    ref,
  ) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const chartData = data.map((d) => ({
        name: d[nameField],
        value: d[valueField],
      }))

      const series = [
        {
          type: 'pie',
          radius: donut ? ['45%', '70%'] : '65%',
          center: ['50%', '45%'],
          itemStyle: { borderWidth: 0 },
          label: { show: false },
          data: chartData,
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
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11 },
        },
        series: mergedSeries,
        ...userRest,
      }
    }, [data, nameField, valueField, donut, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
PieChart.displayName = 'PieChart'
