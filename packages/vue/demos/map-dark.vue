<script setup lang="ts">
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Dark Canvas"
    description="Monochromatic dark palette designed for mission-critical dashboards and high-contrast glowing overlays."
  >
    <Map
      :access-token="token"
      variant="dark"
      :center="[-74.006, 40.7128]"
      :zoom="12"
      class="h-96 w-full rounded-lg border"
    >
      <MapMarker :lng-lat="[-74.006, 40.7128]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            Manhattan Night Grid
          </span>
        </div>
      </MapMarker>
    </Map>
  </Story>
</template>
