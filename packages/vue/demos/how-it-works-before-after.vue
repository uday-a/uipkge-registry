<script setup lang="ts">
import HowItWorksBeforeAfter from '@/components/blocks/how-it-works-before-after/HowItWorksBeforeAfter.vue'
// HowItWorksBeforeAfter is the block file the user installs. Open
// `components/blocks/HowItWorksBeforeAfter.vue` after install to edit the
// `rows` array; each row pairs one before step with its after step.
</script>

<template>
  <Story
    title="How It Works — Before & After"
    description="The old workflow set against the new one, step for step, with matched row heights so the saving at each stage is legible without reading both columns."
  >
    <HowItWorksBeforeAfter />
  </Story>
</template>
