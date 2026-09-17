<script setup lang="ts">
import MaritimeVesselMap from '@/components/blocks/maritime-vessel-map/MaritimeVesselMap.vue'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Maritime AIS"
    description="Automatic Identification System vessel monitoring in congested international shipping lanes."
  >
    <MaritimeVesselMap :access-token="token" />
  </Story>
</template>
