<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeafletMap, LeafletMarker, LeafletPolygon, type LeafletMapRef } from '@/components/ui/leaflet-map'

export interface LeafletIsochroneReachabilityMapProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<LeafletIsochroneReachabilityMapProps>()

const mapRef = ref<LeafletMapRef | null>(null)
const selectedTime = ref<10 | 20 | 30>(20)

const hubLocation: [number, number] = [-122.419, 37.775] // Downtown San Francisco

// Key-free drive-time approximation: a perturbed ring whose radius varies by
// angle through fixed harmonic offsets, so each band reads as an irregular
// blob rather than a perfect circle (a real isochrone needs a routing API).
function createIsochroneCoords(radiusMiles: number, phase: number) {
  const points: [number, number][] = []
  const steps = 48
  const latDelta = radiusMiles / 69
  const lngDelta = radiusMiles / (69 * Math.cos((hubLocation[1] * Math.PI) / 180))
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    const jitter = 1 + 0.16 * Math.sin(angle * 3 + phase) + 0.07 * Math.sin(angle * 7 + phase * 2.3)
    const lng = hubLocation[0] + lngDelta * Math.cos(angle) * jitter
    const lat = hubLocation[1] + latDelta * Math.sin(angle) * jitter
    points.push([lng, lat])
  }
  return points
}

const isochrones = {
  10: { coords: createIsochroneCoords(2.8, 0.4), pop: '340K', jobs: '520K', color: '#10b981', label: '10 Min Commute' },
  20: {
    coords: createIsochroneCoords(6.2, 1.7),
    pop: '1.24M',
    jobs: '890K',
    color: '#3b82f6',
    label: '20 Min Commute',
  },
  30: {
    coords: createIsochroneCoords(11.5, 2.9),
    pop: '2.85M',
    jobs: '1.45M',
    color: '#8b5cf6',
    label: '30 Min Commute',
  },
}

const destinations = [
  { name: 'Mission Depot', lngLat: [-122.414, 37.762] as [number, number] },
  { name: 'Daly City Hub', lngLat: [-122.47, 37.705] as [number, number] },
  { name: 'Oakland Annex', lngLat: [-122.272, 37.804] as [number, number] },
]
</script>

<template>
  <div data-slot="leaflet-isochrone-reachability-map" :class="cn('grid gap-4 lg:grid-cols-[1fr_320px]', props.class)">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <LeafletMap ref="mapRef" variant="light" :center="hubLocation" :zoom="10.5" class="absolute inset-0 size-full">
        <!-- 30m Isochrone (outermost, drawn first) -->
        <LeafletPolygon
          :lng-lat-path="isochrones[30].coords"
          :color="isochrones[30].color"
          :weight="1.5"
          dash-array="4 4"
          fill
          :fill-color="isochrones[30].color"
          :fill-opacity="selectedTime >= 30 ? 0.15 : 0.04"
        />

        <!-- 20m Isochrone -->
        <LeafletPolygon
          :lng-lat-path="isochrones[20].coords"
          :color="isochrones[20].color"
          :weight="2"
          fill
          :fill-color="isochrones[20].color"
          :fill-opacity="selectedTime >= 20 ? 0.22 : 0.06"
        />

        <!-- 10m Isochrone (innermost, most opaque) -->
        <LeafletPolygon
          :lng-lat-path="isochrones[10].coords"
          :color="isochrones[10].color"
          :weight="2.5"
          fill
          :fill-color="isochrones[10].color"
          :fill-opacity="0.3"
        />

        <!-- Destinations -->
        <LeafletMarker v-for="dest in destinations" :key="dest.name" :lng-lat="dest.lngLat" anchor="center">
          <div class="flex flex-col items-center gap-0.5">
            <span class="border-background bg-foreground size-2 rounded-full border-2 shadow-xs" />
            <span
              class="bg-card/90 text-foreground rounded px-1 font-mono text-[10px] font-semibold whitespace-nowrap shadow-xs"
            >
              {{ dest.name }}
            </span>
          </div>
        </LeafletMarker>

        <!-- Central Hub Marker -->
        <LeafletMarker :lng-lat="hubLocation" anchor="center">
          <div class="relative flex items-center justify-center">
            <span class="bg-primary/30 absolute size-6 animate-ping rounded-full" />
            <div
              class="bg-primary text-primary-foreground ring-background flex size-6 items-center justify-center rounded-full font-mono text-xs font-bold shadow-md ring-2"
            >
              ★
            </div>
          </div>
        </LeafletMarker>
      </LeafletMap>
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
