<script setup lang="ts">
import SecurityDataFlow from '@/components/blocks/security-data-flow/SecurityDataFlow.vue'
// SecurityDataFlow is the block file the user installs. Open
// `components/blocks/SecurityDataFlow.vue` after install to relabel the
// zones. Arrows are drawn in a viewBox, so they scale with the card.
</script>

<template>
  <Story
    title="Security — Data Flow"
    description="Three labelled zones joined by drawn arrows showing what crosses the boundary and what never does, with a legend separating metadata from customer rows."
  >
    <SecurityDataFlow />
  </Story>
</template>
