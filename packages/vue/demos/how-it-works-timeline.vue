<script setup lang="ts">
import HowItWorksTimeline from '@/components/blocks/how-it-works-timeline/HowItWorksTimeline.vue'
// HowItWorksTimeline is the block file the user installs. Open
// `components/blocks/HowItWorksTimeline.vue` after install to edit the
// `stages` array — the rail and numbering derive from it, so adding or
// removing a stage needs no markup changes.
</script>

<template>
  <Story
    title="How It Works — Vertical Timeline"
    description="Vertical implementation timeline. A continuous rail links four numbered stages; each carries a status badge, outcome bullets, and a paired detail card. Use where a three-up step row runs out of room."
  >
    <HowItWorksTimeline />
  </Story>
</template>
