<script setup lang="ts">
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'
</script>

<template>
  <Story
    title="Streets Basemap"
    description="Detailed urban street networks, transit stations, and local points of interest on free OpenStreetMap Standard tiles."
  >
    <LeafletMap variant="streets" :center="[-73.985, 40.748]" :zoom="13.5" class="h-96 w-full rounded-lg border">
      <LeafletMarker :lng-lat="[-73.985, 40.748]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            Empire State Building
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
