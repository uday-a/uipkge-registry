<script setup lang="ts">
import LeafletThreatMapRadar from '@/components/blocks/leaflet-threat-map-radar/LeafletThreatMapRadar.vue'
</script>

<template>
  <Story
    title="Threat Radar"
    description="Leaflet dark world canvas with attack arcs into edge PoPs under a radar sweep — no API key. Click an origin to isolate its vector."
  >
    <LeafletThreatMapRadar />
  </Story>
</template>
