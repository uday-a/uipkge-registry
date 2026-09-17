<script setup lang="ts">
import DemoGuidedTour from '@/components/blocks/demo-guided-tour/DemoGuidedTour.vue'
// DemoGuidedTour is the block file the user installs. Open\n// `components/blocks/DemoGuidedTour.vue` after install to retarget the\n// steps; each step names the element it highlights.
</script>

<template>
  <Story
    title="Demo — Guided Tour"
    description="Next and previous move a highlight across a mocked interface, with a step counter and a skip control for people who would rather just read."
  >
    <DemoGuidedTour />
  </Story>
</template>
