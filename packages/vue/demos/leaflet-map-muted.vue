<script setup lang="ts">
import { LeafletMap, LeafletMarker } from '@/components/ui/leaflet-map'
</script>

<template>
  <Story
    title="Muted Minimal"
    description="Desaturated theme-aware canvas where roads and terrain recede, giving custom telemetry markers visual priority."
  >
    <LeafletMap variant="muted" :center="[139.6917, 35.6895]" :zoom="12" class="h-96 w-full rounded-lg border">
      <LeafletMarker :lng-lat="[139.6917, 35.6895]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            Shinjuku Hub
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
