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

// Share of the top (largest) stage: '100%', '24%', '7.2%', '1.8%'.
function formatShare(value: number, top: number): string {
  if (!top) return '0%'
  const pct = (value / top) * 100
  return `${pct >= 10 ? Math.round(pct) : Math.round(pct * 10) / 10}%`
}

export const FunnelChart = React.forwardRef<HTMLDivElement, FunnelChartProps>(
  ({ data, height = 300, showLabels = true, showLegend = false, option, className, ariaLabel }, ref) => {
    const theme = useChartTheme()

    const mergedOption = React.useMemo(() => {
      const topValue = Math.max(0, ...data.map(d => d.value))
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
          // Absorbs the 3px outer half of the 6px stroke, keeping a ~2px visible gutter.
          gap: 8,
          // Inside labels use the card-surface ink (light on the saturated stage
          // fills, tracks light/dark) -- muted text was illegible on colour.
          // Two lines: stage name, then value · share of the top stage.
          label: {
            show: showLabels,
            position: 'inside',
            color: theme.bgColor,
            formatter: (p: { name: string; value: number }) =>
              `{t|${p.name}}\n{v|${p.value.toLocaleString()} · ${formatShare(p.value, topValue)}}`,
            rich: {
              t: { fontSize: 12, fontWeight: 600, lineHeight: 16 },
              v: { fontSize: 11, fontWeight: 500, lineHeight: 15 },
            },
          },
          labelLine: { length: 8, lineStyle: { width: 1, type: 'solid' } },
          // ECharts funnel has no borderRadius; a same-colour round-join stroke softens corners (~3px radius).
          itemStyle: { borderWidth: 6, borderJoin: 'round' },
          emphasis: { label: { fontSize: 13, fontWeight: 700 } },
          data: data.map((d: any, i) => ({
            ...d,
            itemStyle: {
              ...d.itemStyle,
              borderColor: d.itemStyle?.color ?? theme.colors[i % theme.colors.length],
            },
          })),
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
