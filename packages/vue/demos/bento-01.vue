<script setup lang="ts">
import Bento01 from '@/components/blocks/bento-01/Bento01.vue'
// Bento01 is four independent tiles in a 4×2 grid. Each tile is a
// separate Card in `components/blocks/Bento01.vue` — edit any one
// in place (swap the icon, change the stat, replace the mini chart)
// without touching the others.
</script>

<template>
  <Story
    title="Bento 01"
    description="Four-tile bento. One 2×2 hero with progress + stats, one 2×1 wide tile, two 1×1 squares (big-number stat + compliance line)."
  >
    <Bento01 />
  </Story>
</template>
