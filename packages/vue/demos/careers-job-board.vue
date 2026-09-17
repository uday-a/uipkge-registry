<script setup lang="ts">
import CareersJobBoard from '@/components/blocks/careers-job-board/CareersJobBoard.vue'
</script>

<template>
  <Story
    title="Default"
    description="Careers page and open positions board with perks summary, interactive department and location filters, live keyword search, and open application CTA."
  >
    <CareersJobBoard />
  </Story>

  <Story title="Custom copy" description="Customized headline and subheadline props for tailored company messaging.">
    <CareersJobBoard
      title="Build the future of UI with us"
      subtitle="We are looking for craft-obsessed engineers and designers to expand our component ecosystem."
    />
  </Story>
</template>
