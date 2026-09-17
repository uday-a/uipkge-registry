<script setup lang="ts">
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'
</script>

<template>
  <Story
    title="Light Canvas"
    description="Clean editorial light palette on Esri Light Gray Canvas for SaaS reporting, print-ready graphics, and billing portals."
  >
    <LeafletMap variant="light" :center="[2.3522, 48.8566]" :zoom="12.5" class="h-96 w-full rounded-lg border">
      <LeafletMarker :lng-lat="[2.3522, 48.8566]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            Paris Central District
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
