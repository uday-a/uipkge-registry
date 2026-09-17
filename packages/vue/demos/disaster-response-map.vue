<script setup lang="ts">
import DisasterResponseMap from '@/components/blocks/disaster-response-map/DisasterResponseMap.vue'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Disaster Response"
    description="Emergency incident perimeter with shelter occupancy rates and relief staging hubs."
  >
    <DisasterResponseMap :access-token="token" />
  </Story>
</template>
