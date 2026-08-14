<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapMarker, MapSource, MapLayer, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

defineProps<{ accessToken?: string }>()

const mapRef = ref<MapRef | null>(null)
const selectedTime = ref<10 | 20 | 30>(20)

const hubLocation: [number, number] = [-87.6298, 41.8781] // Chicago Loop

// Approximated polygon coordinates for 10m, 20m, 30m isochrones
function createIsochroneCoords(radiusMiles: number) {
  const points: [number, number][] = []
  const steps = 36
  const latDelta = radiusMiles / 69
  const lngDelta = radiusMiles / (69 * Math.cos((41.8781 * Math.PI) / 180))
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    // Add small organic jitter
    const jitter = 1 + Math.sin(angle * 3) * 0.12
    const lng = hubLocation[0] + lngDelta * Math.cos(angle) * jitter
    const lat = hubLocation[1] + latDelta * Math.sin(angle) * jitter
    points.push([lng, lat])
  }
  return points
}

const isochrones = {
  10: { coords: createIsochroneCoords(2.8), pop: '340K', jobs: '520K', color: '#10b981', label: '10 Min Commute' },
  20: { coords: createIsochroneCoords(6.2), pop: '1.24M', jobs: '890K', color: '#3b82f6', label: '20 Min Commute' },
  30: { coords: createIsochroneCoords(11.5), pop: '2.85M', jobs: '1.45M', color: '#8b5cf6', label: '30 Min Commute' },
}
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <Map
        ref="mapRef"
        :access-token="accessToken"
        variant="light"
        :center="hubLocation"
        :zoom="10.8"
        class="h-full w-full"
      >
        <!-- 30m Isochrone Fill & Line -->
        <MapSource
          id="iso-30"
          :options="{
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Polygon', coordinates: [isochrones[30].coords] },
            },
          }"
        />
        <MapLayer
          id="iso-30-fill"
          :options="{
            type: 'fill',
            source: 'iso-30',
            paint: { 'fill-color': '#8b5cf6', 'fill-opacity': selectedTime >= 30 ? 0.15 : 0.04 },
          }"
        />
        <MapLayer
          id="iso-30-line"
          :options="{
            type: 'line',
            source: 'iso-30',
            paint: { 'line-color': '#8b5cf6', 'line-width': 1.5, 'line-dasharray': [2, 2] },
          }"
        />

        <!-- 20m Isochrone Fill & Line -->
        <MapSource
          id="iso-20"
          :options="{
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Polygon', coordinates: [isochrones[20].coords] },
            },
          }"
        />
        <MapLayer
          id="iso-20-fill"
          :options="{
            type: 'fill',
            source: 'iso-20',
            paint: { 'fill-color': '#3b82f6', 'fill-opacity': selectedTime >= 20 ? 0.22 : 0.06 },
          }"
        />
        <MapLayer
          id="iso-20-line"
          :options="{
            type: 'line',
            source: 'iso-20',
            paint: { 'line-color': '#3b82f6', 'line-width': 2 },
          }"
        />

        <!-- 10m Isochrone Fill & Line -->
        <MapSource
          id="iso-10"
          :options="{
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Polygon', coordinates: [isochrones[10].coords] },
            },
          }"
        />
        <MapLayer
          id="iso-10-fill"
          :options="{
            type: 'fill',
            source: 'iso-10',
            paint: { 'fill-color': '#10b981', 'fill-opacity': 0.3 },
          }"
        />
        <MapLayer
          id="iso-10-line"
          :options="{
            type: 'line',
            source: 'iso-10',
            paint: { 'line-color': '#10b981', 'line-width': 2.5 },
          }"
        />

        <!-- Central Hub Marker -->
        <MapMarker :lng-lat="hubLocation" anchor="center">
          <div class="relative flex items-center justify-center">
            <span class="bg-primary/30 absolute size-6 animate-ping rounded-full" />
            <div
              class="bg-primary text-primary-foreground ring-background flex size-6 items-center justify-center rounded-full font-mono text-xs font-bold shadow-md ring-2"
            >
              ★
            </div>
          </div>
        </MapMarker>
      </Map>
    </div>

    <!-- Isochrone Analytics Card -->
    <Card class="flex flex-col justify-between">
      <CardHeader>
        <div class="flex items-center justify-between">
          <Badge variant="outline" class="font-mono text-xs">COMMUTE ANALYSIS</Badge>
          <Badge class="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">Drive-Time</Badge>
        </div>
        <CardTitle class="mt-2 text-lg">Reachability Zones</CardTitle>
        <CardDescription>Transit reachability from Downtown Distribution Hub.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Range Selector Tabs -->
        <div class="border-border bg-muted grid grid-cols-3 gap-1 rounded-lg border p-1 text-xs">
          <button
            v-for="t in [10, 20, 30] as const"
            :key="t"
            type="button"
            class="rounded-md py-1.5 font-medium transition-all"
            :class="
              selectedTime === t
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="selectedTime = t"
          >
            {{ t }} mins
          </button>
        </div>

        <div class="border-border space-y-3 border-t pt-3">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs">Population Reach</span>
            <span class="text-foreground font-mono text-base font-bold">{{ isochrones[selectedTime].pop }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs">Workforce / Labor Pool</span>
            <span class="text-foreground font-mono text-base font-bold">{{ isochrones[selectedTime].jobs }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs">Service Band</span>
            <span class="font-mono text-xs font-semibold" :style="{ color: isochrones[selectedTime].color }">
              {{ isochrones[selectedTime].label }}
            </span>
          </div>
        </div>

        <div class="border-border text-muted-foreground space-y-2 border-t pt-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-emerald-500" />
            <span>Green ring: 10-minute urban core</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-blue-500" />
            <span>Blue ring: 20-minute metropolitan belt</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-purple-500" />
            <span>Purple ring: 30-minute outer ring</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
