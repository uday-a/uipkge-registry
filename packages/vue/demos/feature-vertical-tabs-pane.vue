<script setup lang="ts">
import FeatureVerticalTabsPane from '@/components/blocks/feature-vertical-tabs-pane/FeatureVerticalTabsPane.vue'
// FeatureVerticalTabsPane is the block file the user installs. Open
// `components/blocks/FeatureVerticalTabsPane.vue` after install to edit the
// `features` array; the pane sizes to the tallest panel.
</script>

<template>
  <Story
    title="Features — Vertical Tabs"
    description="Vertical tabs whose triggers carry a title and summary, swapping a wide preview pane. Panels are height-matched so selecting never shifts the section."
  >
    <FeatureVerticalTabsPane />
  </Story>
</template>
