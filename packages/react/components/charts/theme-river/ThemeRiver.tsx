'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme, mergeOptionBlock } from '../useChartTheme'

// ThemeRiver
// ─────────────────────────────────────────────────────────────────────────

export interface ThemeRiverProps {
  /** `[time, value, series]` tuples. Time can be a date string or number. */
  data: [string | number, number, string][]
  height?: number | string
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const ThemeRiver = React.forwardRef<HTMLDivElement, ThemeRiverProps>(
  ({ data, height = 320, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const series = [
        {
          type: 'themeRiver',
          data,
          label: { show: false },
          emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' } },
        },
      ]

      const userOption: any = option ?? {}
      const {
        series: userSeries,
        singleAxis: userSingleAxis,
        tooltip: userTooltip,
        legend: userLegend,
        ...userRest
      } = userOption
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series

      return {
        color: theme.colors,
        tooltip: mergeOptionBlock(
          {
            trigger: 'axis',
            axisPointer: { type: 'line', lineStyle: { color: theme.axisColor, opacity: 0.8 } },
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
          },
          userTooltip,
        ),
        legend:
          userLegend?.show === false
            ? undefined
            : mergeOptionBlock(
                {
                  bottom: 0,
                  icon: 'circle',
                  itemWidth: 8,
                  itemHeight: 8,
                  textStyle: { fontSize: 11, color: theme.textColor },
                },
                userLegend,
              ),
        singleAxis: mergeOptionBlock(
          {
            top: 12,
            bottom: 40,
            type: 'time',
            axisTick: { show: false },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisLine: { lineStyle: { color: theme.axisColor } },
          },
          userSingleAxis,
        ),
        series: mergedSeries,
        ...userRest,
      }
    }, [data, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} focusable={false} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
ThemeRiver.displayName = 'ThemeRiver'
