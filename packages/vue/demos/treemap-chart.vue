<script setup lang="ts">
import { TreemapChart } from '@/components/ui/charts'
const teams = [
  { name: 'Backend', value: 22 },
  { name: 'Frontend', value: 18 },
  { name: 'Inside sales', value: 14 },
  { name: 'Field sales', value: 12 },
  { name: 'Customer success', value: 10 },
  { name: 'Marketing', value: 8 },
  { name: 'Support', value: 8 },
  { name: 'Mobile', value: 8 },
  { name: 'Infra', value: 8 },
  { name: 'Sales ops', value: 6 },
]

// Air cargo: weekly tonnage by lane.
const laneTonnage = [
  { name: 'PVG–LAX', value: 520 },
  { name: 'ICN–ORD', value: 410 },
  { name: 'SIN–HKG', value: 380 },
  { name: 'FRA–JFK', value: 360 },
  { name: 'NRT–DFW', value: 350 },
  { name: 'HKG–ANC', value: 290 },
  { name: 'DXB–SIN', value: 280 },
  { name: 'SIN–ICN', value: 190 },
]

const nested = [
  {
    name: 'Engineering',
    children: [
      { name: 'Backend', value: 22 },
      { name: 'Frontend', value: 18 },
      { name: 'Mobile', value: 8 },
      { name: 'Infra', value: 8 },
    ],
  },
  {
    name: 'Sales',
    children: [
      { name: 'Inside', value: 14 },
      { name: 'Field', value: 12 },
      { name: 'Ops', value: 6 },
    ],
  },
  {
    name: 'Customer',
    children: [
      { name: 'Success', value: 10 },
      { name: 'Support', value: 8 },
    ],
  },
  {
    name: 'Marketing',
    children: [
      { name: 'Demand gen', value: 5 },
      { name: 'Content', value: 3 },
    ],
  },
]

// Colour-by-value: paint tiles by absolute value (warmer = higher) using
// visualMap. The option override layers a visualMap and tells the series
// to read it.
const colorByValueOption = {
  visualMap: {
    show: false,
    type: 'continuous' as const,
    min: 0,
    max: 25,
    inRange: { color: ['#fef3c7', '#f59e0b', '#9a3412'] },
  },
  series: [{ colorMappingBy: 'value' as const, colorSaturation: undefined as any }],
}
</script>

<template>
  <Story
    title="Basic treemap"
    description="Flat array of `{ name, value }` — each tile sized by value, labelled with name + value."
  >
    <TreemapChart :data="teams" height="360" />
  </Story>

  <Story
    title="Nested"
    description="Pass a tree of `{ name, children }` to get sub-rectangles within each parent. Tooltips show the full breadcrumb path."
  >
    <TreemapChart :data="nested" height="380" />
  </Story>

  <Story
    title="Color by value"
    description="Override the per-tile colour to follow the value (warm-to-burnt). Useful when categories don't matter — magnitude does."
  >
    <TreemapChart :data="teams" :option="colorByValueOption" height="360" />
  </Story>

  <Story
    title="With breadcrumb"
    description="Enable the navigation breadcrumb. Combined with `roam` / `nodeClick`, this turns the treemap into a drill-down explorer."
  >
    <TreemapChart
      :data="nested"
      :show-breadcrumb="true"
      :option="{ series: [{ roam: 'move', nodeClick: 'zoomToNode' }] }"
      height="380"
    />
  </Story>

  <Story
    title="Compact"
    description="Shorter height for in-card placement. Works because treemap reads by relative area — even at 200px, the dominant tile is unambiguous."
  >
    <TreemapChart :data="teams" height="200" />
  </Story>

  <Story title="Lane tonnage" description="Air cargo weekly uplift — tile area is tonnage, PVG–LAX dominates.">
    <TreemapChart :data="laneTonnage" height="320" />
  </Story>
</template>
