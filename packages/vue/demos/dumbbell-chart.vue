<script setup lang="ts">
import { DumbbellChart } from '@/components/ui/charts'

const churn = [
  { label: 'Acme', a: 4.2, b: 2.1 },
  { label: 'Globex', a: 3.8, b: 3.1 },
  { label: 'Initech', a: 5.1, b: 2.8 },
  { label: 'Umbrella', a: 2.4, b: 2.9 },
]

const ratings = [
  { label: 'Speed', a: 3.1, b: 4.4 },
  { label: 'Support', a: 3.8, b: 4.1 },
  { label: 'Pricing', a: 4.0, b: 3.6 },
]
</script>

<template>
  <Story title="Churn before/after" description="Joined dots make movement direction obvious.">
    <DumbbellChart :data="churn" :names="['Q1', 'Q2']" height="300" />
  </Story>

  <Story title="Satisfaction shift" description="Custom series names per comparison.">
    <DumbbellChart :data="ratings" :names="['2024', '2025']" height="260" />
  </Story>
</template>
