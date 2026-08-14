<script setup lang="ts">
import RatingsReviewBadges from '@/components/blocks/ratings-review-badges/RatingsReviewBadges.vue'
// RatingsReviewBadges is the block file the user installs. Open
// `components/blocks/RatingsReviewBadges.vue` after install to edit the
// `platforms` and `distribution` arrays. Stars are rendered from the score,
// so a half-star value needs no extra markup.
</script>

<template>
  <Story
    title="Ratings & Review Badges"
    description="Third-party rating proof. Four platform cards show stars, score, review count, and category award, over a rating-distribution breakdown and a verified-reviews footnote."
  >
    <RatingsReviewBadges />
  </Story>
</template>
