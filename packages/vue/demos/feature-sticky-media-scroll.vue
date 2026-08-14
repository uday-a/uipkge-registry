<script setup lang="ts">
import FeatureStickyMediaScroll from '@/components/blocks/feature-sticky-media-scroll/FeatureStickyMediaScroll.vue'
// FeatureStickyMediaScroll is the block file the user installs. Open
// `components/blocks/FeatureStickyMediaScroll.vue` after install to edit the
// `sections` array; the pinned pane keys off whichever section is centred.
</script>

<template>
  <Story
    title="Features — Sticky Media Scroll"
    description="The visual pins while copy scrolls beside it, swapping as each section enters view. Without IntersectionObserver it reads as stacked copy-and-visual pairs."
  >
    <FeatureStickyMediaScroll />
  </Story>
</template>
