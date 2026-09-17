<script setup lang="ts">
import FaqTwoColumn from '@/components/blocks/faq-two-column/FaqTwoColumn.vue'
// FaqTwoColumn is the block file the user installs. Open
// `components/blocks/FaqTwoColumn.vue` after install to edit the `faqs`
// array; entries are dealt into the two columns automatically.
</script>

<template>
  <Story
    title="FAQ — Two Column"
    description="Two independent accordion columns. Expanding a long answer on the left never shifts the questions on the right, which a single-column list cannot avoid."
  >
    <FaqTwoColumn />
  </Story>
</template>
