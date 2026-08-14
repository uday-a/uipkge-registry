<script setup lang="ts">
import RatingsStarSummary from '@/components/blocks/ratings-star-summary/RatingsStarSummary.vue'
// RatingsStarSummary is the block file the user installs. Open\n// `components/blocks/RatingsStarSummary.vue` after install to feed real\n// counts; stars render from the score, so halves need no extra markup.
</script>

<template>
  <Story
    title="Ratings — Star Summary"
    description="A large aggregate score with a partial-star row, beside the per-star distribution and the review count each bar represents."
  >
    <RatingsStarSummary />
  </Story>
</template>
