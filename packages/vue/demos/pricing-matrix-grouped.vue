<script setup lang="ts">
import PricingMatrixGrouped from '@/components/blocks/pricing-matrix-grouped/PricingMatrixGrouped.vue'
// PricingMatrixGrouped is the block file the user installs. Open
// `components/blocks/PricingMatrixGrouped.vue` after install to edit the
// `groups` array; each group collapses independently.
</script>

<template>
  <Story
    title="Pricing — Grouped Matrix"
    description="Comparison matrix with collapsible capability groups — opens on summary rows and expands only the section the reader cares about."
  >
    <PricingMatrixGrouped />
  </Story>
</template>
