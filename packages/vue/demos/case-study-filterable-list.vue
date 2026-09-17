<script setup lang="ts">
import CaseStudyFilterableList from '@/components/blocks/case-study-filterable-list/CaseStudyFilterableList.vue'
// CaseStudyFilterableList is the block file the user installs. Open
// `components/blocks/CaseStudyFilterableList.vue` after install to point the
// `studies` array at your CMS; chips derive from the industries present.
</script>

<template>
  <Story
    title="Case Studies — Filterable List"
    description="Filterable index of customer stories. Industry chips narrow rows carrying the headline result, stack, and read time; an empty state covers no matches."
  >
    <CaseStudyFilterableList />
  </Story>
</template>
