<script setup lang="ts">
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

const globeHubs = [
  { name: 'SFO', coords: [-122.4194, 37.7749] as [number, number] },
  { name: 'JFK', coords: [-73.7781, 40.6413] as [number, number] },
  { name: 'LHR', coords: [-0.4543, 51.47] as [number, number] },
  { name: 'HND', coords: [139.7811, 35.5494] as [number, number] },
]
</script>

<template>
  <Story
    title="3D Globe Projection"
    description="Spherical planetary globe projection with atmospheric fog glow and transcontinental hubs."
  >
    <Map
      :access-token="token"
      :center="[15, 25]"
      :zoom="1.8"
      projection="globe"
      muted
      class="h-96 w-full rounded-lg border"
    >
      <MapMarker v-for="h in globeHubs" :key="h.name" :lng-lat="h.coords" anchor="center">
        <div class="group relative flex cursor-pointer items-center justify-center">
          <span class="absolute size-5 animate-ping rounded-full bg-sky-400/20" />
          <div class="size-2.5 rounded-full bg-sky-500 shadow-xs ring-2 ring-white" />
          <span
            class="border-border/80 bg-background/90 absolute bottom-full mb-1 hidden rounded border px-1.5 py-0.5 font-mono text-xs whitespace-nowrap shadow-xs group-hover:block"
          >
            {{ h.name }}
          </span>
        </div>
      </MapMarker>
    </Map>
  </Story>
</template>
