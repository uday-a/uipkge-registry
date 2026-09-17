<script setup lang="ts">
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="3D Extruded Buildings"
    description="Real-time 3D building footprint extrusion with 60° camera pitch and ambient roof shading."
  >
    <Map
      :access-token="token"
      variant="dark"
      :center="[-73.985, 40.748]"
      :zoom="15.8"
      :pitch="60"
      :bearing="-17"
      :buildings3d="true"
      class="h-96 w-full rounded-lg border"
    >
      <MapMarker :lng-lat="[-73.985, 40.748]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="size-3 animate-ping rounded-full bg-sky-400" />
          <span
            class="border-border bg-background/95 mt-1 rounded border px-2 py-0.5 font-mono text-xs font-bold text-sky-500 shadow-md"
          >
            Midtown Tower
          </span>
        </div>
      </MapMarker>
    </Map>
  </Story>
</template>
