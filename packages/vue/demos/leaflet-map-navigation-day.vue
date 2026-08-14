<script setup lang="ts">
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'
</script>

<template>
  <Story
    title="Navigation Day"
    description="High-contrast Esri World Street Map palette designed for turn-by-turn routing and daytime fleet navigation."
  >
    <LeafletMap
      variant="navigation-day"
      :center="[-122.401, 37.787]"
      :zoom="14.5"
      class="h-96 w-full rounded-lg border"
    >
      <LeafletMarker :lng-lat="[-122.401, 37.787]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            Ferry Building Terminal
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
