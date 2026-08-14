<script setup lang="ts">
import IntegrationsHubDiagram from '@/components/blocks/integrations-hub-diagram/IntegrationsHubDiagram.vue'
// IntegrationsHubDiagram is the block file the user installs. Open
// `components/blocks/IntegrationsHubDiagram.vue` after install to change the
// `nodes` array — positions are computed on a circle, so any count works.
</script>

<template>
  <Story
    title="Integrations — Hub Diagram"
    description="Radial hub diagram. Drawn SVG spokes connect a central platform node to eight orbiting services, with a legend separating sources from destinations."
  >
    <IntegrationsHubDiagram />
  </Story>
</template>
