<script setup lang="ts">
import { EffectScatterChart } from '@/components/ui/charts'

const incidents = [
  { x: 10, y: 22, c: 'p1' },
  { x: 18, y: 30, c: 'p1' },
  { x: 26, y: 18, c: 'p2' },
  { x: 34, y: 42, c: 'p2' },
  { x: 42, y: 28, c: 'p3' },
  { x: 50, y: 36, c: 'p3' },
]

const fleet = [
  { lat: 12, lng: 18 },
  { lat: 22, lng: 28 },
  { lat: 30, lng: 24 },
  { lat: 38, lng: 36 },
]
</script>

<template>
  <Story title="Alert ripple" description="Ripple animation draws the eye to live points. Grouped by category.">
    <EffectScatterChart :data="incidents" x-field="x" y-field="y" category-field="c" height="300" />
  </Story>

  <Story title="Single series" description="No category field renders one ripple series.">
    <EffectScatterChart :data="fleet" x-field="lat" y-field="lng" height="280" />
  </Story>

  <Story title="Slow ripple" description="Longer period for ambient dashboards.">
    <EffectScatterChart :data="incidents" x-field="x" y-field="y" category-field="c" :ripple-period="8" height="300" />
  </Story>
</template>
