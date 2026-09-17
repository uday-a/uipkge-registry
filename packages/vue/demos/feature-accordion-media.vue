<script setup lang="ts">
import FeatureAccordionMedia from '@/components/blocks/feature-accordion-media/FeatureAccordionMedia.vue'
// FeatureAccordionMedia is the block file the user installs. Open
// `components/blocks/FeatureAccordionMedia.vue` after install to swap the
// panes for screenshots. The open item drives the pane via v-model.
</script>

<template>
  <Story
    title="Features — Accordion with Media"
    description="Accordion of features beside a media pane that follows whichever item is open; below the breakpoint the panes move inline under each item."
  >
    <FeatureAccordionMedia />
  </Story>
</template>
