<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LeafletMap, LeafletMarker, LeafletCircle, type LeafletMapRef } from '@/components/ui/leaflet-map'

export type FacilityType = 'Shelter' | 'Medical Staging' | 'Command Post'
export type FacilityStatus = 'Open' | 'Near Capacity' | 'Closed'

export interface Facility {
  id: string
  name: string
  type: FacilityType
  /** [lng, lat] — Mapbox order. */
  coords: [number, number]
  capacity: number
  occupied: number
  status: FacilityStatus
}

export interface LeafletDisasterResponseMapProps {
  class?: HTMLAttributes['class']
  facilities?: Facility[]
}

const props = defineProps<LeafletDisasterResponseMapProps>()

// Module-level constants: stable references keep LeafletMap's `center` watcher
// from re-firing setView on every re-render and cancelling flyTo animations.
const MAP_CENTER: [number, number] = [-122.2711, 37.8044]

// Wildfire incident origin in the Oakland Hills + a secondary spot fire.
const INCIDENT: [number, number] = [-122.165, 37.845]
const SPOT_FIRE: [number, number] = [-122.145, 37.856]

// Evacuation perimeter rings (meter radii): hard exclusion + warning zone.
const EVAC_RADIUS_M = 1800
const WARNING_RADIUS_M = 3600

const DEFAULT_FACILITIES: Facility[] = [
  {
    id: 's-1',
    name: 'Oakland Civic Shelter',
    type: 'Shelter',
    coords: [-122.265, 37.795],
    capacity: 500,
    occupied: 340,
    status: 'Open',
  },
  {
    id: 's-2',
    name: 'Eastmont Medical Staging',
    type: 'Medical Staging',
    coords: [-122.19, 37.77],
    capacity: 120,
    occupied: 98,
    status: 'Near Capacity',
  },
  {
    id: 's-3',
    name: 'Unified Incident Command Post',
    type: 'Command Post',
    coords: [-122.225, 37.852],
    capacity: 80,
    occupied: 45,
    status: 'Open',
  },
]

const facilities = computed(() => props.facilities ?? DEFAULT_FACILITIES)
const activeId = ref(DEFAULT_FACILITIES[0]?.id ?? '')
const activeFacility = computed(() => facilities.value.find((f) => f.id === activeId.value) ?? facilities.value[0])

const mapRef = ref<LeafletMapRef | null>(null)

function focusFacility(f: Facility) {
  activeId.value = f.id
  mapRef.value?.flyTo?.({ center: f.coords, zoom: 12.5, duration: 800 })
}

function focusHazard() {
  mapRef.value?.flyTo?.({ center: INCIDENT, zoom: 12, duration: 800 })
}
</script>

<template>
  <div data-slot="leaflet-disaster-response-map" :class="cn('grid gap-4 lg:grid-cols-[1fr_320px]', props.class)">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <LeafletMap ref="mapRef" variant="light" :center="MAP_CENTER" :zoom="11" class="h-full w-full">
        <!-- Evacuation perimeter rings (radii in meters) -->
        <LeafletCircle
          :center="INCIDENT"
          :radius="EVAC_RADIUS_M"
          color="#dc2626"
          :weight="2"
          :opacity="0.9"
          dash-array="6 4"
          fill-color="#ef4444"
          :fill-opacity="0.15"
          @click="focusHazard"
        />
        <LeafletCircle
          :center="INCIDENT"
          :radius="WARNING_RADIUS_M"
          color="#d97706"
          :weight="1.5"
          :opacity="0.7"
          dash-array="4 6"
          fill-color="#f59e0b"
          :fill-opacity="0.05"
        />

        <!-- Active fire origin -->
        <LeafletMarker :lng-lat="INCIDENT" anchor="center" @click="focusHazard">
          <div class="relative flex cursor-pointer items-center justify-center">
            <span class="absolute size-9 animate-ping rounded-full bg-rose-500/30" />
            <div
              class="flex size-7 items-center justify-center rounded-full bg-rose-600 font-mono text-xs font-bold text-white shadow-lg ring-2 ring-white"
            >
              🔥
            </div>
          </div>
        </LeafletMarker>

        <!-- Secondary spot fire -->
        <LeafletMarker :lng-lat="SPOT_FIRE" anchor="center" @click="focusHazard">
          <div class="relative flex cursor-pointer items-center justify-center">
            <span class="absolute size-6 animate-ping rounded-full bg-amber-500/30" />
            <div
              class="flex size-5 items-center justify-center rounded-full bg-amber-600 font-mono text-[9px] font-bold text-white shadow-md ring-2 ring-white"
            >
              🔥
            </div>
          </div>
        </LeafletMarker>

        <!-- Shelters and Medical Staging -->
        <LeafletMarker
          v-for="f in facilities"
          :key="f.id"
          :lng-lat="f.coords"
          anchor="bottom"
          @click="focusFacility(f)"
        >
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
        </LeafletMarker>
      </LeafletMap>
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
              activeId === f.id
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
