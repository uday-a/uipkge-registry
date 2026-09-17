<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapMarker, MapSource, MapLayer, type MapRef } from '@/components/ui/map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

defineProps<{ accessToken?: string }>()

interface Shelter {
  id: string
  name: string
  type: 'Shelter' | 'Medical Staging' | 'Command Post'
  coords: [number, number]
  capacity: number
  occupied: number
  status: 'Open' | 'Near Capacity' | 'Closed'
}

const mapRef = ref<MapRef | null>(null)

// Simulated wildfire hazard perimeter coordinates (near Boulder, CO)
const firePerimeterCoords: [number, number][] = [
  [-105.32, 40.01],
  [-105.29, 40.03],
  [-105.26, 40.02],
  [-105.25, 39.99],
  [-105.28, 39.97],
  [-105.31, 39.98],
  [-105.32, 40.01],
]

const facilities: Shelter[] = [
  {
    id: 's-1',
    name: 'County Event Center Shelter',
    type: 'Shelter',
    coords: [-105.24, 40.04],
    capacity: 500,
    occupied: 340,
    status: 'Open',
  },
  {
    id: 's-2',
    name: 'West Valley Medical Staging',
    type: 'Medical Staging',
    coords: [-105.22, 39.98],
    capacity: 120,
    occupied: 98,
    status: 'Near Capacity',
  },
  {
    id: 's-3',
    name: 'Unified Incident Command Post',
    type: 'Command Post',
    coords: [-105.25, 40.07],
    capacity: 80,
    occupied: 45,
    status: 'Open',
  },
]

const activeFacility = ref<Shelter>(facilities[0])

function focusFacility(f: Shelter) {
  activeFacility.value = f
  mapRef.value?.flyTo({ center: f.coords, zoom: 12.5 })
}

function focusHazard() {
  mapRef.value?.flyTo({ center: [-105.28, 40.0], zoom: 11.5 })
}
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <Map
        ref="mapRef"
        :access-token="accessToken"
        variant="light"
        :center="[-105.27, 40.01]"
        :zoom="11.2"
        class="h-full w-full"
      >
        <!-- Wildfire Hazard Exclusion Zone -->
        <MapSource
          id="hazard-zone"
          :options="{
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Polygon', coordinates: [firePerimeterCoords] },
            },
          }"
        />
        <MapLayer
          id="hazard-zone-fill"
          :options="{
            type: 'fill',
            source: 'hazard-zone',
            paint: { 'fill-color': '#ef4444', 'fill-opacity': 0.28 },
          }"
        />
        <MapLayer
          id="hazard-zone-line"
          :options="{
            type: 'line',
            source: 'hazard-zone',
            paint: { 'line-color': '#dc2626', 'line-width': 2.5, 'line-dasharray': [2, 1] },
          }"
        />

        <!-- Active Fire Origin Marker -->
        <MapMarker :lng-lat="[-105.29, 40.0]" anchor="center" @click="focusHazard">
          <div class="relative flex cursor-pointer items-center justify-center">
            <span class="absolute size-9 animate-ping rounded-full bg-rose-500/30" />
            <div
              class="flex size-7 items-center justify-center rounded-full bg-rose-600 font-mono text-xs font-bold text-white shadow-lg ring-2 ring-white"
            >
              🔥
            </div>
          </div>
        </MapMarker>

        <!-- Shelters and Medical Staging -->
        <MapMarker v-for="f in facilities" :key="f.id" :lng-lat="f.coords" anchor="bottom" @click="focusFacility(f)">
          <div class="group flex cursor-pointer flex-col items-center">
            <div
              class="flex size-7 items-center justify-center rounded-full shadow-md ring-2 transition-transform group-hover:scale-110"
              :class="
                f.type === 'Shelter'
                  ? 'bg-emerald-600 text-white ring-emerald-400/40'
                  : f.type === 'Medical Staging'
                    ? 'bg-blue-600 text-white ring-blue-400/40'
                    : 'bg-primary text-primary-foreground ring-primary/40'
              "
            >
              {{ f.type === 'Shelter' ? '🏠' : f.type === 'Medical Staging' ? '✚' : '★' }}
            </div>
            <span
              class="border-border bg-background/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-bold whitespace-nowrap shadow-xs"
            >
              {{ f.name.split(' ')[0] }}
            </span>
          </div>
        </MapMarker>
      </Map>
    </div>

    <!-- Incident Control Dashboard -->
    <Card class="flex flex-col justify-between">
      <CardHeader>
        <div class="flex items-center justify-between">
          <Badge
            variant="outline"
            class="border-rose-500/30 bg-rose-500/10 font-mono text-xs text-rose-600 dark:text-rose-400"
            >LEVEL 3 EVACUATION</Badge
          >
          <Badge class="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{{
            activeFacility.status
          }}</Badge>
        </div>
        <CardTitle class="mt-2 text-lg">{{ activeFacility.name }}</CardTitle>
        <CardDescription class="text-xs"
          >Capacity: {{ activeFacility.occupied }} / {{ activeFacility.capacity }} beds occupied</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Capacity Bar -->
        <div class="border-border space-y-1.5 border-t pt-3">
          <div class="flex items-center justify-between font-mono text-xs">
            <span class="text-muted-foreground">Occupancy Rate</span>
            <span class="text-foreground font-bold"
              >{{ Math.round((activeFacility.occupied / activeFacility.capacity) * 100) }}%</span
            >
          </div>
          <div class="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              class="h-full rounded-full transition-all"
              :class="activeFacility.occupied / activeFacility.capacity > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'"
              :style="{ width: `${(activeFacility.occupied / activeFacility.capacity) * 100}%` }"
            />
          </div>
        </div>

        <div class="border-border space-y-1 border-t pt-3">
          <div class="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
            Staged Relief Sites
          </div>
          <button
            v-for="f in facilities"
            :key="f.id"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors"
            :class="
              activeFacility.id === f.id
                ? 'bg-accent text-accent-foreground font-semibold'
                : 'hover:bg-muted text-muted-foreground'
            "
            @click="focusFacility(f)"
          >
            <span class="max-w-[170px] truncate">{{ f.name }}</span>
            <span class="font-mono text-[10px] opacity-75">{{ f.occupied }}/{{ f.capacity }}</span>
          </button>
        </div>

        <div class="flex gap-2 pt-2">
          <Button variant="outline" size="sm" class="flex-1 font-mono text-xs" @click="focusHazard">
            Exclusion Zone
          </Button>
          <Button variant="outline" size="sm" class="flex-1 font-mono text-xs" @click="focusFacility(activeFacility)">
            Focus Site
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
