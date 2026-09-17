<script setup lang="ts">
import LeafletLastMileCourierDispatch from '@/components/blocks/leaflet-last-mile-courier-dispatch/LeafletLastMileCourierDispatch.vue'
</script>

<template>
  <Story
    title="Default"
    description="Last-mile courier dispatch matrix on free OpenStreetMap tiles — no API key. Route progress, ETA telemetry, and POD logging."
  >
    <div class="p-4">
      <LeafletLastMileCourierDispatch />
    </div>
  </Story>
</template>
