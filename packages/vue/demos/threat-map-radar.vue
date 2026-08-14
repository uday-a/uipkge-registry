<script setup lang="ts">
import ThreatMapRadar from '@/components/blocks/threat-map-radar/ThreatMapRadar.vue'
</script>

<template>
  <Story
    title="Threat Radar"
    description="Mapbox world canvas with live attack arcs into edge PoPs. Click an origin to isolate its vector."
  >
    <ThreatMapRadar />
  </Story>
</template>
