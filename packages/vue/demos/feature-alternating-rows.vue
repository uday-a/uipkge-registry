<script setup lang="ts">
import FeatureAlternatingRows from '@/components/blocks/feature-alternating-rows/FeatureAlternatingRows.vue'
// FeatureAlternatingRows is the block file the user installs. Open
// `components/blocks/FeatureAlternatingRows.vue` after install to edit the
// `rows` array — `reverse` flips a row, so the alternation stays automatic.
</script>

<template>
  <Story
    title="Feature Deep-Dive — Alternating Rows"
    description="Zig-zag feature deep-dive. Three rows alternate copy and visual; each pairs an eyebrow, headline, benefit checklist, and inline link with a bordered preview panel."
  >
    <FeatureAlternatingRows />
  </Story>
</template>
