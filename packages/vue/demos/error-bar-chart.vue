<script setup lang="ts">
import { ErrorBarChart } from '@/components/ui/charts'

// Lane rate forecast with 80% confidence intervals ($/kg).
const lanes = [
  { category: 'PVG–LAX', value: 4.6, low: 4.1, high: 5.3 },
  { category: 'ICN–ORD', value: 4.2, low: 3.8, high: 4.7 },
  { category: 'SIN–HKG', value: 2.4, low: 2.1, high: 2.8 },
  { category: 'FRA–JFK', value: 3.6, low: 3.2, high: 4.1 },
  { category: 'DXB–SIN', value: 3.1, low: 2.7, high: 3.6 },
]
</script>

<template>
  <Story
    title="Rate forecast intervals"
    description="Mean forecast bars with whisker caps — the wider the whisker, the less certain the lane."
  >
    <ErrorBarChart :data="lanes" height="320" />
  </Story>

  <Story title="Peak vs off-peak" description="Same lanes, tighter spreads off-season.">
    <ErrorBarChart
      :data="[
        { category: 'PVG–LAX', value: 3.9, low: 3.7, high: 4.1 },
        { category: 'SIN–HKG', value: 2.2, low: 2.0, high: 2.4 },
      ]"
      height="260"
    />
  </Story>
</template>
