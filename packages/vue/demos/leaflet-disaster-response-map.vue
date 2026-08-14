<script setup lang="ts">
import LeafletDisasterResponseMap from '@/components/blocks/leaflet-disaster-response-map/LeafletDisasterResponseMap.vue'
</script>

<template>
  <Story
    title="Disaster Response"
    description="Emergency incident perimeter rings with shelter occupancy and relief staging on free tiles — no API key."
  >
    <LeafletDisasterResponseMap />
  </Story>
</template>
