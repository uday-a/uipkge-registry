'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChartFrame } from '../shared'

// CategoryDistributionChart — dependency-free KPI + share bar
// ─────────────────────────────────────────────────────────────────────────

export interface DistributionSlice {
  label: string
  /** Share of the whole; auto-normalised when the sum is not 100. */
  percentage: number
  value?: string | number
  color?: string
}

export interface CategoryDistributionChartProps {
  primaryValue: string | number
  primaryLabel?: string
  trend?: { value: string; direction: 'up' | 'down' }
  categories: DistributionSlice[]
  height?: number | string
  showLegend?: boolean
  colors?: string[]
  className?: string
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export const CategoryDistributionChart = React.forwardRef<HTMLDivElement, CategoryDistributionChartProps>(
  (
    {
      primaryValue,
      primaryLabel,
      trend,
      categories,
      height = 220,
      showLegend = true,
      colors = DEFAULT_COLORS,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const total = categories.reduce((s, c) => s + c.percentage, 0) || 1
    const slices = categories.map((c, i) => ({
      ...c,
      share: (c.percentage / total) * 100,
      color: c.color ?? colors[i % colors.length],
    }))

    return (
      <ChartFrame ref={ref} height={height} focusable={false} className={cn('flex flex-col justify-center', className)}>
        <div className="flex items-baseline gap-2">
          <span className="text-foreground text-3xl font-bold tabular-nums">{primaryValue}</span>
          {trend && (
            <span
              className="text-xs font-semibold tabular-nums"
              style={{ color: trend.direction === 'up' ? 'var(--chart-2)' : 'var(--destructive)' }}
            >
              {trend.direction === 'up' ? '+' : '−'}
              {trend.value}
            </span>
          )}
          {primaryLabel && <span className="text-muted-foreground text-xs">{primaryLabel}</span>}
        </div>
        <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full" role="presentation">
          {slices.map((s) => (
            <div
              key={s.label}
              className="h-full"
              style={{ width: `${s.share}%`, background: s.color }}
              title={`${s.label} — ${Math.round(s.share)}%`}
            />
          ))}
        </div>
        {showLegend && (
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {slices.map((s) => (
              <li key={s.label} className="flex min-w-0 items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: s.color }} />
                <span className="text-foreground truncate font-medium">{s.label}</span>
                <span className="text-muted-foreground ml-auto shrink-0 tabular-nums">
                  {s.value ?? `${Math.round(s.share)}%`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </ChartFrame>
    )
  },
)
CategoryDistributionChart.displayName = 'CategoryDistributionChart'
