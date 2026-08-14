<script setup lang="ts">
import StatsBandSparklines from '@/components/blocks/stats-band-sparklines/StatsBandSparklines.vue'
// StatsBandSparklines is the block file the user installs. Open\n// `components/blocks/StatsBandSparklines.vue` after install to feed real\n// series; the sparkline is inline SVG with no chart dependency.
</script>

<template>
  <Story
    title="Stats — Band with Sparklines"
    description="Each headline figure paired with an inline sparkline and its period, so the number arrives with the shape of the trend behind it."
  >
    <StatsBandSparklines />
  </Story>
</template>
