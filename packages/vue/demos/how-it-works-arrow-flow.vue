<script setup lang="ts">
import HowItWorksArrowFlow from '@/components/blocks/how-it-works-arrow-flow/HowItWorksArrowFlow.vue'
// HowItWorksArrowFlow is the block file the user installs. Open
// `components/blocks/HowItWorksArrowFlow.vue` after install to edit the
// `stages` array — the arrows are drawn between cells, so any count works.
</script>

<template>
  <Story
    title="How It Works — Arrow Flow"
    description="Four stages joined by drawn arrows, each with an icon tile, label, and the artefact it produces. Below the breakpoint the row becomes a vertical rail."
  >
    <HowItWorksArrowFlow />
  </Story>
</template>
