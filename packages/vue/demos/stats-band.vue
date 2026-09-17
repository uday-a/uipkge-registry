<script setup lang="ts">
import StatsBand from '@/components/blocks/stats-band/StatsBand.vue'
</script>

<template>
  <Story
    title="Plain"
    description="Bare full-width band. Four stats in a 2x2 grid on mobile, four columns with vertical dividers on desktop."
  >
    <StatsBand />
  </Story>

  <Story title="Bordered" description="Same band wrapped in a rounded card container with border and subtle shadow.">
    <StatsBand variant="bordered" />
  </Story>
</template>
