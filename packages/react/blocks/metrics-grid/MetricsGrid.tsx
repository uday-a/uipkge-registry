'use client'

// Six-tile KPI grid. Each tile renders a labeled KPI header (title +
// big number / percentage / count) above a small chart -- pie or
// horizontal bar -- that gives the breakdown.
//
// Per the registry's primitive-vs-block rule: tile shapes are spelled
// out inline as siblings. Different tiles use different chart types
// (donut, full pie, horizontal bar) -- those differences are the whole
// point of the layout, so they don't hide behind a wrapper.
import { PieChart } from '@/components/ui/charts/pie-chart'
import { BarChart } from '@/components/ui/charts/bar-chart'

// --- KPI 1: status pie (e.g. successful / partially / error) ---
const totalRuns = 770
const runsByStatus = [
  { name: 'Successful', value: 638 },
  { name: 'Partial', value: 0 },
  { name: 'Error / Skipped', value: 132 },
]

// --- KPI 2: disposition split ---
const totalProcessed = 638
const dispositionSplit = [
  { name: 'Non-disputable', value: 168 },
  { name: 'Disputable', value: 470 },
]

// --- KPI 3: classification breakdown ---
const totalClassified = 638
const classification = [
  { name: 'Type A', value: 525 },
  { name: 'Type B', value: 113 },
]

// --- KPI 4: top reasons (horizontal bar) ---
const skipReasons = [
  { reason: 'CREDIT_NOTE', count: 11 },
  { reason: 'CUSTOMS_INSPECT', count: 5 },
  { reason: 'NEGATIVE_COST', count: 8 },
]
const totalSkipped = skipReasons.reduce((a, r) => a + r.count, 0)

// --- KPI 5: error reasons (horizontal bar) ---
const errorReasons = [
  { reason: 'INVALID_CUTOFF', count: 3 },
  { reason: 'NO_SHIPMENT_DATA', count: 20 },
  { reason: 'SELF_BILLING', count: 42 },
  { reason: 'MISSING_OBLIGATORY_FIELD', count: 2 },
  { reason: 'MISSING_OBLIGATORY_TIME', count: 4 },
  { reason: 'UNABLE_TO_CLASSIFY', count: 40 },
]
const totalErrors = errorReasons.reduce((a, r) => a + r.count, 0)

// --- KPI 6: workflow status ---
const openShare = 0.7602
const workflowStatus = [
  { name: 'Open', value: 485 },
  { name: 'Pending', value: 151 },
  { name: 'Closed', value: 2 },
]

const pieOption = {
  legend: { show: false },
  series: [
    {
      radius: ['0%', '70%'],
      label: {
        show: true,
        formatter: (p: any) => `${p.value}\n(${p.percent}%)`,
        fontSize: 11,
        color: '#fff',
        fontWeight: 600,
      },
      labelLine: { show: false },
    },
  ],
}

const donutOption = {
  legend: { show: false },
  series: [
    {
      radius: ['40%', '70%'],
      label: {
        show: true,
        formatter: (p: any) => `${p.value}\n(${p.percent}%)`,
        fontSize: 11,
        color: '#fff',
        fontWeight: 600,
      },
      labelLine: { show: false },
    },
  ],
}

const horizontalBarOption = {
  legend: { show: false },
  xAxis: { type: 'value' as const, axisLabel: { fontSize: 10 } },
  yAxis: { type: 'category' as const, axisLabel: { fontSize: 10 } },
  grid: { left: 16, right: 16, top: 8, bottom: 24, containLabel: true },
  series: [
    {
      type: 'bar' as const,
      barMaxWidth: 18,
      itemStyle: { borderRadius: [0, 3, 3, 0] },
    },
  ],
}

export function MetricsGrid() {
  return (
    <div data-slot="metrics-grid" className="space-y-4">
      <h2 className="text-primary text-sm font-semibold tracking-tight">Results Overview</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tile 1: Runs by status (pie) */}
        <article className="bg-card border-border rounded-lg border p-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Runs by status</h3>
          <div className="text-primary mt-1 mb-2 text-2xl font-semibold">{totalRuns} runs</div>
          <div className="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: 'var(--chart-1)' }} />
              Successful
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: 'var(--chart-4)' }} />
              Error / Skipped
            </span>
          </div>
          <PieChart data={runsByStatus} option={pieOption} height="220" />
        </article>

        {/* Tile 2: Disposition split (pie) */}
        <article className="bg-card border-border rounded-lg border p-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Disposition split</h3>
          <div className="text-primary mt-1 mb-2 text-2xl font-semibold">{totalProcessed} processed</div>
          <div className="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: 'var(--chart-1)' }} />
              Non-disputable
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: 'var(--chart-3)' }} />
              Disputable
            </span>
          </div>
          <PieChart data={dispositionSplit} option={pieOption} height="220" />
        </article>

        {/* Tile 3: Classification (pie) */}
        <article className="bg-card border-border rounded-lg border p-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Classification</h3>
          <div className="text-primary mt-1 mb-2 text-2xl font-semibold">{totalClassified} classified</div>
          <div className="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: 'var(--chart-1)' }} />
              Type A
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: 'var(--chart-3)' }} />
              Type B
            </span>
          </div>
          <PieChart data={classification} option={pieOption} height="220" />
        </article>

        {/* Tile 4: Skip reasons (horizontal bar) */}
        <article className="bg-card border-border rounded-lg border p-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Top skip reasons</h3>
          <div className="text-primary mt-1 mb-2 text-2xl font-semibold">{totalSkipped} skipped</div>
          <div className="text-muted-foreground mb-3 text-xs">By trigger</div>
          <BarChart data={skipReasons} xField="reason" yField="count" option={horizontalBarOption} height="220" />
        </article>

        {/* Tile 5: Error reasons (horizontal bar) */}
        <article className="bg-card border-border rounded-lg border p-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Top error reasons</h3>
          <div className="text-primary mt-1 mb-2 text-2xl font-semibold">{totalErrors} errors</div>
          <div className="text-muted-foreground mb-3 text-xs">By failure mode</div>
          <BarChart data={errorReasons} xField="reason" yField="count" option={horizontalBarOption} height="220" />
        </article>

        {/* Tile 6: Workflow status (donut + highlight) */}
        <article className="bg-card border-border rounded-lg border p-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Workflow status</h3>
          <div className="text-primary mt-1 mb-2 text-2xl font-semibold">{(openShare * 100).toFixed(2)}% open</div>
          <div className="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: 'var(--chart-1)' }} />
              Open
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: 'var(--chart-5)' }} />
              Pending
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: 'var(--chart-3)' }} />
              Closed
            </span>
          </div>
          <PieChart data={workflowStatus} option={donutOption} donut height="220" />
        </article>
      </div>
    </div>
  )
}
