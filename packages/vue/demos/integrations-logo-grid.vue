<script setup lang="ts">
import IntegrationsLogoGrid from '@/components/blocks/integrations-logo-grid/IntegrationsLogoGrid.vue'
// IntegrationsLogoGrid is the block file the user installs. Open
// `components/blocks/IntegrationsLogoGrid.vue` after install and swap the
// monogram tiles for real logos — the grid sizes to whatever you drop in.
</script>

<template>
  <Story
    title="Integrations — Logo Grid"
    description="Category chips filter a wall of square integration tiles. Each tile names its integration on hover; a count line and request prompt close the section."
  >
    <IntegrationsLogoGrid />
  </Story>
</template>
