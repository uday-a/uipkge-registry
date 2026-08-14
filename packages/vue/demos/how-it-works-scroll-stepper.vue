<script setup lang="ts">
import HowItWorksScrollStepper from '@/components/blocks/how-it-works-scroll-stepper/HowItWorksScrollStepper.vue'
// HowItWorksScrollStepper is the block file the user installs. Open
// `components/blocks/HowItWorksScrollStepper.vue` after install to edit the
// `steps` array. The observer is set up on mount and torn down on unmount.
</script>

<template>
  <Story
    title="How It Works — Scroll Stepper"
    description="Scroll-driven walkthrough. A sticky rail tracks which step is in view as the copy scrolls past; without IntersectionObserver it degrades to a plain list."
  >
    <HowItWorksScrollStepper />
  </Story>
</template>
