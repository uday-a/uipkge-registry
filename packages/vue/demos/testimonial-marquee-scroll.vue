<script setup lang="ts">
import TestimonialMarqueeScroll from '@/components/blocks/testimonial-marquee-scroll/TestimonialMarqueeScroll.vue'
// TestimonialMarqueeScroll is the block file the user installs. Open
// `components/blocks/TestimonialMarqueeScroll.vue` after install to edit the
// quotes. The track duplicates its children to loop seamlessly.
</script>

<template>
  <Story
    title="Testimonial — Marquee Scroll"
    description="Two counter-scrolling rows of quote cards. Hover pauses the row under the cursor, reduced-motion stops both, and edge masks fade the cards into the page."
  >
    <TestimonialMarqueeScroll />
  </Story>
</template>
