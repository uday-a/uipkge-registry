<script setup lang="ts">
import ShipmentTrackingTimeline from '@/components/blocks/shipment-tracking-timeline/ShipmentTrackingTimeline.vue'
</script>

<template>
  <Story
    title="Default"
    description="Flexport & Maersk style container freight tracking timeline with live AIS vessel telemetry, voyage ETA milestones, Reefer cold-chain specifications, and multimodal transport logistics."
  >
    <ShipmentTrackingTimeline />
  </Story>

  <Story
    title="Completed milestones filter"
    description="Tracking view pre-filtered to show historical completed journey milestones from factory loading to departure."
  >
    <ShipmentTrackingTimeline initial-filter="completed" />
  </Story>

  <Story
    title="Upcoming milestones filter"
    description="Tracking view focused on pending voyage milestones including canal transit, port berthing, and hinterland delivery."
  >
    <ShipmentTrackingTimeline initial-filter="upcoming" />
  </Story>
</template>
