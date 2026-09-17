<script setup lang="ts">
import IsochroneReachabilityMap from '@/components/blocks/isochrone-reachability-map/IsochroneReachabilityMap.vue'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Reachability"
    description="Drive-time isochrone polygons with population reach and workforce analytics."
  >
    <IsochroneReachabilityMap :access-token="token" />
  </Story>
</template>
