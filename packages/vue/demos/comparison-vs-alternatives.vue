<script setup lang="ts">
import ComparisonVsAlternatives from '@/components/blocks/comparison-vs-alternatives/ComparisonVsAlternatives.vue'
// ComparisonVsAlternatives is the block file the user installs. Open\n// `components/blocks/ComparisonVsAlternatives.vue` after install to edit the\n// `rows` array. Describing mechanisms rather than scoring rivals is the point.
</script>

<template>
  <Story
    title="Comparison — Versus Alternatives"
    description="Row-by-row comparison against the status quo, where each line names a mechanism rather than assigning the alternative a score."
  >
    <ComparisonVsAlternatives />
  </Story>
</template>
