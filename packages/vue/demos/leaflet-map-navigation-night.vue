<script setup lang="ts">
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'
</script>

<template>
  <Story
    title="Navigation Night"
    description="Low-glare high-contrast Esri dark canvas night HUD palette for distraction-free night driving."
  >
    <LeafletMap
      variant="navigation-night"
      :center="[-74.006, 40.7128]"
      :zoom="14"
      class="h-96 w-full rounded-lg border"
    >
      <LeafletMarker :lng-lat="[-74.006, 40.7128]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            FiDi Night Corridor
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
