<script setup lang="ts">
import LeafletMaritimeVesselMap from '@/components/blocks/leaflet-maritime-vessel-map/LeafletMaritimeVesselMap.vue'
</script>

<template>
  <Story
    title="Maritime AIS"
    description="AIS vessel monitoring across Rotterdam shipping lanes on free OpenStreetMap/Esri tiles — no API key."
  >
    <LeafletMaritimeVesselMap />
  </Story>
</template>
