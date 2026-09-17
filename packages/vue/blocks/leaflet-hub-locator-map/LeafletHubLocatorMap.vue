<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafletCircle, LeafletMap, LeafletMarker, type LeafletMapRef } from '@/components/ui/leaflet-map'

export interface DistributionHub {
  id: string
  code: string
  name: string
  city: string
  state: string
  lat: number
  lng: number
  capacityPct: number
  bays: number
  /** Delivery coverage radius in miles. */
  coverageMiles: number
}

export interface LeafletHubLocatorMapProps {
  class?: HTMLAttributes['class']
  hubs?: DistributionHub[]
}

const DEFAULT_HUBS: DistributionHub[] = [
  {
    id: 'atl-01',
    code: 'ATL-01',
    name: 'South Atlanta DC',
    city: 'Atlanta',
    state: 'GA',
    lat: 33.629,
    lng: -84.402,
    capacityPct: 82,
    bays: 36,
    coverageMiles: 18,
  },
  {
    id: 'atl-02',
    code: 'ATL-02',
    name: 'Marietta Cross-Dock',
    city: 'Marietta',
    state: 'GA',
    lat: 33.953,
    lng: -84.55,
    capacityPct: 64,
    bays: 22,
    coverageMiles: 14,
  },
  {
    id: 'atl-03',
    code: 'ATL-03',
    name: 'McDonough Fulfillment',
    city: 'McDonough',
    state: 'GA',
    lat: 33.447,
    lng: -84.147,
    capacityPct: 91,
    bays: 48,
    coverageMiles: 22,
  },
  {
    id: 'atl-04',
    code: 'ATL-04',
    name: 'Peachtree City Hub',
    city: 'Peachtree City',
    state: 'GA',
    lat: 33.397,
    lng: -84.596,
    capacityPct: 57,
    bays: 18,
    coverageMiles: 15,
  },
  {
    id: 'atl-05',
    code: 'ATL-05',
    name: 'Douglasville Depot',
    city: 'Douglasville',
    state: 'GA',
    lat: 33.751,
    lng: -84.747,
    capacityPct: 73,
    bays: 26,
    coverageMiles: 16,
  },
  {
    id: 'atl-06',
    code: 'ATL-06',
    name: 'Conyers Annex',
    city: 'Conyers',
    state: 'GA',
    lat: 33.667,
    lng: -84.018,
    capacityPct: 88,
    bays: 30,
    coverageMiles: 20,
  },
]

const METERS_PER_MILE = 1609.34

const props = defineProps<LeafletHubLocatorMapProps>()

const hubs = computed(() => props.hubs ?? DEFAULT_HUBS)
const selectedId = ref(DEFAULT_HUBS[0]?.id ?? '')

const mapRef = ref<LeafletMapRef | null>(null)

function selectHub(hub: DistributionHub) {
  selectedId.value = hub.id
  mapRef.value?.flyTo?.({
    center: [hub.lng, hub.lat],
    zoom: 11.5,
    duration: 900,
  })
}

function capacityVariant(capacityPct: number) {
  return capacityPct >= 85 ? 'warning' : 'info'
}
</script>

<template>
  <div data-slot="leaflet-hub-locator-map" :class="cn('flex h-full min-h-0 flex-col gap-4', props.class)">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-foreground text-lg font-semibold tracking-tight">Distribution hubs</h2>
      <p class="text-muted-foreground text-xs">{{ hubs.length }} centers</p>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
        <div class="relative min-h-[360px] flex-1 overflow-hidden">
          <LeafletMap
            ref="mapRef"
            variant="streets"
            :center="[-84.388, 33.749]"
            :zoom="10.5"
            class="absolute inset-0 size-full"
          >
            <LeafletCircle
              v-for="hub in hubs"
              :key="`${hub.id}-coverage`"
              :center="[hub.lng, hub.lat]"
              :radius="hub.coverageMiles * METERS_PER_MILE"
              color="#3b82f6"
              :weight="selectedId === hub.id ? 2 : 1.5"
              :fill="true"
              fill-color="#3b82f6"
              :fill-opacity="selectedId === hub.id ? 0.16 : 0.07"
            />
            <LeafletMarker v-for="hub in hubs" :key="hub.id" :lng-lat="[hub.lng, hub.lat]" anchor="center">
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
              <p class="text-foreground truncate text-sm font-medium">{{ hub.name }}</p>
              <p class="text-muted-foreground truncate text-xs">
                {{ hub.city }}, {{ hub.state }} · {{ hub.bays }} bays · {{ hub.coverageMiles }} mi
              </p>
            </div>
            <Badge :variant="capacityVariant(hub.capacityPct)" class="shrink-0 font-mono text-xs tabular-nums">
              {{ hub.capacityPct }}%
            </Badge>
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
