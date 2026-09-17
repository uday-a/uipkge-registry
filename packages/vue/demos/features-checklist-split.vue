<script setup lang="ts">
import FeaturesChecklistSplit from '@/components/blocks/features-checklist-split/FeaturesChecklistSplit.vue'
// FeaturesChecklistSplit is the block file the user installs. Open
// `components/blocks/FeaturesChecklistSplit.vue` after install to edit the
// `capabilities` array; the two columns fill from one flat list.
</script>

<template>
  <Story
    title="Features — Checklist Split"
    description="Sticky pitch column beside a dense two-up capability checklist. Each line carries a short factual qualifier instead of an adjective, so the list stays scannable."
  >
    <FeaturesChecklistSplit />
  </Story>
</template>
