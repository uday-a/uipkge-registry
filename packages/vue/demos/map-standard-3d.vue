<script setup lang="ts">
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Standard 3D"
    description="Next-gen Mapbox Standard basemap featuring dynamic lighting, sun position simulation, and 3D buildings."
  >
    <Map
      :access-token="token"
      variant="standard"
      :center="[139.6917, 35.6895]"
      :zoom="14"
      :pitch="45"
      class="h-96 w-full rounded-lg border"
    >
      <MapMarker :lng-lat="[139.6917, 35.6895]" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
          <span
            class="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs"
          >
            Tokyo Shinjuku District
          </span>
        </div>
      </MapMarker>
    </Map>
  </Story>
</template>
