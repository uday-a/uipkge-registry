<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LeafletMap, LeafletMarker, LeafletPolyline, type LeafletMapRef } from '@/components/ui/leaflet-map'

export type VesselType = 'Container' | 'Crude Tanker' | 'Bulk Carrier' | 'Tug'
export type VesselStatus = 'Underway' | 'Moored' | 'At Anchor'

export interface Vessel {
  mmsi: string
  name: string
  flag: string
  type: VesselType
  /** [lng, lat] — Mapbox order. */
  coords: [number, number]
  heading: number
  speedKnots: number
  draught: string
  dest: string
  eta: string
  status: VesselStatus
}

export interface LeafletMaritimeVesselMapProps {
  class?: HTMLAttributes['class']
  vessels?: Vessel[]
}

const props = defineProps<LeafletMaritimeVesselMapProps>()

// Module-level constant: a stable reference keeps LeafletMap's `center` watcher
// from re-firing setView on every re-render and cancelling flyTo animations.
const MAP_CENTER: [number, number] = [4.4, 51.9]

const DEFAULT_VESSELS: Vessel[] = [
  {
    mmsi: '219018442',
    name: 'EVER GIVEN',
    flag: 'PA',
    type: 'Container',
    coords: [4.04, 51.98],
    heading: 95,
    speedKnots: 13.8,
    draught: '15.7m',
    dest: 'RTM MAASVLAKTE',
    eta: 'OCT 24 14:00',
    status: 'Underway',
  },
  {
    mmsi: '636019812',
    name: 'NORDIC STAR',
    flag: 'LR',
    type: 'Crude Tanker',
    coords: [4.18, 51.94],
    heading: 265,
    speedKnots: 0.3,
    draught: '12.1m',
    dest: 'EUROPOORT ANCH',
    eta: 'OCT 24 08:30',
    status: 'At Anchor',
  },
  {
    mmsi: '356782000',
    name: 'PACIFIC RUBY',
    flag: 'SG',
    type: 'Bulk Carrier',
    coords: [4.33, 51.92],
    heading: 100,
    speedKnots: 10.6,
    draught: '10.4m',
    dest: 'NLRTM ECT',
    eta: 'OCT 29 06:00',
    status: 'Underway',
  },
  {
    mmsi: '508111222',
    name: 'HARBOR VALIANT',
    flag: 'NL',
    type: 'Tug',
    coords: [4.47, 51.9],
    heading: 180,
    speedKnots: 6.4,
    draught: '4.5m',
    dest: 'WAALHAVEN',
    eta: 'OCT 24 12:00',
    status: 'Underway',
  },
]

// Nieuwe Waterweg main channel (North Sea -> Waalhaven) + Maasvlakte approach lane.
const SHIPPING_LANES: [number, number][][] = [
  [
    [3.94, 52.0],
    [4.08, 51.965],
    [4.22, 51.935],
    [4.36, 51.915],
    [4.55, 51.9],
  ],
  [
    [3.99, 52.03],
    [4.14, 51.99],
    [4.28, 51.945],
    [4.45, 51.905],
  ],
]

const PORTS: { name: string; coords: [number, number] }[] = [
  { name: 'MAASVLAKTE', coords: [3.98, 51.99] },
  { name: 'EUROPOORT', coords: [4.09, 51.95] },
  { name: 'WAALHAVEN', coords: [4.42, 51.885] },
]

const vessels = computed(() => props.vessels ?? DEFAULT_VESSELS)
const activeMmsi = ref(DEFAULT_VESSELS[0]?.mmsi ?? '')
const activeVessel = computed(() => vessels.value.find((v) => v.mmsi === activeMmsi.value) ?? vessels.value[0])

const mapRef = ref<LeafletMapRef | null>(null)

function selectVessel(v: Vessel) {
  activeMmsi.value = v.mmsi
  mapRef.value?.flyTo?.({ center: v.coords, zoom: 11.5, duration: 800 })
}
</script>

<template>
  <div data-slot="leaflet-maritime-vessel-map" :class="cn('grid gap-4 lg:grid-cols-[1fr_320px]', props.class)">
    <div class="border-border bg-card relative h-[480px] overflow-hidden rounded-xl border">
      <LeafletMap ref="mapRef" variant="dark" :center="MAP_CENTER" :zoom="11" class="h-full w-full">
        <!-- Shipping lanes -->
        <LeafletPolyline
          v-for="(lane, i) in SHIPPING_LANES"
          :key="i"
          :lng-lat-path="lane"
          color="#22d3ee"
          :weight="2"
          :opacity="0.45"
          dash-array="6 6"
          line-cap="round"
        />

        <!-- Port terminals -->
        <LeafletMarker v-for="p in PORTS" :key="p.name" :lng-lat="p.coords" anchor="center">
          <div class="flex flex-col items-center">
            <span class="size-2.5 rotate-45 rounded-[2px] border border-cyan-400/70 bg-cyan-500/40" />
            <span
              class="border-border bg-card/80 text-muted-foreground mt-1 rounded border px-1 py-0.5 font-mono text-[9px] tracking-wider whitespace-nowrap"
            >
              {{ p.name }}
            </span>
          </div>
        </LeafletMarker>

        <!-- AIS vessels -->
        <LeafletMarker v-for="v in vessels" :key="v.mmsi" :lng-lat="v.coords" anchor="center" @click="selectVessel(v)">
          <div class="group relative flex cursor-pointer flex-col items-center">
            <div
              class="flex size-7 items-center justify-center rounded-full font-bold text-cyan-400 transition-transform hover:scale-125"
              :class="activeMmsi === v.mmsi ? 'bg-cyan-500/20 ring-2 ring-cyan-400' : 'bg-background/80'"
              :style="{ transform: `rotate(${v.heading}deg)` }"
            >
              ▲
            </div>
            <span
              class="border-border bg-card/90 mt-1 rounded border px-1 py-0.5 font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap shadow-xs"
              :class="activeMmsi === v.mmsi ? 'border-cyan-400/50 text-cyan-400' : 'text-foreground'"
            >
              {{ v.name }}
            </span>
          </div>
        </LeafletMarker>
      </LeafletMap>
    </div>

    <!-- AIS Telemetry Drawer -->
    <Card class="flex flex-col justify-between">
      <CardHeader>
        <div class="flex items-center justify-between">
          <Badge variant="outline" class="font-mono text-xs">{{ activeVessel.type }}</Badge>
          <Badge class="border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">{{
            activeVessel.status
          }}</Badge>
        </div>
        <CardTitle class="mt-2 font-mono text-lg">{{ activeVessel.name }}</CardTitle>
        <CardDescription class="font-mono text-xs"
          >MMSI: {{ activeVessel.mmsi }} • Flag: {{ activeVessel.flag }}</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="border-border bg-muted/40 grid grid-cols-2 gap-2 rounded-lg border p-2.5 font-mono text-xs">
          <div>
            <div class="text-muted-foreground text-[10px] uppercase">Speed Over Ground</div>
            <div class="text-foreground text-sm font-bold">{{ activeVessel.speedKnots }} kts</div>
          </div>
          <div>
            <div class="text-muted-foreground text-[10px] uppercase">Heading</div>
            <div class="text-foreground text-sm font-bold">{{ activeVessel.heading }}°</div>
          </div>
          <div class="mt-2">
            <div class="text-muted-foreground text-[10px] uppercase">Max Draught</div>
            <div class="text-foreground text-sm font-bold">{{ activeVessel.draught }}</div>
          </div>
          <div class="mt-2">
            <div class="text-muted-foreground text-[10px] uppercase">Destination</div>
            <div class="text-foreground truncate text-xs font-bold">{{ activeVessel.dest }}</div>
          </div>
        </div>

        <div class="border-border space-y-1 border-t pt-3">
          <div class="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
            Rotterdam Approach Traffic
          </div>
          <button
            v-for="v in vessels"
            :key="v.mmsi"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors"
            :class="
              activeMmsi === v.mmsi
                ? 'bg-accent text-accent-foreground font-semibold'
                : 'hover:bg-muted text-muted-foreground'
            "
            @click="selectVessel(v)"
          >
            <span class="font-mono">{{ v.name }}</span>
            <span class="font-mono text-[10px] opacity-75">{{ v.speedKnots }} kts</span>
          </button>
        </div>

        <Button variant="outline" size="sm" class="w-full font-mono text-xs" @click="selectVessel(activeVessel)">
          Center on Vessel
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
