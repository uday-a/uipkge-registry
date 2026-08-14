<script setup lang="ts">
// Two-pane analytics dashboard: a combo chart (stacked bars with a
// dot overlay on a dual y-axis) sits above an interactive drill-down
// line chart. Click a bar in the top pane to filter the bottom pane
// to that route. The block bakes in a realistic dummy dataset; swap
// `routes`, `partners`, and `drillSeries` with your own to repoint.
//
// Built on `RawChart` rather than `BarChart` because combo charts
// (bar + scatter + dual y-axes) sit outside the opinionated wrapper's
// single-series-type contract -- this is the documented escape hatch.
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import { BarChart as EBar, ScatterChart as EScatter, LineChart as ELine } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, MarkLineComponent } from 'echarts/components'
import {
  chartColors,
  chartTextColor,
  chartAxisColor,
  chartSplitLineColor,
  chartTooltipBg,
  chartTooltipBorder,
  chartTooltipText,
} from '@/components/ui/charts/useChartTheme'
import { RawChart } from '@/components/ui/charts/raw-chart'

use([EBar, EScatter, ELine, GridComponent, TooltipComponent, LegendComponent, MarkLineComponent])

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

const overviewMetric = ref<'overlay' | 'volume'>('overlay')
const activeRoute = ref<string | null>(null)
const drillView = ref<'Month' | 'Quarter'>('Month')

const overviewOption = computed(() => {
  const x = routes.map((r) => r.label)
  const stacks = partners.map((p, i) => ({
    name: p,
    type: 'bar' as const,
    stack: 'vol',
    barMaxWidth: 36,
    emphasis: { focus: 'series' as const },
    itemStyle: { color: chartColors.value[i % chartColors.value.length] },
    data: routes.map((r) => r.volumes[p]),
  }))
  const overlay = {
    name: 'Avg metric',
    type: 'scatter' as const,
    yAxisIndex: 1,
    symbolSize: 12,
    itemStyle: { color: chartColors.value[2], borderColor: chartTooltipBg.value, borderWidth: 2 },
    data: routes.map((r) => r.overlay),
  }

  return {
    color: chartColors.value,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: chartTooltipBg.value,
      borderColor: chartTooltipBorder.value,
      textStyle: { color: chartTooltipText.value, fontSize: 12 },
    },
    legend: {
      top: 8,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: chartTextColor.value, fontSize: 11 },
    },
    grid: { left: 56, right: 56, top: 42, bottom: 72, containLabel: false },
    xAxis: {
      type: 'category' as const,
      data: x,
      axisLine: { lineStyle: { color: chartAxisColor.value } },
      axisLabel: {
        interval: 0,
        rotate: 35,
        fontSize: 10,
        color: chartTextColor.value,
        formatter: (val: string) => val.replace(' → ', '\n'),
      },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value' as const,
        name: 'Volume',
        nameTextStyle: { color: chartTextColor.value, fontSize: 10 },
        splitLine: { lineStyle: { color: chartSplitLineColor.value } },
        axisLabel: { color: chartTextColor.value, fontSize: 10 },
      },
      {
        type: 'value' as const,
        name: 'Metric',
        nameTextStyle: { color: chartTextColor.value, fontSize: 10 },
        splitLine: { show: false },
        axisLabel: { color: chartTextColor.value, fontSize: 10 },
      },
    ],
    series: [...stacks, overlay],
  }
})

const drillOption = computed(() => {
  const series = Object.entries(drillSeries).map(([name, values], i) => ({
    name,
    type: 'line' as const,
    smooth: true,
    symbolSize: 8,
    connectNulls: false,
    lineStyle: { width: 2, color: chartColors.value[i % chartColors.value.length] },
    itemStyle: { color: chartColors.value[i % chartColors.value.length] },
    data: values.map((v) => (v < 0 ? null : v)),
  }))

  return {
    color: chartColors.value,
    tooltip: {
      trigger: 'axis',
      backgroundColor: chartTooltipBg.value,
      borderColor: chartTooltipBorder.value,
      textStyle: { color: chartTooltipText.value, fontSize: 12 },
    },
    legend: {
      top: 8,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: chartTextColor.value, fontSize: 11 },
    },
    grid: { left: 48, right: 24, top: 42, bottom: 48, containLabel: false },
    xAxis: {
      type: 'category' as const,
      data: drillMonths,
      boundaryGap: false,
      axisLine: { lineStyle: { color: chartAxisColor.value } },
      axisLabel: { color: chartTextColor.value, fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: chartSplitLineColor.value } },
      axisLabel: { color: chartTextColor.value, fontSize: 11, formatter: (v: number) => `${v}d` },
    },
    series,
  }
})

const activeLabel = computed(() => routes.find((r) => r.id === activeRoute.value)?.label ?? null)

function onOverviewClick(params: any) {
  if (!params?.name) return
  const r = routes.find((rt) => rt.label === params.name)
  if (r) activeRoute.value = r.id
}

function resetDrill() {
  activeRoute.value = null
}
</script>

<template>
  <div data-slot="analytics-overview" class="space-y-6">
    <!-- Overview pane -->
    <section class="bg-card border-border rounded-lg border p-5">
      <div class="mb-3 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-sm font-semibold tracking-tight text-[var(--accent-tint)]">Overview</h2>
          <p class="text-muted-foreground mt-1 text-xs">
            <span class="text-foreground font-medium">Metric</span> measures the avg performance signal aggregated per
            route.
          </p>
        </div>
        <div class="text-muted-foreground text-xs">
          <span>Performance Metric:</span>
          <select
            v-model="overviewMetric"
            class="border-border text-foreground ml-2 rounded-md border bg-transparent px-2 py-1 font-medium"
          >
            <option value="overlay">Avg metric</option>
            <option value="volume">Total volume</option>
          </select>
        </div>
      </div>
      <RawChart :option="overviewOption" height="320" @click="onOverviewClick" />
      <p class="text-muted-foreground mt-2 text-xs">Click a bar to drill into that route's monthly trend.</p>
    </section>

    <!-- Drill-down pane -->
    <section class="bg-card border-border rounded-lg border p-5">
      <div class="mb-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <h3 class="text-sm font-semibold tracking-tight">
            <template v-if="activeLabel">
              <span class="text-muted-foreground font-normal">Drill-down:</span>
              <span class="text-foreground ml-1">{{ activeLabel }}</span>
            </template>
            <span v-else class="text-muted-foreground font-normal">Select a route above to drill in</span>
          </h3>
          <button
            v-if="activeRoute"
            type="button"
            class="border-border text-muted-foreground hover:text-foreground rounded-md border px-2 py-1 font-mono text-xs transition hover:border-[var(--accent-tint-soft)]"
            @click="resetDrill"
          >
            ← Back to Overview
          </button>
        </div>
        <div class="text-muted-foreground text-xs">
          <span>View By:</span>
          <select
            v-model="drillView"
            class="border-border text-foreground ml-2 rounded-md border bg-transparent px-2 py-1 font-medium"
          >
            <option value="Month">Month</option>
            <option value="Quarter">Quarter</option>
          </select>
        </div>
      </div>
      <RawChart v-if="activeRoute" :option="drillOption" height="280" />
      <div
        v-else
        class="text-muted-foreground border-border grid h-[260px] place-items-center rounded-md border border-dashed text-xs"
      >
        No route selected. Click a bar above.
      </div>
    </section>
  </div>
</template>
