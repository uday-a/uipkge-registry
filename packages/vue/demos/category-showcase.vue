<script setup lang="ts">
import CategoryShowcase from '@/components/blocks/category-showcase/CategoryShowcase.vue'
</script>

<template>
  <Story
    title="Bento Layout"
    description="Asymmetric 4x2 bento grid featuring a 2x2 hero collection tile with scrim overlay, three category cards with zoom on hover, and an archive sale promo card."
  >
    <CategoryShowcase />
  </Story>

  <Story
    title="Grid Layout"
    description="Symmetric multi-column grid layout where categories and featured promotions adapt across responsive columns."
  >
    <CategoryShowcase variant="grid" />
  </Story>
</template>
