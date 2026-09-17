'use client'

// Two-pane analytics dashboard: a combo chart (stacked bars with a
// dot overlay on a dual y-axis) sits above an interactive drill-down
// line chart. Click a bar in the top pane to filter the bottom pane
// to that route. The block bakes in a realistic dummy dataset; swap
// `routes`, `partners`, and `drillSeries` with your own to repoint.
//
// Built on raw ECharts rather than `BarChart` because combo charts
// (bar + scatter + dual y-axes) sit outside the opinionated wrapper's
// single-series-type contract -- this is the documented escape hatch.
// We register the chart types this block needs at module load (mirroring
// the wrappers in `@/components/ui/charts`) and read palette tokens from
// `useChartTheme()` so the colours stay in sync with the rest of the registry.
import * as React from 'react'
import * as echartsCore from 'echarts/core'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart as EBar, ScatterChart as EScatter, LineChart as ELine } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, MarkLineComponent } from 'echarts/components'
import ReactECharts from 'echarts-for-react/esm/core'
import { useChartTheme } from '@/components/ui/charts/useChartTheme'

use([CanvasRenderer, EBar, EScatter, ELine, GridComponent, TooltipComponent, LegendComponent, MarkLineComponent])

// Each route declares the per-partner volume (stack segments) + the
// avg overlay value (dot on the right y-axis).
const partners = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON'] as const
type Partner = (typeof partners)[number]

interface Route {
  id: string
  label: string
  volumes: Record<Partner, number>
  overlay: number
}

const routes: Route[] = [
  {
    id: 'r1',
    label: 'NODE A → NODE B',
    volumes: { ALPHA: 90, BETA: 25, GAMMA: 18, DELTA: 12, EPSILON: 8 },
    overlay: 12,
  },
  {
    id: 'r2',
    label: 'NODE C → NODE D',
    volumes: { ALPHA: 4, BETA: 100, GAMMA: 14, DELTA: 12, EPSILON: 24 },
    overlay: 14.7,
  },
  {
    id: 'r3',
    label: 'NODE E → NODE F',
    volumes: { ALPHA: 14, BETA: 38, GAMMA: 18, DELTA: 32, EPSILON: 28 },
    overlay: 8,
  },
  { id: 'r4', label: 'NODE G → NODE H', volumes: { ALPHA: 130, BETA: 0, GAMMA: 0, DELTA: 0, EPSILON: 0 }, overlay: 6 },
  { id: 'r5', label: 'NODE I → NODE J', volumes: { ALPHA: 0, BETA: 0, GAMMA: 60, DELTA: 0, EPSILON: 70 }, overlay: 17 },
  { id: 'r6', label: 'NODE K → NODE L', volumes: { ALPHA: 60, BETA: 50, GAMMA: 16, DELTA: 0, EPSILON: 0 }, overlay: 8 },
  { id: 'r7', label: 'NODE M → NODE N', volumes: { ALPHA: 70, BETA: 0, GAMMA: 0, DELTA: 0, EPSILON: 0 }, overlay: 22 },
  { id: 'r8', label: 'NODE O → NODE P', volumes: { ALPHA: 0, BETA: 0, GAMMA: 0, DELTA: 0, EPSILON: 110 }, overlay: 29 },
  { id: 'r9', label: 'NODE Q → NODE R', volumes: { ALPHA: 40, BETA: 0, GAMMA: 60, DELTA: 0, EPSILON: 0 }, overlay: 19 },
  {
    id: 'r10',
    label: 'NODE S → NODE T',
    volumes: { ALPHA: 60, BETA: 30, GAMMA: 0, DELTA: 0, EPSILON: 0 },
    overlay: 23,
  },
]

// Drill-down monthly series for a few partners. In a real app you'd
// fetch this per-route on selection; the dummy block shows the same
// shape regardless of which route is active.
const drillMonths = ['Mar 2026', 'Apr 2026', 'May 2026']
const drillSeries: Record<string, number[]> = {
  ALPHA: [22, 25, 20],
  GAMMA: [19, 17, 18],
  EPSILON: [-1, 29, -1], // sparse point — left out of line by NaN-like handling
}

export function AnalyticsOverview() {
  const theme = useChartTheme()
  const [overviewMetric, setOverviewMetric] = React.useState<'overlay' | 'volume'>('overlay')
  const [activeRoute, setActiveRoute] = React.useState<string | null>(null)
  const [drillView, setDrillView] = React.useState<'Month' | 'Quarter'>('Month')

  const overviewOption = React.useMemo(() => {
    const x = routes.map((r) => r.label)
    const stacks = partners.map((p, i) => ({
      name: p,
      type: 'bar' as const,
      stack: 'vol',
      barMaxWidth: 36,
      emphasis: { focus: 'series' as const },
      itemStyle: { color: theme.colors[i % theme.colors.length] },
      data: routes.map((r) => r.volumes[p]),
    }))
    const overlay = {
      name: 'Avg metric',
      type: 'scatter' as const,
      yAxisIndex: 1,
      symbolSize: 12,
      itemStyle: { color: theme.colors[2], borderColor: theme.tooltipBg, borderWidth: 2 },
      data: routes.map((r) => r.overlay),
    }

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      legend: {
        top: 8,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: theme.textColor, fontSize: 11 },
      },
      grid: { left: 56, right: 56, top: 42, bottom: 72, containLabel: false },
      xAxis: {
        type: 'category' as const,
        data: x,
        axisLine: { lineStyle: { color: theme.axisColor } },
        axisLabel: {
          interval: 0,
          rotate: 35,
          fontSize: 10,
          color: theme.textColor,
          formatter: (val: string) => val.replace(' → ', '\n'),
        },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value' as const,
          name: 'Volume',
          nameTextStyle: { color: theme.textColor, fontSize: 10 },
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 10 },
        },
        {
          type: 'value' as const,
          name: 'Metric',
          nameTextStyle: { color: theme.textColor, fontSize: 10 },
          splitLine: { show: false },
          axisLabel: { color: theme.textColor, fontSize: 10 },
        },
      ],
      series: [...stacks, overlay],
    }
  }, [theme])

  const drillOption = React.useMemo(() => {
    const series = Object.entries(drillSeries).map(([name, values], i) => ({
      name,
      type: 'line' as const,
      smooth: true,
      symbolSize: 8,
      connectNulls: false,
      lineStyle: { width: 2, color: theme.colors[i % theme.colors.length] },
      itemStyle: { color: theme.colors[i % theme.colors.length] },
      data: values.map((v) => (v < 0 ? null : v)),
    }))

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      legend: {
        top: 8,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: theme.textColor, fontSize: 11 },
      },
      grid: { left: 48, right: 24, top: 42, bottom: 48, containLabel: false },
      xAxis: {
        type: 'category' as const,
        data: drillMonths,
        boundaryGap: false,
        axisLine: { lineStyle: { color: theme.axisColor } },
        axisLabel: { color: theme.textColor, fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value' as const,
        splitLine: { lineStyle: { color: theme.splitLineColor } },
        axisLabel: { color: theme.textColor, fontSize: 11, formatter: (v: number) => `${v}d` },
      },
      series,
    }
  }, [theme])

  const activeLabel = routes.find((r) => r.id === activeRoute)?.label ?? null

  function onOverviewClick(params: any) {
    if (!params?.name) return
    const r = routes.find((rt) => rt.label === params.name)
    if (r) setActiveRoute(r.id)
  }

  function resetDrill() {
    setActiveRoute(null)
  }

  return (
    <div data-slot="analytics-overview" className="space-y-6">
      {/* Overview pane */}
      <section className="bg-card border-border rounded-lg border p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-[var(--accent-tint)]">Overview</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              <span className="text-foreground font-medium">Metric</span> measures the avg performance signal aggregated
              per route.
            </p>
          </div>
          <div className="text-muted-foreground text-xs">
            <span>Performance Metric:</span>
            <select
              value={overviewMetric}
              onChange={(e) => setOverviewMetric(e.target.value as 'overlay' | 'volume')}
              className="border-border text-foreground ml-2 rounded-md border bg-transparent px-2 py-1 font-medium"
            >
              <option value="overlay">Avg metric</option>
              <option value="volume">Total volume</option>
            </select>
          </div>
        </div>
        <div
          role="img"
          tabIndex={0}
          style={{ height: '320px' }}
          className="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
        >
          <ReactECharts
            echarts={echartsCore as any}
            option={overviewOption}
            notMerge
            lazyUpdate
            onEvents={{ click: onOverviewClick }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <p className="text-muted-foreground mt-2 text-xs">Click a bar to drill into that route&apos;s monthly trend.</p>
      </section>

      {/* Drill-down pane */}
      <section className="bg-card border-border rounded-lg border p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold tracking-tight">
              {activeLabel ? (
                <>
                  <span className="text-muted-foreground font-normal">Drill-down:</span>
                  <span className="text-foreground ml-1">{activeLabel}</span>
                </>
              ) : (
                <span className="text-muted-foreground font-normal">Select a route above to drill in</span>
              )}
            </h3>
            {activeRoute && (
              <button
                type="button"
                className="border-border text-muted-foreground hover:text-foreground rounded-md border px-2 py-1 font-mono text-xs transition hover:border-[var(--accent-tint-soft)]"
                onClick={resetDrill}
              >
                ← Back to Overview
              </button>
            )}
          </div>
          <div className="text-muted-foreground text-xs">
            <span>View By:</span>
            <select
              value={drillView}
              onChange={(e) => setDrillView(e.target.value as 'Month' | 'Quarter')}
              className="border-border text-foreground ml-2 rounded-md border bg-transparent px-2 py-1 font-medium"
            >
              <option value="Month">Month</option>
              <option value="Quarter">Quarter</option>
            </select>
          </div>
        </div>
        {activeRoute ? (
          <div
            role="img"
            tabIndex={0}
            style={{ height: '280px' }}
            className="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none"
          >
            <ReactECharts
              echarts={echartsCore as any}
              option={drillOption}
              notMerge
              lazyUpdate
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className="text-muted-foreground border-border grid h-[260px] place-items-center rounded-md border border-dashed text-xs">
            No route selected. Click a bar above.
          </div>
        )}
      </section>
    </div>
  )
}
