<script setup lang="ts">
import RatingsAwardWall from '@/components/blocks/ratings-award-wall/RatingsAwardWall.vue'
// RatingsAwardWall is the block file the user installs. Open\n// `components/blocks/RatingsAwardWall.vue` after install to swap the entries;\n// keep the period, it is what makes an award meaningful.
</script>

<template>
  <Story
    title="Ratings — Award Wall"
    description="Award grid where each entry names the awarding body, category, and period — a badge wall that stays checkable rather than decorative."
  >
    <RatingsAwardWall />
  </Story>
</template>
