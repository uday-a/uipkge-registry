<script setup lang="ts">
import FaqCategorizedTabs from '@/components/blocks/faq-categorized-tabs/FaqCategorizedTabs.vue'
// FaqCategorizedTabs is the block file the user installs. Open
// `components/blocks/FaqCategorizedTabs.vue` after install to edit the
// `categories` array; counts derive from the entries in each.
</script>

<template>
  <Story
    title="FAQ — Categorized Tabs"
    description="Questions grouped behind category tabs, each panel an accordion with its own count. For sets too long to read as one flat list."
  >
    <FaqCategorizedTabs />
  </Story>
</template>
