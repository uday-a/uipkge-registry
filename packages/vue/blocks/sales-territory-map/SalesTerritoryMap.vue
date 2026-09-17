<script lang="ts">
export interface SalesTerritory {
  id: string
  name: string
  code: string
  arr: string
  attainment: number
  status: 'attained' | 'ontrack' | 'attention'
  centerLngLat: [number, number]
}

export const DEFAULT_TERRITORIES: SalesTerritory[] = [
  {
    id: 'na-enterprise',
    name: 'North America',
    code: 'NA-ENT',
    arr: '$6.4M',
    attainment: 111,
    status: 'attained',
    centerLngLat: [-98.5, 39.8],
  },
  {
    id: 'emea-central',
    name: 'EMEA Central',
    code: 'EMEA-C',
    arr: '$5.8M',
    attainment: 124,
    status: 'attained',
    centerLngLat: [10.4, 51.1],
  },
  {
    id: 'apac-growth',
    name: 'APAC Growth',
    code: 'APAC-G',
    arr: '$4.1M',
    attainment: 94,
    status: 'ontrack',
    centerLngLat: [120.0, 30.0],
  },
  {
    id: 'latam-emerging',
    name: 'Latin America',
    code: 'LATAM-E',
    arr: '$2.1M',
    attainment: 83,
    status: 'attention',
    centerLngLat: [-55.0, -14.0],
  },
]
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, MapMarker } from '@/components/ui/map'

const props = withDefaults(
  defineProps<{
    territories?: SalesTerritory[]
    accessToken?: string
    class?: string
  }>(),
  {
    territories: () => DEFAULT_TERRITORIES,
    accessToken: '',
  },
)

const selectedId = ref(props.territories[0]?.id ?? '')
const selected = computed(() => props.territories.find((t) => t.id === selectedId.value) ?? props.territories[0])

let mapboxInstance: any = null
function fitTerritories(map: any) {
  const coords = props.territories.map((t) => t.centerLngLat)
  if (coords.length < 2) return
  const lons = coords.map((c) => c[0])
  const lats = coords.map((c) => c[1])
  try {
    map.fitBounds(
      [
        [Math.min(...lons), Math.min(...lats)],
        [Math.max(...lons), Math.max(...lats)],
      ],
      { padding: { top: 48, bottom: 48, left: 80, right: 80 }, duration: 0, maxZoom: 1.8 },
    )
  } catch {
    /* map not ready */
  }
}

function onMapCreated(map: any) {
  mapboxInstance = map
  if (typeof map.loaded === 'function' && map.loaded()) fitTerritories(map)
  else map.once?.('load', () => fitTerritories(map))
}

function selectTerritory(territory: SalesTerritory) {
  selectedId.value = territory.id
  mapboxInstance?.flyTo?.({
    center: territory.centerLngLat,
    zoom: 2.8,
    essential: true,
    duration: 800,
  })
}

function statusVariant(status: SalesTerritory['status']) {
  if (status === 'attained') return 'info'
  if (status === 'ontrack') return 'secondary'
  return 'warning'
}
</script>

<template>
  <div data-slot="sales-territory-map" :class="cn('flex h-full min-h-0 flex-col gap-4', props.class)">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-foreground text-lg font-semibold tracking-tight">Territories</h2>
      <p class="text-muted-foreground text-xs">{{ territories.length }} regions</p>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
        <div class="relative min-h-[360px] flex-1 overflow-hidden">
          <Map
            :access-token="accessToken"
            variant="dark"
            :center="[15, 20]"
            :zoom="1.2"
            class="absolute inset-0 size-full"
            @created="onMapCreated"
          >
            <MapMarker v-for="t in territories" :key="t.id" :lng-lat="t.centerLngLat" anchor="center">
              <button
                type="button"
                class="rounded-full border px-2 py-0.5 font-mono text-xs font-semibold shadow-xs"
                :class="
                  selectedId === t.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground'
                "
                @click.stop="selectTerritory(t)"
              >
                {{ t.code }} {{ t.attainment }}%
              </button>
            </MapMarker>
          </Map>
        </div>
      </Card>

      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-4">
        <CardHeader class="border-border border-b p-4">
          <CardTitle class="text-sm font-semibold">Quota</CardTitle>
        </CardHeader>
        <CardContent class="divide-border min-h-0 flex-1 divide-y overflow-auto p-0">
          <button
            v-for="t in territories"
            :key="t.id"
            type="button"
            :class="
              cn(
                'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                selectedId === t.id && 'bg-accent/60',
              )
            "
            @click="selectTerritory(t)"
          >
            <div class="min-w-0">
              <p class="text-foreground truncate text-sm font-medium">{{ t.code }} · {{ t.name }}</p>
              <p class="text-muted-foreground font-mono text-xs tabular-nums">{{ t.arr }}</p>
            </div>
            <Badge :variant="statusVariant(t.status)" class="shrink-0 text-xs tabular-nums">{{ t.attainment }}%</Badge>
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
