<script setup lang="ts">
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'
</script>

<template>
  <Story
    title="Satellite Hybrid"
    description="High-resolution Esri aerial imagery layered with reference boundaries and place-name labels."
  >
    <LeafletMap
      variant="satellite-streets"
      :center="[-122.478, 37.819]"
      :zoom="13"
      class="h-96 w-full rounded-lg border"
    >
      <LeafletMarker :lng-lat="[-122.478, 37.819]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            Golden Gate Strait
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
