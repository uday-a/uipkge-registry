<script setup lang="ts">
import { LeafletMap, LeafletMarker, LeafletPolygon, LeafletPolyline } from '@/components/ui/leaflet-map'

// Active leg — cased: a wide low-opacity glow under a thinner bright line.
const routePath: [number, number][] = [
  [-74.013, 40.705],
  [-74.005, 40.718],
  [-73.992, 40.733],
  [-73.985, 40.748],
  [-73.976, 40.761],
  [-73.972, 40.774],
]

// Planned extension — dashed to read as not-yet-active.
const extensionPath: [number, number][] = [
  [-73.972, 40.774],
  [-73.962, 40.79],
  [-73.955, 40.802],
]

// Dashed service zone around Midtown.
const serviceZone: [number, number][] = [
  [-74.0, 40.738],
  [-73.965, 40.738],
  [-73.965, 40.768],
  [-74.0, 40.768],
  [-74.0, 40.738],
]

const waypoints = [
  { name: 'Pickup · Battery Park', color: 'bg-emerald-500', lngLat: routePath[0] },
  { name: 'Stop · Midtown', color: 'bg-sky-400', lngLat: routePath[3] },
  { name: 'Drop-off · Central Park', color: 'bg-rose-500', lngLat: routePath[routePath.length - 1] },
]
</script>

<template>
  <Story
    title="Route Layer"
    description="Stacked LeafletPolylines build a cased route — a thick low-opacity line under a thinner bright one — plus dash-array extensions and a dashed service zone."
  >
    <LeafletMap variant="dark" :center="[-73.985, 40.748]" :zoom="12.5" class="h-96 w-full rounded-lg border">
      <LeafletPolygon
        :lng-lat-path="serviceZone"
        color="#38bdf8"
        :weight="1.5"
        :opacity="0.7"
        dash-array="8 6"
        :fill="true"
        fill-color="#38bdf8"
        :fill-opacity="0.08"
      />
      <!-- Casing glow -->
      <LeafletPolyline :lng-lat-path="routePath" color="#e2e8f0" :weight="9" :opacity="0.25" line-cap="round" />
      <!-- Bright route core -->
      <LeafletPolyline :lng-lat-path="routePath" color="#38bdf8" :weight="4" :opacity="1" line-cap="round" />
      <!-- Dashed planned extension -->
      <LeafletPolyline
        :lng-lat-path="extensionPath"
        color="#f59e0b"
        :weight="3"
        :opacity="0.9"
        dash-array="2 8"
        line-cap="round"
      />
      <LeafletMarker v-for="w in waypoints" :key="w.name" :lng-lat="w.lngLat" anchor="bottom">
        <div class="flex flex-col items-center">
          <span class="border-background size-3 rounded-full border-2 shadow" :class="w.color" />
          <span
            class="border-border bg-card/95 text-foreground mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs"
          >
            {{ w.name }}
          </span>
        </div>
      </LeafletMarker>
    </LeafletMap>
  </Story>
</template>
