<script setup lang="ts">
import IntegrationsSearchDirectory from '@/components/blocks/integrations-search-directory/IntegrationsSearchDirectory.vue'
// IntegrationsSearchDirectory is the block file the user installs. Open
// `components/blocks/IntegrationsSearchDirectory.vue` after install to point
// the `integrations` array at your catalog; filtering is plain substring.
</script>

<template>
  <Story
    title="Integrations — Search Directory"
    description="Live-filtered integration directory. Typing narrows category-grouped rows carrying a monogram, blurb, and auth type; an empty state appears when nothing matches."
  >
    <IntegrationsSearchDirectory />
  </Story>
</template>
