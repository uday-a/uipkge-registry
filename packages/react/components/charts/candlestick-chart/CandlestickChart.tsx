'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme, mergeOptionBlock } from '../useChartTheme'

// CandlestickChart
// ─────────────────────────────────────────────────────────────────────────

interface Candle {
  date: string
  open: number
  close: number
  low: number
  high: number
}

export interface CandlestickChartProps {
  data: Candle[]
  height?: number | string
  /** Show the bottom data-zoom slider. Default false. */
  zoom?: boolean
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const CandlestickChart = React.forwardRef<HTMLDivElement, CandlestickChartProps>(
  ({ data, height = 320, zoom = false, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      // ECharts candle data shape: [open, close, low, high].
      const candleData = data.map((c) => [c.open, c.close, c.low, c.high])
      const dates = data.map((c) => c.date)

      const series = [
        {
          type: 'candlestick',
          data: candleData,
          itemStyle: {
            // Bullish (close >= open) -> teal (chart-2). Bearish -> orange (chart-4).
            color: theme.colors[1],
            color0: theme.colors[3],
            borderColor: theme.colors[1],
            borderColor0: theme.colors[3],
          },
        },
      ]

      const userOption: any = option ?? {}
      const {
        series: userSeries,
        xAxis: userXAxis,
        yAxis: userYAxis,
        grid: userGrid,
        tooltip: userTooltip,
        ...userRest
      } = userOption
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series

      return {
        color: theme.colors,
        grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: zoom ? 60 : 24, containLabel: true }, userGrid),
        tooltip: mergeOptionBlock(
          {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
          },
          userTooltip,
        ),
        xAxis: mergeOptionBlock(
          {
            type: 'category',
            data: dates,
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisTick: { show: false },
          },
          userXAxis,
        ),
        yAxis: mergeOptionBlock(
          {
            type: 'value',
            scale: true,
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisLine: { show: false },
            axisTick: { show: false },
          },
          userYAxis,
        ),
        dataZoom: zoom ? [{ type: 'slider', bottom: 8, height: 18 }, { type: 'inside' }] : undefined,
        series: mergedSeries,
        ...userRest,
      }
    }, [data, zoom, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} focusable={false} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
CandlestickChart.displayName = 'CandlestickChart'
