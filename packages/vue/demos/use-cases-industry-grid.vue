<script setup lang="ts">
import UseCasesIndustryGrid from '@/components/blocks/use-cases-industry-grid/UseCasesIndustryGrid.vue'
// UseCasesIndustryGrid is the block file the user installs. Open
// `components/blocks/UseCasesIndustryGrid.vue` after install to edit the
// `useCases` array — the filter chips derive from the segments present, so
// new segments need no extra wiring.
</script>

<template>
  <Story
    title="Use Cases — Industry Grid"
    description="Filterable industry use-case grid. Segment chips narrow six cards in place; each card carries an icon, industry label, outcome headline, proof metric, and a read-more link."
  >
    <UseCasesIndustryGrid />
  </Story>
</template>
