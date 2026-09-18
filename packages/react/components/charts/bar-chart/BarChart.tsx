'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme, mergeOptionBlock } from '../useChartTheme'

// BarChart
// ─────────────────────────────────────────────────────────────────────────

export interface BarChartProps {
  data: Record<string, any>[]
  xField?: string
  yField?: string | string[]
  /** Stack series on one baseline. Default false. */
  stacked?: boolean
  /** Gap in px between stacked bar segments. Default 1. Set to 0 to disable. */
  stackGap?: number
  /** Color of the gap between stacked bar segments. Defaults to card background. */
  stackGapColor?: string
  /** Show value labels on top of each bar. Default false. */
  valueLabels?: boolean
  /** Top corner rounding in px. Default 6. */
  radius?: number
  height?: number | string
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      xField = 'x',
      yField = 'y',
      stacked = false,
      stackGap = 1,
      stackGapColor,
      valueLabels = false,
      radius = 6,
      height = 300,
      option,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const fields = Array.isArray(yField) ? yField : [yField]
      const xData = data.map((d) => d[xField])

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

      const isHorizontal = userXAxis?.type === 'value' || userYAxis?.type === 'category'
      const hasUserStack = Array.isArray(userSeries) && userSeries.some((s: any) => Boolean(s?.stack))
      const gapColor = stackGapColor ?? theme.bgColor
      const defaultRadius = [radius, radius, radius, radius]

      const series = fields.map((field, i) => {
        const u = Array.isArray(userSeries) ? (userSeries[i] ?? {}) : {}
        const isSeriesStacked = Boolean(stacked || u?.stack || hasUserStack)

        return {
          name: field,
          type: 'bar',
          stack: stacked ? 'bars' : undefined,
          barMaxWidth: 32,
          itemStyle: {
            color: theme.colors[i % theme.colors.length],
            borderRadius: defaultRadius,
            ...(isSeriesStacked && stackGap > 0
              ? {
                  borderColor: gapColor,
                  borderWidth: stackGap,
                }
              : {}),
          },
          label: valueLabels ? { show: true, position: 'top', color: theme.textColor, fontSize: 11 } : undefined,
          data: data.map((d) => d[field]),
        }
      })

      const count = Math.max(fields.length, Array.isArray(userSeries) ? userSeries.length : 0)
      const mergedSeries = Array.isArray(userSeries)
        ? Array.from({ length: count }, (_, i) => {
            const s = series[i] ?? {
              type: 'bar',
              barMaxWidth: 32,
              itemStyle: {
                color: theme.colors[i % theme.colors.length],
              },
            }
            const u = userSeries[i] ?? {}
            const isSeriesStacked = Boolean(stacked || s.stack || u?.stack || hasUserStack)

            return {
              ...s,
              ...u,
              itemStyle: {
                ...s.itemStyle,
                borderRadius: defaultRadius,
                ...(isSeriesStacked && stackGap > 0
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

      const baseLegend: any =
        fields.length > 1
          ? {
              bottom: 0,
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: theme.textColor },
            }
          : { show: false }

      return {
        color: theme.colors,
        grid: mergeOptionBlock(
          { left: 16, right: 16, top: 24, bottom: fields.length > 1 ? 32 : 24, containLabel: true },
          userGrid,
        ),
        tooltip: mergeOptionBlock(
          {
            trigger: 'axis',
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
          },
          userTooltip,
        ),
        legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend, userLegend),
        xAxis: mergeOptionBlock(
          {
            type: 'category',
            data: xData,
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: 'value',
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisLine: { show: false },
            axisTick: { show: false },
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      }
    }, [data, xField, yField, stacked, valueLabels, radius, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
BarChart.displayName = 'BarChart'
