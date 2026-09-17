<script setup lang="ts">
import PricingMatrixPlanCards from '@/components/blocks/pricing-matrix-plan-cards/PricingMatrixPlanCards.vue'
// PricingMatrixPlanCards is the block file the user installs. Open
// `components/blocks/PricingMatrixPlanCards.vue` after install to edit the
// `plans` array; inclusion is derived from one shared capability list.
</script>

<template>
  <Story
    title="Pricing — Per-Plan Comparison"
    description="Each plan as its own card of included and excluded capabilities — the shape a wide comparison matrix should take on a narrow screen."
  >
    <PricingMatrixPlanCards />
  </Story>
</template>
