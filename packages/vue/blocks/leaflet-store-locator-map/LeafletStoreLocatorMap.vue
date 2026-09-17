<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafletMap, LeafletMarker, LeafletPopup, type LeafletMapRef } from '@/components/ui/leaflet-map'

export interface RetailStore {
  id: string
  name: string
  address: string
  neighborhood: string
  lat: number
  lng: number
  distanceMiles: number
  hours: string
  isOpen: boolean
  amenities: string[]
}

export interface LeafletStoreLocatorMapProps {
  class?: HTMLAttributes['class']
  stores?: RetailStore[]
}

const DEFAULT_STORES: RetailStore[] = [
  {
    id: 'nyc-herald',
    name: 'Herald Square',
    address: '151 W 34th St',
    neighborhood: 'Midtown',
    lat: 40.7484,
    lng: -73.9879,
    distanceMiles: 0.3,
    hours: 'Open until 10 PM',
    isOpen: true,
    amenities: ['Pickup', 'Returns', 'Cafe'],
  },
  {
    id: 'nyc-chelsea',
    name: 'Chelsea Market',
    address: '75 9th Ave',
    neighborhood: 'Chelsea',
    lat: 40.7424,
    lng: -74.0061,
    distanceMiles: 0.9,
    hours: 'Open until 9 PM',
    isOpen: true,
    amenities: ['Parking', 'Cafe'],
  },
  {
    id: 'nyc-soho',
    name: 'SoHo Flagship',
    address: '112 Greene St',
    neighborhood: 'SoHo',
    lat: 40.7248,
    lng: -73.9984,
    distanceMiles: 1.6,
    hours: 'Open until 9 PM',
    isOpen: true,
    amenities: ['Parking', 'Pickup', 'Returns'],
  },
  {
    id: 'nyc-ues',
    name: 'Lexington & 78th',
    address: '1120 Lexington Ave',
    neighborhood: 'Upper East Side',
    lat: 40.7736,
    lng: -73.9614,
    distanceMiles: 1.8,
    hours: 'Open until 8 PM',
    isOpen: true,
    amenities: ['Pickup', 'Returns'],
  },
  {
    id: 'nyc-tribeca',
    name: 'Tribeca',
    address: '60 Hudson St',
    neighborhood: 'Tribeca',
    lat: 40.7175,
    lng: -74.0089,
    distanceMiles: 2.1,
    hours: 'Closed · Opens 10 AM',
    isOpen: false,
    amenities: ['Parking', 'Returns'],
  },
]

const props = defineProps<LeafletStoreLocatorMapProps>()

const stores = computed(() => props.stores ?? DEFAULT_STORES)
const selectedId = ref(DEFAULT_STORES[0]?.id ?? '')

const mapRef = ref<LeafletMapRef | null>(null)

function selectStore(store: RetailStore) {
  selectedId.value = store.id
  mapRef.value?.flyTo?.({
    center: [store.lng, store.lat],
    zoom: 14,
    duration: 900,
  })
}
</script>

<template>
  <div data-slot="leaflet-store-locator-map" :class="cn('flex h-full min-h-0 flex-col gap-4', props.class)">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-foreground text-lg font-semibold tracking-tight">Stores</h2>
      <p class="text-muted-foreground text-xs">
        {{ stores.filter((s) => s.isOpen).length }} open · {{ stores.length }} locations
      </p>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
        <div class="relative min-h-[360px] flex-1 overflow-hidden">
          <LeafletMap
            ref="mapRef"
            variant="streets"
            :center="[-73.985, 40.748]"
            :zoom="13"
            class="absolute inset-0 size-full"
          >
            <LeafletMarker v-for="store in stores" :key="store.id" :lng-lat="[store.lng, store.lat]" anchor="center">
              <button
                type="button"
                class="rounded-full border px-2 py-0.5 text-xs font-semibold shadow-xs"
                :class="
                  selectedId === store.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground'
                "
                @click="selectStore(store)"
              >
                {{ store.name }}
              </button>
              <LeafletPopup :offset="[0, -18]" class="space-y-1 text-xs">
                <p class="text-foreground font-semibold">{{ store.name }}</p>
                <p class="text-muted-foreground">{{ store.address }}, {{ store.neighborhood }}</p>
                <p class="text-muted-foreground">{{ store.hours }} · {{ store.distanceMiles }} mi away</p>
              </LeafletPopup>
            </LeafletMarker>
          </LeafletMap>
        </div>
      </Card>

      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-4">
        <CardHeader class="border-border border-b p-4">
          <CardTitle class="text-sm font-semibold">Locations</CardTitle>
        </CardHeader>
        <CardContent class="divide-border min-h-0 flex-1 divide-y overflow-auto p-0">
          <button
            v-for="store in stores"
            :key="store.id"
            type="button"
            :class="
              cn(
                'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                selectedId === store.id && 'bg-accent/60',
              )
            "
            @click="selectStore(store)"
          >
            <div class="min-w-0 space-y-1">
              <p class="text-foreground truncate text-sm font-medium">{{ store.name }}</p>
              <p class="text-muted-foreground truncate text-xs">
                {{ store.address }}, {{ store.neighborhood }} · {{ store.hours }}
              </p>
              <div class="flex flex-wrap gap-1">
                <Badge v-for="amenity in store.amenities" :key="amenity" variant="secondary" class="text-[10px]">
                  {{ amenity }}
                </Badge>
              </div>
            </div>
            <div class="flex shrink-0 flex-col items-end gap-1">
              <span class="text-muted-foreground font-mono text-xs tabular-nums">{{ store.distanceMiles }} mi</span>
              <Badge :variant="store.isOpen ? 'info' : 'secondary'" class="text-xs">
                {{ store.isOpen ? 'Open' : 'Closed' }}
              </Badge>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
