<script lang="ts">
export type TerritoryStatus = 'attained' | 'ontrack' | 'attention'

export interface SalesTerritory {
  id: string
  name: string
  code: string
  rep: string
  arr: string
  attainment: number
  status: TerritoryStatus
  /** Territory centroid as [lng, lat]. */
  centerLngLat: [number, number]
  /** Territory boundary ring as [lng, lat][]. */
  polygon: [number, number][]
}

// Hand-drawn plausible US region boundaries — four rep territories tiling CONUS.
export const DEFAULT_TERRITORIES: SalesTerritory[] = [
  {
    id: 'pacific-west',
    name: 'Pacific West',
    code: 'PAC',
    rep: 'Sierra Delgado',
    arr: '$2.8M',
    attainment: 112,
    status: 'attained',
    centerLngLat: [-119.8, 39.5],
    polygon: [
      [-124.4, 32.5],
      [-114.0, 32.5],
      [-114.0, 35.0],
      [-114.6, 39.0],
      [-120.0, 42.0],
      [-117.0, 45.9],
      [-117.0, 49.0],
      [-124.7, 48.4],
      [-124.2, 40.0],
      [-124.4, 32.5],
    ],
  },
  {
    id: 'mountain-central',
    name: 'Mountain Central',
    code: 'MTN',
    rep: 'Colt Brannigan',
    arr: '$2.2M',
    attainment: 97,
    status: 'ontrack',
    centerLngLat: [-104.8, 39.9],
    polygon: [
      [-117.0, 49.0],
      [-95.0, 49.0],
      [-95.0, 43.5],
      [-97.5, 40.0],
      [-95.5, 36.5],
      [-100.0, 34.5],
      [-103.0, 32.0],
      [-106.5, 31.8],
      [-108.2, 31.3],
      [-111.0, 31.3],
      [-114.0, 32.5],
      [-114.0, 35.0],
      [-114.6, 39.0],
      [-120.0, 42.0],
      [-117.0, 45.9],
      [-117.0, 49.0],
    ],
  },
  {
    id: 'southeast',
    name: 'Southeast',
    code: 'SE',
    rep: 'Harper Quinn',
    arr: '$1.9M',
    attainment: 84,
    status: 'attention',
    centerLngLat: [-83.0, 33.5],
    polygon: [
      [-95.5, 36.5],
      [-94.0, 33.0],
      [-93.0, 30.0],
      [-89.0, 29.0],
      [-84.0, 29.9],
      [-82.6, 28.0],
      [-81.0, 25.8],
      [-80.1, 25.1],
      [-80.5, 26.8],
      [-81.4, 30.4],
      [-80.8, 32.2],
      [-77.5, 34.0],
      [-75.5, 35.5],
      [-76.0, 36.9],
      [-77.5, 39.0],
      [-80.5, 40.8],
      [-83.0, 39.5],
      [-84.8, 38.0],
      [-88.0, 37.0],
      [-90.5, 36.0],
      [-95.5, 36.5],
    ],
  },
  {
    id: 'northeast',
    name: 'Northeast',
    code: 'NE',
    rep: 'Devon Whitaker',
    arr: '$3.4M',
    attainment: 121,
    status: 'attained',
    centerLngLat: [-74.5, 41.8],
    polygon: [
      [-95.0, 49.0],
      [-95.0, 45.9],
      [-92.5, 44.5],
      [-89.5, 43.0],
      [-87.0, 41.5],
      [-83.5, 41.7],
      [-79.8, 42.3],
      [-76.8, 43.5],
      [-74.0, 45.0],
      [-71.0, 45.0],
      [-70.0, 43.6],
      [-70.9, 42.9],
      [-74.0, 40.5],
      [-75.0, 38.5],
      [-77.5, 39.0],
      [-80.5, 40.8],
      [-83.0, 39.5],
      [-84.8, 38.0],
      [-88.0, 37.0],
      [-90.5, 36.0],
      [-95.5, 36.5],
      [-97.5, 40.0],
      [-95.0, 43.5],
      [-95.0, 49.0],
    ],
  },
]

/** Plain-hex fills — Leaflet renders paths to SVG/canvas, so CSS vars do not resolve there. */
export const TERRITORY_STATUS_STYLES: Record<TerritoryStatus, { fill: string; stroke: string }> = {
  attained: { fill: '#22c55e', stroke: '#4ade80' },
  ontrack: { fill: '#38bdf8', stroke: '#7dd3fc' },
  attention: { fill: '#f59e0b', stroke: '#fbbf24' },
}
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafletMap, LeafletMarker, LeafletPolygon, type LeafletMapRef } from '@/components/ui/leaflet-map'

export interface LeafletSalesTerritoryMapProps {
  class?: HTMLAttributes['class']
  territories?: SalesTerritory[]
}

// Geographic center of CONUS — stable reference so the map's center watcher never re-fires.
const US_CENTER: [number, number] = [-98.5795, 39.8283]

const props = withDefaults(defineProps<LeafletSalesTerritoryMapProps>(), {
  territories: () => DEFAULT_TERRITORIES,
})

const selectedId = ref(props.territories[0]?.id ?? '')
const mapRef = ref<LeafletMapRef | null>(null)

function selectTerritory(territory: SalesTerritory) {
  selectedId.value = territory.id
  mapRef.value?.flyTo?.({
    center: territory.centerLngLat,
    zoom: 5,
    duration: 800,
  })
}

function statusVariant(status: TerritoryStatus) {
  if (status === 'attained') return 'info'
  if (status === 'ontrack') return 'secondary'
  return 'warning'
}
</script>

<template>
  <div data-slot="leaflet-sales-territory-map" :class="cn('flex h-full min-h-0 flex-col gap-4', props.class)">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-foreground text-lg font-semibold tracking-tight">Territories</h2>
      <p class="text-muted-foreground text-xs">{{ territories.length }} regions</p>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
        <div class="relative min-h-[360px] flex-1 overflow-hidden">
          <LeafletMap ref="mapRef" variant="dark" :center="US_CENTER" :zoom="4" class="absolute inset-0 size-full">
            <LeafletPolygon
              v-for="t in territories"
              :key="`boundary-${t.id}`"
              :lng-lat-path="t.polygon"
              :color="TERRITORY_STATUS_STYLES[t.status].stroke"
              :weight="selectedId === t.id ? 2.5 : 1.5"
              :opacity="0.9"
              :fill="true"
              :fill-color="TERRITORY_STATUS_STYLES[t.status].fill"
              :fill-opacity="selectedId === t.id ? 0.3 : 0.14"
              @click="selectTerritory(t)"
            />
            <LeafletMarker v-for="t in territories" :key="t.id" :lng-lat="t.centerLngLat" anchor="center">
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
            </LeafletMarker>
          </LeafletMap>
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
              <p class="text-muted-foreground truncate font-mono text-xs tabular-nums">{{ t.rep }} · {{ t.arr }}</p>
            </div>
            <Badge :variant="statusVariant(t.status)" class="shrink-0 text-xs tabular-nums">{{ t.attainment }}%</Badge>
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
