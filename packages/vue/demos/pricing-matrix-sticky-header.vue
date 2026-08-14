<script setup lang="ts">
import PricingMatrixStickyHeader from '@/components/blocks/pricing-matrix-sticky-header/PricingMatrixStickyHeader.vue'
// PricingMatrixStickyHeader is the block file the user installs. Open
// `components/blocks/PricingMatrixStickyHeader.vue` after install to edit
// the `rows` array. The header pins with sticky positioning, no JS.
</script>

<template>
  <Story
    title="Pricing — Sticky Header Matrix"
    description="Long feature matrix with a pinned plan header row, so a checkmark thirty rows down is still attributable to the right column."
  >
    <PricingMatrixStickyHeader />
  </Story>
</template>
