<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, MapMarker } from '@/components/ui/map'

export interface HubLocation {
  id: string
  code: string
  city: string
  country: string
  lat: number
  lng: number
  latencyMs: number
}

export interface HubLocatorMapProps {
  class?: HTMLAttributes['class']
  accessToken?: string
  hubs?: HubLocation[]
}

const DEFAULT_HUBS: HubLocation[] = [
  {
    id: 'iad-01',
    code: 'IAD-01',
    city: 'Ashburn',
    country: 'United States',
    lat: 39.0438,
    lng: -77.4874,
    latencyMs: 11,
  },
  {
    id: 'lhr-01',
    code: 'LHR-01',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    latencyMs: 14,
  },
  { id: 'fra-01', code: 'FRA-01', city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, latencyMs: 13 },
  { id: 'nrt-01', code: 'NRT-01', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, latencyMs: 19 },
  { id: 'sin-01', code: 'SIN-01', city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, latencyMs: 22 },
  { id: 'gru-01', code: 'GRU-01', city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, latencyMs: 42 },
]

const props = withDefaults(defineProps<HubLocatorMapProps>(), {
  accessToken: '',
})

const hubs = computed(() => props.hubs ?? DEFAULT_HUBS)
const selectedId = ref(DEFAULT_HUBS[0]?.id ?? '')

let mapboxInstance: any = null
function onMapCreated(map: any) {
  mapboxInstance = map
}

function selectHub(hub: HubLocation) {
  selectedId.value = hub.id
  mapboxInstance?.flyTo?.({
    center: [hub.lng, hub.lat],
    zoom: 5.5,
    essential: true,
    duration: 900,
  })
}
</script>

<template>
  <div data-slot="hub-locator-map" :class="cn('flex h-full min-h-0 flex-col gap-4', props.class)">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-foreground text-lg font-semibold tracking-tight">Hubs</h2>
      <p class="text-muted-foreground text-xs">{{ hubs.length }} locations</p>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
        <div class="relative min-h-[360px] flex-1 overflow-hidden">
          <Map
            :access-token="accessToken"
            variant="dark"
            :center="[10, 25]"
            :zoom="1.6"
            class="absolute inset-0 size-full"
            @created="onMapCreated"
          >
            <MapMarker v-for="hub in hubs" :key="hub.id" :lng-lat="[hub.lng, hub.lat]" anchor="center">
              <button
                type="button"
                class="rounded-full border px-2 py-0.5 font-mono text-xs font-semibold shadow-xs"
                :class="
                  selectedId === hub.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground'
                "
                @click.stop="selectHub(hub)"
              >
                {{ hub.code }}
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
            v-for="hub in hubs"
            :key="hub.id"
            type="button"
            :class="
              cn(
                'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                selectedId === hub.id && 'bg-accent/60',
              )
            "
            @click="selectHub(hub)"
          >
            <div class="min-w-0">
              <p class="text-foreground truncate text-sm font-medium">{{ hub.code }}</p>
              <p class="text-muted-foreground truncate text-xs">{{ hub.city }}, {{ hub.country }}</p>
            </div>
            <span class="text-muted-foreground font-mono text-xs tabular-nums">{{ hub.latencyMs }}ms</span>
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
