<script setup lang="ts">
import ResourcesCategoryGrid from '@/components/blocks/resources-category-grid/ResourcesCategoryGrid.vue'
// ResourcesCategoryGrid is the block file the user installs. Open\n// `components/blocks/ResourcesCategoryGrid.vue` after install to wire the\n// categories to your CMS.
</script>

<template>
  <Story
    title="Resources — Category Grid"
    description="Resource library by category, each card listing its three most recent entries with kind and read time, over a link to the full archive."
  >
    <ResourcesCategoryGrid />
  </Story>
</template>
