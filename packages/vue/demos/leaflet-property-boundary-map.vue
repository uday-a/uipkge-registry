<script setup lang="ts">
import LeafletPropertyBoundaryMap from '@/components/blocks/leaflet-property-boundary-map/LeafletPropertyBoundaryMap.vue'
</script>

<template>
  <Story
    title="Property Boundaries"
    description="Cadastral parcel polygons with zoning classes and assessed valuation on free Esri satellite tiles — no API key."
  >
    <LeafletPropertyBoundaryMap />
  </Story>
</template>
