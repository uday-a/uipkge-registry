<script setup lang="ts">
import ResourcesTeaserGrid from '@/components/blocks/resources-teaser-grid/ResourcesTeaserGrid.vue'
// ResourcesTeaserGrid is the block file the user installs. Open
// `components/blocks/ResourcesTeaserGrid.vue` after install to wire the
// `featured` and `recent` entries to your CMS. Kind badges are plain
// strings, so any taxonomy works.
</script>

<template>
  <Story
    title="Resources Teaser Grid"
    description="Blog and resources teaser. A featured article spans two columns with kind badge and read time, beside a stacked list of four recent pieces and a view-all link row."
  >
    <ResourcesTeaserGrid />
  </Story>
</template>
