<script setup lang="ts">
import { LeafletMap, LeafletMarker, LeafletPopup } from '@/components/ui/leaflet-map'

const sites = [
  {
    id: 'hq',
    name: 'Global Operations HQ',
    detail: '350 5th Ave, New York, NY 10118',
    status: 'Active · 1,420 staff',
    lngLat: [-73.985, 40.748] as [number, number],
  },
  {
    id: 'depot',
    name: 'East River Depot',
    detail: '12 W 34th St, New York, NY 10001',
    status: 'Active · 24 bays',
    lngLat: [-73.961, 40.763] as [number, number],
  },
  {
    id: 'annex',
    name: 'Hudson Yards Annex',
    detail: '545 W 30th St, New York, NY 10001',
    status: 'Opening Q3 · 9 bays',
    lngLat: [-74.002, 40.754] as [number, number],
  },
]
</script>

<template>
  <Story
    title="Marker Popups"
    description="LeafletPopup nested inside LeafletMarker binds to it — popups open on marker click, no state wiring needed."
  >
    <LeafletMap variant="streets" :center="[-73.985, 40.748]" :zoom="13.5" class="h-96 w-full rounded-lg border">
      <LeafletMarker v-for="site in sites" :key="site.id" :lng-lat="site.lngLat" anchor="bottom">
        <div class="group flex cursor-pointer flex-col items-center">
          <span
            class="bg-primary ring-primary/25 size-3.5 rounded-full ring-4 transition-transform group-hover:scale-110"
          />
          <span
            class="border-border bg-background/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-xs"
          >
            {{ site.name }}
          </span>
        </div>
        <!-- Bound popup: opens when its parent marker is clicked. -->
        <LeafletPopup :offset="[0, -38]" class="space-y-1 text-xs">
          <div class="text-foreground font-bold">{{ site.name }}</div>
          <div class="text-muted-foreground">{{ site.detail }}</div>
          <div class="font-mono text-xs font-medium text-emerald-500">{{ site.status }}</div>
        </LeafletPopup>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
