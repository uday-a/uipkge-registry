<script setup lang="ts">
import FlightRadarMap from '@/components/blocks/flight-radar-map/FlightRadarMap.vue'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Flight Radar"
    description="Live aviation airspace monitoring with aircraft altitudes, velocities, and telemetry."
  >
    <FlightRadarMap :access-token="token" />
  </Story>
</template>
