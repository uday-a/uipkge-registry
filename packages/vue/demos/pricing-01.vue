<script setup lang="ts">
import Pricing01 from '@/components/blocks/pricing-01/Pricing01.vue'
// Pricing01 ships with a monthly/yearly ToggleGroup wired up. The
// three tiers (Starter / Team / Enterprise) are spelled out inline
// in `components/blocks/Pricing01.vue` so swapping prices, copy,
// or feature lines is a direct edit.
</script>

<template>
  <Story
    title="Pricing 01"
    description="Three-tier pricing table with monthly/yearly toggle. Middle tier highlighted with a ring + 'Most popular' badge."
  >
    <Pricing01 />
  </Story>
</template>
