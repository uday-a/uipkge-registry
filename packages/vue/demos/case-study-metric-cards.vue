<script setup lang="ts">
import CaseStudyMetricCards from '@/components/blocks/case-study-metric-cards/CaseStudyMetricCards.vue'
// CaseStudyMetricCards is the block file the user installs. Open
// `components/blocks/CaseStudyMetricCards.vue` after install to swap the
// `studies` array for real customers — metric first, quote second is the
// order that survives skim-reading.
</script>

<template>
  <Story
    title="Case Studies — Metric Cards"
    description="Three-up customer results. Each card leads with the headline metric, then the customer wordmark, a one-line outcome, a pull quote with attribution, and a link to the full story."
  >
    <CaseStudyMetricCards />
  </Story>
</template>
