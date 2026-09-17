<script setup lang="ts">
import IntegrationsFeaturedPairs from '@/components/blocks/integrations-featured-pairs/IntegrationsFeaturedPairs.vue'
// IntegrationsFeaturedPairs is the block file the user installs. Open
// `components/blocks/IntegrationsFeaturedPairs.vue` after install to edit the
// `featured` array; steps render from a plain string list.
</script>

<template>
  <Story
    title="Integrations — Featured Pairs"
    description="Three promoted integrations. Each card pairs the service with what the connection does, its three setup steps, and a live connection state."
  >
    <IntegrationsFeaturedPairs />
  </Story>
</template>
