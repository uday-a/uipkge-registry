<script setup lang="ts">
import { ProgressRingChart } from '@/components/ui/charts'
</script>

<template>
  <Story title="Quota ring" description="Single ring with a centred summary.">
    <ProgressRingChart :rings="[{ value: 68, label: 'Quota' }]" height="220" />
  </Story>

  <Story title="Multi-ring" description="Concentric rings for stacked goals.">
    <ProgressRingChart
      :rings="[
        { value: 82, label: 'Revenue' },
        { value: 64, label: 'NPS' },
        { value: 45, label: 'Retention' },
      ]"
      height="260"
    />
  </Story>

  <Story title="Custom centre" description="Override the centre label.">
    <ProgressRingChart :rings="[{ value: 92 }]" center-label="A+" height="200" />
  </Story>
</template>
