<script setup lang="ts">
import LeafletSalesTerritoryMap from '@/components/blocks/leaflet-sales-territory-map/LeafletSalesTerritoryMap.vue'
</script>

<template>
  <Story
    title="Territories"
    description="Region boundary polygons and quota pins on free OpenStreetMap/Esri tiles — no API key. Select a territory to fly the camera."
  >
    <LeafletSalesTerritoryMap />
  </Story>
</template>
