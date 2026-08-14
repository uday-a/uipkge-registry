<script setup lang="ts">
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'
</script>

<template>
  <Story
    title="Satellite Pure"
    description="Photorealistic high-resolution Esri World Imagery without labels or boundaries."
  >
    <LeafletMap variant="satellite" :center="[-112.1129, 36.1069]" :zoom="11.5" class="h-96 w-full rounded-lg border">
      <LeafletMarker :lng-lat="[-112.1129, 36.1069]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            Grand Canyon South Rim
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
