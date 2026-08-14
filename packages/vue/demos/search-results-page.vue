<script setup lang="ts">
import Story from '../../components/story/Story.vue'
import SearchResultsPage from '@/components/blocks/search-results-page/SearchResultsPage.vue'
</script>

<template>
  <Story
    title="Search results page"
    description="Full search results page: pre-filled query with result count, removable filter chips, a facet sidebar, six result rows with snippets and meta, and pagination."
  >
    <SearchResultsPage />
  </Story>
</template>
