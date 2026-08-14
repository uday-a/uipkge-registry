<script setup lang="ts">
import DeliveryTrackingMap from '@/components/blocks/delivery-tracking-map/DeliveryTrackingMap.vue'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Delivery Tracking"
    description="Real-time order delivery route with courier telemetry and arrival countdown."
  >
    <DeliveryTrackingMap :access-token="token" />
  </Story>
</template>
