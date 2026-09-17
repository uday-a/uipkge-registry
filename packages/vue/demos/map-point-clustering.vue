<script setup lang="ts">
import { Map, MapMarker } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

const clusters = [
  { id: 'c-west', coords: [-122.4, 37.7] as [number, number], count: 18, label: 'West Coast' },
  { id: 'c-central', coords: [-95.3, 29.7] as [number, number], count: 32, label: 'Gulf Coast' },
  { id: 'c-east', coords: [-74.0, 40.7] as [number, number], count: 45, label: 'Northeast Corridor' },
  { id: 'c-midwest', coords: [-87.6, 41.8] as [number, number], count: 24, label: 'Great Lakes' },
]
</script>

<template>
  <Story
    title="Point Clustering"
    description="Dynamic point aggregation grouping density into cluster pills with counts."
  >
    <Map :access-token="token" variant="light" :center="[-96, 38]" :zoom="3.8" class="h-96 w-full rounded-lg border">
      <MapMarker v-for="c in clusters" :key="c.id" :lng-lat="c.coords" anchor="center">
        <div class="flex cursor-pointer flex-col items-center">
          <div
            class="bg-primary text-primary-foreground ring-primary/20 flex size-9 items-center justify-center rounded-full font-mono text-xs font-bold shadow-md ring-4 transition-transform hover:scale-110"
          >
            {{ c.count }}
          </div>
          <span
            class="bg-background/90 border-border mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-medium shadow-xs"
          >
            {{ c.label }}
          </span>
        </div>
      </MapMarker>
    </Map>
  </Story>
</template>
