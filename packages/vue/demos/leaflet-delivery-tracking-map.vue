<script setup lang="ts">
import LeafletDeliveryTrackingMap from '@/components/blocks/leaflet-delivery-tracking-map/LeafletDeliveryTrackingMap.vue'
</script>

<template>
  <Story
    title="Delivery Tracking"
    description="Real-time order delivery route on free OpenStreetMap tiles — no API key. Courier telemetry and arrival countdown."
  >
    <LeafletDeliveryTrackingMap />
  </Story>
</template>
