<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, MapMarker } from '@/components/ui/map'

export interface RetailStore {
  id: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
  isOpen: boolean
}

export interface StoreLocatorMapProps {
  class?: HTMLAttributes['class']
  accessToken?: string
  stores?: RetailStore[]
}

const DEFAULT_STORES: RetailStore[] = [
  {
    id: 'nyc-soho',
    name: 'SoHo Flagship',
    city: 'New York',
    country: 'United States',
    lat: 40.7248,
    lng: -73.9984,
    isOpen: true,
  },
  {
    id: 'lon-regent',
    name: 'Regent Street',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5142,
    lng: -0.1418,
    isOpen: true,
  },
  { id: 'tyo-ginza', name: 'Ginza Studio', city: 'Tokyo', country: 'Japan', lat: 35.6719, lng: 139.7658, isOpen: true },
  {
    id: 'par-champs',
    name: 'Champs-Élysées',
    city: 'Paris',
    country: 'France',
    lat: 48.8718,
    lng: 2.3013,
    isOpen: true,
  },
  {
    id: 'syd-george',
    name: 'George Street',
    city: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    isOpen: false,
  },
]

const props = withDefaults(defineProps<StoreLocatorMapProps>(), {
  accessToken: '',
})

const stores = computed(() => props.stores ?? DEFAULT_STORES)
const selectedId = ref(DEFAULT_STORES[0]?.id ?? '')

let mapboxInstance: any = null
function onMapCreated(map: any) {
  mapboxInstance = map
}

function selectStore(store: RetailStore) {
  selectedId.value = store.id
  mapboxInstance?.flyTo?.({
    center: [store.lng, store.lat],
    zoom: 12.5,
    essential: true,
    duration: 900,
  })
}
</script>

<template>
  <div data-slot="store-locator-map" :class="cn('flex h-full min-h-0 flex-col gap-4', props.class)">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-foreground text-lg font-semibold tracking-tight">Stores</h2>
      <p class="text-muted-foreground text-xs">
        {{ stores.filter((s) => s.isOpen).length }} open · {{ stores.length }} locations
      </p>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
        <div class="relative min-h-[360px] flex-1 overflow-hidden">
          <Map
            :access-token="accessToken"
            variant="dark"
            :center="[10, 20]"
            :zoom="1.5"
            class="absolute inset-0 size-full"
            @created="onMapCreated"
          >
            <MapMarker v-for="store in stores" :key="store.id" :lng-lat="[store.lng, store.lat]" anchor="center">
              <button
                type="button"
                class="rounded-full border px-2 py-0.5 text-xs font-semibold shadow-xs"
                :class="
                  selectedId === store.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground'
                "
                @click.stop="selectStore(store)"
              >
                {{ store.city }}
              </button>
            </MapMarker>
          </Map>
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
            <div class="min-w-0">
              <p class="text-foreground truncate text-sm font-medium">{{ store.name }}</p>
              <p class="text-muted-foreground truncate text-xs">{{ store.city }}, {{ store.country }}</p>
            </div>
            <Badge :variant="store.isOpen ? 'info' : 'secondary'" class="shrink-0 text-xs">
              {{ store.isOpen ? 'Open' : 'Closed' }}
            </Badge>
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
