<script setup lang="ts">
import FleetVehicleMap from '@/components/blocks/fleet-vehicle-map/FleetVehicleMap.vue'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story title="Fleet" description="Mapbox live tracking. Select a vehicle to fly the camera.">
    <FleetVehicleMap :access-token="token" />
  </Story>
</template>
