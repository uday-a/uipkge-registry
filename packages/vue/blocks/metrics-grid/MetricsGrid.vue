<script setup lang="ts">
// Six-tile KPI grid. Each tile renders a labeled KPI header (title +
// big number / percentage / count) above a small chart -- pie or
// horizontal bar -- that gives the breakdown.
//
// Per the registry's primitive-vs-block rule: tile shapes are spelled
// out inline as siblings. Different tiles use different chart types
// (donut, full pie, horizontal bar) -- those differences are the whole
// point of the layout, so they don't hide behind a wrapper.
import { computed } from 'vue'
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
const totalSkipped = computed(() => skipReasons.reduce((a, r) => a + r.count, 0))

// --- KPI 5: error reasons (horizontal bar) ---
const errorReasons = [
  { reason: 'INVALID_CUTOFF', count: 3 },
  { reason: 'NO_SHIPMENT_DATA', count: 20 },
  { reason: 'SELF_BILLING', count: 42 },
  { reason: 'MISSING_OBLIGATORY_FIELD', count: 2 },
  { reason: 'MISSING_OBLIGATORY_TIME', count: 4 },
  { reason: 'UNABLE_TO_CLASSIFY', count: 40 },
]
const totalErrors = computed(() => errorReasons.reduce((a, r) => a + r.count, 0))

// --- KPI 6: workflow status ---
const totalProcessed2 = 638
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
        color: 'var(--foreground)',
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
        color: 'var(--foreground)',
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

interface TileShape {
  title: string
  big: string
  legend?: { label: string; color: string }[]
}

const tiles: TileShape[] = [
  {
    title: 'Runs by status',
    big: `${totalRuns} runs`,
    legend: [
      { label: 'Successful', color: 'var(--chart-1)' },
      { label: 'Error / Skipped', color: 'var(--chart-4)' },
    ],
  },
  {
    title: 'Disposition split',
    big: `${totalProcessed} processed`,
    legend: [
      { label: 'Non-disputable', color: 'var(--chart-1)' },
      { label: 'Disputable', color: 'var(--chart-3)' },
    ],
  },
  {
    title: 'Classification',
    big: `${totalClassified} classified`,
    legend: [
      { label: 'Type A', color: 'var(--chart-1)' },
      { label: 'Type B', color: 'var(--chart-3)' },
    ],
  },
]
</script>

<template>
  <div data-slot="metrics-grid" class="space-y-4">
    <h2 class="text-primary text-sm font-semibold tracking-tight">Results Overview</h2>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Tile 1: Runs by status (pie) -->
      <article class="bg-card border-border rounded-lg border p-4">
        <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Runs by status</h3>
        <div class="text-primary mt-1 mb-2 text-2xl font-semibold">{{ totalRuns }} runs</div>
        <div class="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full" style="background: var(--chart-1)"></span>Successful</span
          >
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full" style="background: var(--chart-4)"></span>Error / Skipped</span
          >
        </div>
        <PieChart :data="runsByStatus" :option="pieOption" height="220" />
      </article>

      <!-- Tile 2: Disposition split (pie) -->
      <article class="bg-card border-border rounded-lg border p-4">
        <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Disposition split</h3>
        <div class="text-primary mt-1 mb-2 text-2xl font-semibold">{{ totalProcessed }} processed</div>
        <div class="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full" style="background: var(--chart-1)"></span>Non-disputable</span
          >
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full" style="background: var(--chart-3)"></span>Disputable</span
          >
        </div>
        <PieChart :data="dispositionSplit" :option="pieOption" height="220" />
      </article>

      <!-- Tile 3: Classification (pie) -->
      <article class="bg-card border-border rounded-lg border p-4">
        <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Classification</h3>
        <div class="text-primary mt-1 mb-2 text-2xl font-semibold">{{ totalClassified }} classified</div>
        <div class="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full" style="background: var(--chart-1)"></span>Type A</span
          >
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full" style="background: var(--chart-3)"></span>Type B</span
          >
        </div>
        <PieChart :data="classification" :option="pieOption" height="220" />
      </article>

      <!-- Tile 4: Skip reasons (horizontal bar) -->
      <article class="bg-card border-border rounded-lg border p-4">
        <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Top skip reasons</h3>
        <div class="text-primary mt-1 mb-2 text-2xl font-semibold">{{ totalSkipped }} skipped</div>
        <div class="text-muted-foreground mb-3 text-xs">By trigger</div>
        <BarChart :data="skipReasons" x-field="reason" y-field="count" :option="horizontalBarOption" height="220" />
      </article>

      <!-- Tile 5: Error reasons (horizontal bar) -->
      <article class="bg-card border-border rounded-lg border p-4">
        <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Top error reasons</h3>
        <div class="text-primary mt-1 mb-2 text-2xl font-semibold">{{ totalErrors }} errors</div>
        <div class="text-muted-foreground mb-3 text-xs">By failure mode</div>
        <BarChart :data="errorReasons" x-field="reason" y-field="count" :option="horizontalBarOption" height="220" />
      </article>

      <!-- Tile 6: Workflow status (donut + highlight) -->
      <article class="bg-card border-border rounded-lg border p-4">
        <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Workflow status</h3>
        <div class="text-primary mt-1 mb-2 text-2xl font-semibold">{{ (openShare * 100).toFixed(2) }}% open</div>
        <div class="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full" style="background: var(--chart-1)"></span>Open</span
          >
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full" style="background: var(--chart-5)"></span>Pending</span
          >
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full" style="background: var(--chart-3)"></span>Closed</span
          >
        </div>
        <PieChart :data="workflowStatus" :option="donutOption" :donut="true" height="220" />
      </article>
    </div>
  </div>
</template>
