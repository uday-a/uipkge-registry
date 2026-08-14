<script setup lang="ts">
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'
</script>

<template>
  <Story
    title="Outdoors & Topo"
    description="OpenTopoMap contour lines, mountain relief, and hiking trail networks across Yosemite National Park."
  >
    <LeafletMap variant="outdoors" :center="[-119.5383, 37.8651]" :zoom="11" class="h-96 w-full rounded-lg border">
      <LeafletMarker :lng-lat="[-119.5383, 37.8651]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            Yosemite Valley
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
