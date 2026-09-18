<script setup lang="ts">
import { ParetoChart } from '@/components/ui/charts'

const defects = [
  { category: 'Typos', value: 142 },
  { category: 'Broken links', value: 98 },
  { category: 'Slow pages', value: 64 },
  { category: 'Auth errors', value: 31 },
  { category: 'Billing bugs', value: 18 },
  { category: 'Other', value: 12 },
]
</script>

<template>
  <Story title="Defect Pareto" description="Rows auto-sort; cumulative % line finds the vital few.">
    <ParetoChart :data="defects" height="320" />
  </Story>

  <Story title="Unsorted input" description="Pass rows in any order — sorting is automatic.">
    <ParetoChart :data="[...defects].reverse()" height="320" />
  </Story>
</template>
