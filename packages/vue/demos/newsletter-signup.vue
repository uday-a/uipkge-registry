<script setup lang="ts">
import NewsletterSignup from '@/components/blocks/newsletter-signup/NewsletterSignup.vue'
</script>

<template>
  <Story
    title="Centered"
    description="Muted mail tile, headline and copy, joined input + button form with fine print. Flips to a subscribed confirmation after submit."
  >
    <NewsletterSignup variant="centered" />
  </Story>

  <Story
    title="Split"
    description="Bordered card container with copy and check-mark benefits on the left, form on the right. Flips to a subscribed confirmation after submit."
  >
    <NewsletterSignup variant="split" />
  </Story>
</template>
