'use client'

// Three-panel cost breakdown: a stacked-by-week bar over time on top,
// and two side-by-side categorical pie charts below (cost share by
// lane + by carrier). The patterns repeat across spend dashboards;
// swap `weeklySeries`, `byLane`, and `byCarrier` to repoint.
//
// All three panels are theme-aware: bar colors come from
// chartColors via the wrappers; pies surface inline value labels so
// the panels read at a glance without leaning on the legend alone.
import * as React from 'react'
import { BarChart } from '@/components/ui/charts/bar-chart'
import { PieChart } from '@/components/ui/charts/pie-chart'
import { useChartTheme } from '@/components/ui/charts/useChartTheme'

interface WeekRow {
  week: string
  detentionOrigin: number
  combinedDndOrigin: number
  demurrageOrigin: number
  detentionDest: number
  demurrageDest: number
  combinedDndDest: number
}

// 17 weeks of cost data. Heavy spike in mid-Feb mirrors a closing
// quarter cleanup or a port-disruption incident.
const weeklySeries: WeekRow[] = [
  {
    week: 'Jan 26 - Feb 1',
    detentionOrigin: 2800,
    combinedDndOrigin: 0,
    demurrageOrigin: 0,
    detentionDest: 0,
    demurrageDest: 0,
    combinedDndDest: 0,
  },
  {
    week: 'Feb 2 - Feb 8',
    detentionOrigin: 1100,
    combinedDndOrigin: 0,
    demurrageOrigin: 0,
    detentionDest: 0,
    demurrageDest: 0,
    combinedDndDest: 0,
  },
  {
    week: 'Feb 9 - Feb 15',
    detentionOrigin: 1800,
    combinedDndOrigin: 3100,
    demurrageOrigin: 800,
    detentionDest: 1800,
    demurrageDest: 4300,
    combinedDndDest: 1100,
  },
  {
    week: 'Feb 16 - Feb 22',
    detentionOrigin: 0,
    combinedDndOrigin: 22000,
    demurrageOrigin: 12500,
    detentionDest: 0,
    demurrageDest: 1900,
    combinedDndDest: 35500,
  },
  {
    week: 'Feb 23 - Mar 1',
    detentionOrigin: 0,
    combinedDndOrigin: 0,
    demurrageOrigin: 3300,
    detentionDest: 800,
    demurrageDest: 6800,
    combinedDndDest: 4400,
  },
  {
    week: 'Mar 2 - Mar 8',
    detentionOrigin: 2400,
    combinedDndOrigin: 0,
    demurrageOrigin: 6400,
    detentionDest: 1200,
    demurrageDest: 2800,
    combinedDndDest: 6600,
  },
  {
    week: 'Mar 9 - Mar 15',
    detentionOrigin: 0,
    combinedDndOrigin: 0,
    demurrageOrigin: 600,
    detentionDest: 1300,
    demurrageDest: 5300,
    combinedDndDest: 5400,
  },
  {
    week: 'Mar 16 - Mar 22',
    detentionOrigin: 5400,
    combinedDndOrigin: 0,
    demurrageOrigin: 6000,
    detentionDest: 600,
    demurrageDest: 4200,
    combinedDndDest: 1400,
  },
  {
    week: 'Mar 23 - Mar 29',
    detentionOrigin: 0,
    combinedDndOrigin: 11000,
    demurrageOrigin: 4900,
    detentionDest: 0,
    demurrageDest: 4300,
    combinedDndDest: 2200,
  },
  {
    week: 'Mar 30 - Apr 5',
    detentionOrigin: 7700,
    combinedDndOrigin: 14000,
    demurrageOrigin: 5400,
    detentionDest: 1700,
    demurrageDest: 6300,
    combinedDndDest: 7200,
  },
  {
    week: 'Apr 6 - Apr 12',
    detentionOrigin: 1200,
    combinedDndOrigin: 3100,
    demurrageOrigin: 1500,
    detentionDest: 0,
    demurrageDest: 4800,
    combinedDndDest: 6300,
  },
  {
    week: 'Apr 13 - Apr 19',
    detentionOrigin: 0,
    combinedDndOrigin: 3300,
    demurrageOrigin: 3200,
    detentionDest: 3500,
    demurrageDest: 5000,
    combinedDndDest: 5700,
  },
  {
    week: 'Apr 20 - Apr 26',
    detentionOrigin: 1700,
    combinedDndOrigin: 5300,
    demurrageOrigin: 2500,
    detentionDest: 600,
    demurrageDest: 3800,
    combinedDndDest: 4800,
  },
  {
    week: 'Apr 27 - May 3',
    detentionOrigin: 6000,
    combinedDndOrigin: 15000,
    demurrageOrigin: 5500,
    detentionDest: 600,
    demurrageDest: 800,
    combinedDndDest: 2400,
  },
  {
    week: 'May 4 - May 10',
    detentionOrigin: 1900,
    combinedDndOrigin: 2200,
    demurrageOrigin: 3300,
    detentionDest: 3500,
    demurrageDest: 3700,
    combinedDndDest: 1100,
  },
  {
    week: 'May 11 - May 17',
    detentionOrigin: 1900,
    combinedDndOrigin: 1200,
    demurrageOrigin: 800,
    detentionDest: 700,
    demurrageDest: 600,
    combinedDndDest: 1200,
  },
]

const stackKeys = [
  { key: 'detentionOrigin', label: 'Detention at origin' },
  { key: 'combinedDndOrigin', label: 'Combined at origin' },
  { key: 'demurrageOrigin', label: 'Demurrage at origin' },
  { key: 'detentionDest', label: 'Detention at destination' },
  { key: 'demurrageDest', label: 'Demurrage at destination' },
  { key: 'combinedDndDest', label: 'Combined at destination' },
] as const

const stackedOption = {
  series: stackKeys.map(() => ({ stack: 'total' as const })),
  yAxis: {
    type: 'value' as const,
    axisLabel: { formatter: (v: number) => (v >= 1000 ? `$${Math.round(v / 1000)}K` : `$${v}`) },
  },
}

const byLane = [
  { name: 'LANE-01', value: 119800 },
  { name: 'LANE-02', value: 39000 },
  { name: 'LANE-03', value: 53100 },
  { name: 'LANE-04', value: 32000 },
  { name: 'LANE-05', value: 24700 },
  { name: 'LANE-06', value: 23500 },
  { name: 'LANE-07', value: 20300 },
  { name: 'LANE-08', value: 18300 },
  { name: 'LANE-09', value: 14700 },
  { name: 'OTHER', value: 8100 },
]

const byCarrier = [
  { name: 'C-ALPHA', value: 144200 },
  { name: 'C-BETA', value: 69800 },
  { name: 'C-GAMMA', value: 32700 },
  { name: 'C-DELTA', value: 31800 },
  { name: 'C-EPSILON', value: 27800 },
  { name: 'C-ZETA', value: 22600 },
  { name: 'OTHER', value: 10100 },
]

const totalAll = weeklySeries.reduce(
  (acc, w) =>
    acc +
    w.detentionOrigin +
    w.combinedDndOrigin +
    w.demurrageOrigin +
    w.detentionDest +
    w.demurrageDest +
    w.combinedDndDest,
  0,
)

const fmtUsd = (n: number) => `$${(n / 1000).toFixed(1)}k`

export function CostBreakdown() {
  const theme = useChartTheme()

  const pieOption = React.useMemo(
    () => ({
      legend: { show: false },
      series: [
        {
          radius: ['0%', '70%'],
          label: {
            show: true,
            formatter: (p: any) => `$${(p.value / 1000).toFixed(1)}k\n(${p.percent}%)`,
            fontSize: 10,
            color: theme.textColor,
          },
          labelLine: { show: false },
        },
      ],
    }),
    [theme],
  )

  return (
    <div data-slot="cost-breakdown" className="space-y-6">
      {/* Weekly trend (top) */}
      <section className="bg-card border-border rounded-lg border p-5">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Cost per day</h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              17-week rollup. Hover a stack to inspect the breakdown.
            </p>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">Total</div>
            <div className="text-lg font-semibold tabular-nums">{fmtUsd(totalAll)}</div>
          </div>
        </div>
        <BarChart
          data={weeklySeries}
          xField="week"
          yField={[
            'detentionOrigin',
            'combinedDndOrigin',
            'demurrageOrigin',
            'detentionDest',
            'demurrageDest',
            'combinedDndDest',
          ]}
          option={stackedOption}
          height="320"
        />
      </section>

      {/* Dual pie breakdown (bottom) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="bg-card border-border rounded-lg border p-4 sm:p-5">
          <h3 className="text-sm font-semibold tracking-tight">Cost share by lane</h3>
          <p className="text-muted-foreground mt-0.5 mb-4 text-xs">Top 9 lanes + a grouped 'Other' bucket.</p>
          <PieChart data={byLane} option={pieOption} height="320" />
        </section>

        <section className="bg-card border-border rounded-lg border p-4 sm:p-5">
          <h3 className="text-sm font-semibold tracking-tight">Cost share by carrier</h3>
          <p className="text-muted-foreground mt-0.5 mb-4 text-xs">Top 6 carriers + a grouped 'Other' bucket.</p>
          <PieChart data={byCarrier} option={pieOption} height="320" />
        </section>
      </div>
    </div>
  )
}
