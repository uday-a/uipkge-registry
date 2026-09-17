<script setup lang="ts">
import { PricingTierComparisonMatrix } from '@/components/blocks/pricing-tier-comparison-matrix'
import Story from '@/components/story/Story.vue'
</script>

<template>
  <Story title="Default" description="Pricing tier cards with billing cycle switch and detailed feature matrix">
    <div class="w-full">
      <PricingTierComparisonMatrix />
    </div>
  </Story>
</template>
