<script setup lang="ts">
import FeaturesNumberedGrid from '@/components/blocks/features-numbered-grid/FeaturesNumberedGrid.vue'
// FeaturesNumberedGrid is the block file the user installs. Open
// `components/blocks/FeaturesNumberedGrid.vue` after install to edit the
// `features` array — ordinals are derived from index, so order is the source.
</script>

<template>
  <Story
    title="Features — Numbered Grid"
    description="Six-cell grid drawn with hairline dividers rather than cards. Each cell leads with a monospace ordinal, then icon, title, and two lines of copy."
  >
    <FeaturesNumberedGrid />
  </Story>
</template>
