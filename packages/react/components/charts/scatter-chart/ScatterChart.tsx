'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react/esm/core'
import { ChartFrame, EChart } from '../shared'
import { useChartTheme, mergeOptionBlock } from '../useChartTheme'

// ScatterChart
// ─────────────────────────────────────────────────────────────────────────

export interface ScatterChartProps {
  data: Record<string, any>[]
  xField?: string
  yField?: string
  sizeField?: string
  categoryField?: string
  height?: number | string
  option?: any
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

export const ScatterChart = React.forwardRef<HTMLDivElement, ScatterChartProps>(
  ({ data, xField = 'x', yField = 'y', sizeField, categoryField, height = 300, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const categories = categoryField ? [...new Set(data.map((d) => d[categoryField]))] : ['default']

      const series = categories.map((cat, i) => ({
        name: cat,
        type: 'scatter',
        symbolSize: (val: any[]) => (sizeField ? Math.sqrt(val[2]) * 3 + 4 : 10),
        itemStyle: { color: theme.colors[i % theme.colors.length] },
        data: categoryField
          ? data
              .filter((d) => d[categoryField] === cat)
              .map((d) => [d[xField], d[yField], sizeField ? d[sizeField] : 0])
          : data.map((d) => [d[xField], d[yField], sizeField ? d[sizeField] : 0]),
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
      const mergedSeries = Array.isArray(userSeries)
        ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
        : series

      const baseLegend =
        categories.length > 1
          ? {
              bottom: 0,
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: theme.textColor },
            }
          : undefined

      return {
        color: theme.colors,
        grid: mergeOptionBlock(
          { left: 16, right: 16, top: 24, bottom: categories.length > 1 ? 32 : 24, containLabel: true },
          userGrid,
        ),
        tooltip: mergeOptionBlock(
          {
            trigger: 'item',
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            textStyle: { color: theme.tooltipText, fontSize: 12 },
            formatter: (params: any) =>
              `${params.seriesName}<br/>${xField}: ${params.value[0]}<br/>${yField}: ${params.value[1]}`,
          },
          userTooltip,
        ),
        legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend ?? {}, userLegend),
        xAxis: mergeOptionBlock(
          {
            type: 'value',
            splitLine: { lineStyle: { color: theme.splitLineColor } },
            axisLabel: { color: theme.textColor, fontSize: 11 },
            axisLine: { lineStyle: { color: theme.axisColor } },
            axisTick: { show: false },
            scale: true,
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
            scale: true,
          },
          userYAxis,
        ),
        series: mergedSeries,
        ...userRest,
      }
    }, [data, xField, yField, sizeField, categoryField, option, theme])

    return (
      <ChartFrame ref={ref} height={height} className={className} ariaLabel={ariaLabel}>
        <EChart option={mergedOption} />
      </ChartFrame>
    )
  },
)
ScatterChart.displayName = 'ScatterChart'
