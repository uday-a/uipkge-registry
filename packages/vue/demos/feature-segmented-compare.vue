<script setup lang="ts">
import FeatureSegmentedCompare from '@/components/blocks/feature-segmented-compare/FeatureSegmentedCompare.vue'
// FeatureSegmentedCompare is the block file the user installs. Open
// `components/blocks/FeatureSegmentedCompare.vue` after install to rename
// the modes; both panels render from one `modes` array.
</script>

<template>
  <Story
    title="Features — Segmented Compare"
    description="A segmented control switches the section between two operating modes, swapping the capability list, the constraints, and the recommendation line."
  >
    <FeatureSegmentedCompare />
  </Story>
</template>
