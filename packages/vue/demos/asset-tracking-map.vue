<script setup lang="ts">
import AssetTrackingMap from '@/components/blocks/asset-tracking-map/AssetTrackingMap.vue'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Asset Tracking"
    description="Intermodal shipping container tracking with cold-chain sensors and geofence alarms."
  >
    <AssetTrackingMap :access-token="token" />
  </Story>
</template>
