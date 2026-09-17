<script setup lang="ts">
import CaseStudyMetricComparison from '@/components/blocks/case-study-metric-comparison/CaseStudyMetricComparison.vue'
// CaseStudyMetricComparison is the block file the user installs. Open
// `components/blocks/CaseStudyMetricComparison.vue` after install to edit
// the `metrics` array; direction drives the delta colour.
</script>

<template>
  <Story
    title="Case Study — Metric Comparison"
    description="One customer's results as a before-and-after table — prior value, current value, and delta per metric, under a line of context on how it was measured."
  >
    <CaseStudyMetricComparison />
  </Story>
</template>
