'use client'

import * as React from 'react'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme, mergeOptionBlock } from '../useChartTheme'

// StackedBarChart
// ─────────────────────────────────────────────────────────────────────────

export interface StackedBarChartProps {
  data: Record<string, any>[]
  xField?: string
  yFields: string[]
  /** Render as 100% shares instead of absolute values. Default false. */
  percent?: boolean
  /** Corner rounding in px. Default 6. */
  radius?: number
  /** Gap in px between stacked bar segments. Default 1. Set to 0 to disable. */
  stackGap?: number
  /** Color of the gap between stacked bar segments. Defaults to card background. */
  stackGapColor?: string
  height?: number | string
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const StackedBarChart = React.forwardRef<HTMLDivElement, StackedBarChartProps>(
  (
    {
      data,
      xField = 'x',
      yFields,
      percent = false,
      radius = 6,
      stackGap = 1,
      stackGapColor,
      height = 320,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const totals = data.map((d) => yFields.reduce((s, f) => s + Math.abs(d[f] ?? 0), 0) || 1)
      const series = yFields.map((f, i) => ({
        name: f,
        type: 'bar',
        stack: 'total',
        barMaxWidth: 34,
        itemStyle: {
          color: theme.colors[i % theme.colors.length],
          borderRadius: [radius, radius, radius, radius],
          ...(stackGap > 0
            ? {
                borderColor: stackGapColor ?? theme.bgColor,
                borderWidth: stackGap,
              }
            : {}),
        },
        label: percent
          ? { show: true, color: '#fff', fontSize: 10, formatter: (p: any) => `${Math.round(p.value)}%` }
          : undefined,
        data: data.map((d, r) => (percent ? (Math.abs(d[f] ?? 0) / totals[r]!) * 100 : d[f])),
      }))
      const userOption: any = option ?? {}
      const {
        series: userSeries,
        xAxis: userXAxis,
        yAxis: userYAxis,
        grid: userGrid,
        tooltip: userTooltip,
        legend: userLegend,
        ...userRest
      } = userOption

      const count = Math.max(yFields.length, Array.isArray(userSeries) ? userSeries.length : 0)
      const gapColor = stackGapColor ?? theme.bgColor

      const mergedSeries = Array.isArray(userSeries)
        ? Array.from({ length: count }, (_, i) => {
            const s = series[i] ?? {
              name: `series-${i}`,
              type: 'bar',
              stack: 'total',
              barMaxWidth: 34,
              itemStyle: {
                color: theme.colors[i % theme.colors.length],
              },
            }
            const u = userSeries[i] ?? {}
            return {
              ...s,
              ...u,
              itemStyle: {
                ...s.itemStyle,
                borderRadius: [radius, radius, radius, radius],
                ...(stackGap > 0
                  ? {
                      borderColor: gapColor,
                      borderWidth: stackGap,
                    }
                  : {}),
                ...(u.itemStyle ?? {}),
              },
            }
          })
        : series
      return {
        color: theme.colors,
        grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
        tooltip: mergeOptionBlock(
          {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
            valueFormatter: (v: any) => (percent ? `${(+v).toFixed(1)}%` : v),
          },
          userTooltip,
        ),
        legend: mergeOptionBlock(
          {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          },
          userLegend,
        ),
        xAxis: mergeOptionBlock(
          {
            type: 'category',
            data: data.map((d) => d[xField]),
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          percent
            ? {
                type: 'value',
                max: 100,
                splitLine: { lineStyle: { color: theme.splitLineColor } },
                axisLabel: { color: theme.textColor, fontSize: 11, formatter: '{value}%' },
              }
            : {
                type: 'value',
                splitLine: { lineStyle: { color: theme.splitLineColor } },
                axisLabel: { color: theme.textColor, fontSize: 11 },
              },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      }
    }, [data, xField, yFields, percent, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
StackedBarChart.displayName = 'StackedBarChart'
