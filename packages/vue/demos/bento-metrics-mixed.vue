<script setup lang="ts">
import BentoMetricsMixed from '@/components/blocks/bento-metrics-mixed/BentoMetricsMixed.vue'
// BentoMetricsMixed is the block file the user installs. Open\n// `components/blocks/BentoMetricsMixed.vue` after install to wire real\n// figures. The sparkline is inline SVG, no chart dependency.
</script>

<template>
  <Story
    title="Bento — Mixed Metrics"
    description="Six tiles mixing headline numbers, a sparkline row, a short list, and a status tile — the summary band that sits beneath a hero."
  >
    <BentoMetricsMixed />
  </Story>
</template>
