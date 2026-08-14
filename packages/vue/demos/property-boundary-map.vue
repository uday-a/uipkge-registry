<script setup lang="ts">
import PropertyBoundaryMap from '@/components/blocks/property-boundary-map/PropertyBoundaryMap.vue'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Property Boundaries"
    description="Real estate cadastral parcel zoning and tax assessment boundary maps."
  >
    <PropertyBoundaryMap :access-token="token" />
  </Story>
</template>
