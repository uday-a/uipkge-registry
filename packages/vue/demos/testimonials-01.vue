<script setup lang="ts">
import Testimonials01 from '@/components/blocks/testimonials-01/Testimonials01.vue'
// Testimonials01 hard-codes three quotes inline. Replace the
// `testimonials` array (or expand it) in
// `components/blocks/Testimonials01.vue` — the pip nav scales with
// array length automatically.
</script>

<template>
  <Story
    title="Testimonials 01"
    description="Centered single-card carousel. Quote icon, large pull-quote, avatar with initials, name + role + company. Pip row flips between testimonials."
  >
    <Testimonials01 />
  </Story>
</template>
